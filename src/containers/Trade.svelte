<script lang="ts">
  import { IdentityType, TradeOrder } from 'tdex-sdk';
  import { coinStore } from '../stores/coinstore';
  import CoinRow from '../components/CoinRow.svelte';
  import ArrowDownIcon from '../components/icons/ArrowDownIcon.svelte';
  import TradeButton from '../components/TradeButton.svelte';
  import SelectCoinModal from '../components/SelectCoinModal.svelte';
  import SelectFiatModal from '../components/SelectFiatModal.svelte';
  import TradeModal from '../components/TradeModal.svelte';
  import FiatValue from '../components/FiatValue.svelte';
  import {
    Fiat,
    TradeButtonStatus,
    TradeStatus,
    AssetHashes,
    AssetNames,
    NetworkNames,
  } from '../constants';
  import {
    calculateMarketPrice,
    computeOrders,
    discoverBestOrder,
    makeTrade,
  } from '../utils/tdex';
  import { fromSatoshi, toSatoshi } from '../utils/format';
  import BrowserInjectIdentity from '../utils/browserInject';
  import { isValidAmount } from '../utils/checks';
  import { Direction, Coin, CoinPair, coinPairToPair } from '../utils/types';
  import { allTradableAssets, tdexStore } from '../stores/tdexstore';
  import { marinaStore } from 'svelte-marina-button';
  import { utxoStore } from '../stores/utxostore';
  import { showToast } from '../utils/toast';
  import LoadingModal from '../components/LoadingModal.svelte';
  import { getExplorerForNetwork } from '../utils/explorer';

  utxoStore.subscribe(() => null); // trigger utxo update

  let activeInputDirection: Direction = 'send';

  /**
   * default trade pair is LBTC / USDT for a given network
   * @param network network name to get asset hash for
   * @returns CoinPair, the pair of coins
   */
  function defaultPair(network: string): CoinPair {
    const lbtc = AssetHashes[AssetNames.LBTC];
    const usdt = AssetHashes[AssetNames.USDT];
    const lbtcHash = lbtc[network] || lbtc[NetworkNames.MAINNET];
    const usdtHash = usdt[network] || usdt[NetworkNames.MAINNET];
    return {
      send: coinStore.getCoin(lbtcHash),
      receive: coinStore.getCoin(usdtHash)
    }
  }

  $: pair = defaultPair($marinaStore.network);

  $: explorer = getExplorerForNetwork($marinaStore.network);

  $: orders = computeOrders(coinPairToPair(pair), $tdexStore.markets);

  let bestOrder: TradeOrder = undefined;

  allTradableAssets.subscribe((assets) => {
    coinStore.updateWithAssets(assets);
  });

  $: tradableCoins = $allTradableAssets.map((a) => coinStore.getCoin(a));

  let fiatCoin = Fiat.USD;

  let sendAmount = undefined;
  let receiveAmount = undefined;
  let coinsRatio = undefined;

  let showCoinModal = false;
  let showFiatModal = false;
  let showTradeModal = false;

  let loading = false;

  let txid = undefined;
  let tradeError = undefined;
  let tradeStatus = TradeStatus.WAITING;

  $: tradeButton = !$marinaStore.enabled
    ? TradeButtonStatus.ConnectWallet
    : $utxoStore.unspents.length === 0
    ? TradeButtonStatus.NoUtxos
    : orders.length === 0
    ? TradeButtonStatus.InvalidPair
    : !isValidAmount(sendAmount) || !isValidAmount(receiveAmount)
    ? TradeButtonStatus.EnterAmount
    : TradeButtonStatus.Trade;

  const onCoinClick = (direction: Direction) => {
    activeInputDirection = direction;
    showCoinModal = !showCoinModal;
  };

  const onCoinSelected = (event: CustomEvent<{ coin: Coin }>) => {
    const { coin } = event.detail;
    // clean up
    coinsRatio = undefined;
    pair[activeInputDirection] = coin;

    if (activeInputDirection === 'send') {
      sendAmount = undefined;
    } else {
      receiveAmount = undefined;
    }

    onAmountChange(activeInputDirection);
  };

  const onFiatClick = () => {
    showFiatModal = !showFiatModal;
  };

  const onFiatSelected = (event: CustomEvent<{ fiat: Fiat }>) => {
    const { fiat } = event.detail;
    fiatCoin = fiat;
  };

  const onSwap = () => {
    pair = {
      send: pair.receive,
      receive: pair.send,
    };
    [sendAmount, receiveAmount] = [receiveAmount, sendAmount];
    onSendAmountChange();
  };

  const onAmountChange = (which: Direction) => async () => {
    const amount = which === 'send' ? sendAmount : receiveAmount;
    const fromCoin = which === 'send' ? pair.send : pair.receive;
    const toCoin = which === 'send' ? pair.receive : pair.send;

    if (!isValidAmount(amount)) return;

    loading = true;

    if (!amount) {
      if (which === 'send') {
        receiveAmount = undefined;
      } else {
        sendAmount = undefined;
      }

      loading = false;
      return; // skip if undefined
    }

    try {
      const amountInSatoshis = toSatoshi(amount, fromCoin.precision);
      bestOrder = await discoverBestOrder(
        orders,
        coinPairToPair(pair),
        which,
        amountInSatoshis.toNumber()
      );

      // then compute price in order to update the other input
      const toAmount = await calculateMarketPrice(
        bestOrder,
        fromCoin.assetHash,
        amountInSatoshis.toNumber()
      );

      const toSatoshis = fromSatoshi(toAmount, toCoin.precision);

      coinsRatio = parseFloat(
        (toSatoshis.toNumber() / amount).toFixed(fromCoin.precision)
      );

      if (which === 'send') {
        receiveAmount = toSatoshis.toString();
      } else {
        sendAmount = toSatoshis.toString();
      }
    } catch (err: any) {
      tradeButton = TradeButtonStatus.ErrorPreview;
      showToast(err);
      console.error(err);
    } finally {
      loading = false;
    }
  };

  const onSendAmountChange = onAmountChange('send');
  const onReceiveAmountChange = onAmountChange('receive');

  const onTradeSubmit = async () => {
    const identity = new BrowserInjectIdentity({
      chain: 'liquid',
      type: IdentityType.Inject,
      opts: {
        windowProvider: 'marina',
      },
    });

    // be sure the state is cleaned up in case of subsequent trades
    tradeStatus = TradeStatus.WAITING;

    loading = true;
    showTradeModal = true;

    try {
      const amountToBeSentInSatoshis = toSatoshi(
        sendAmount,
        pair.send.precision
      );
      console.debug(
        `trading ${amountToBeSentInSatoshis} of ${pair.send.ticker} for ${pair.receive.ticker}...`
      );

      txid = await makeTrade(
        identity,
        {
          sats: amountToBeSentInSatoshis.toNumber(),
          asset: pair.send.assetHash,
        },
        bestOrder,
        $utxoStore.unspents,
        explorer,
      );

      tradeStatus = TradeStatus.COMPLETED;
    } catch (e) {
      console.error(e);
      tradeStatus = TradeStatus.ERROR;
      tradeError = (e as Error).message;
    } finally {
      loading = false;
    }
  };
</script>

<form class="box has-background-black">
  <div class="is-flex is-justify-content-space-between is-align-items-baseline">
    <h1 class="title has-text-white">Trade</h1>
    {#if coinsRatio}
      <p>1 {pair.send.ticker} = {coinsRatio} {pair.receive.ticker}</p>
    {/if}
  </div>

  <!-- FROM -->
  <div class="field has-addons has-background-dark">
    <div class="control">
      <button
        type="button"
        class="button is-large is-white coin-button has-background-dark"
        on:click={() => onCoinClick('send')}
      >
        <CoinRow coin={pair.send} showTicker />
      </button>
    </div>
    <div class="control is-expanded">
      <input
        class="input is-large has-background-dark has-text-white has-text-right"
        type="text"
        placeholder="0.00"
        bind:value={sendAmount}
        on:input={onSendAmountChange}
      />
      <!-- svelte-ignore a11y-missing-attribute -->
      <a on:click={() => onFiatClick()}>
        <FiatValue coin={pair.send} amount={sendAmount} fiat={fiatCoin} />
      </a>
    </div>
  </div>
  <!-- SWAP -->
  <div class="has-text-centered">
    <!-- svelte-ignore a11y-missing-attribute -->
    <a on:click={onSwap}>
      <ArrowDownIcon />
    </a>
  </div>
  <!-- TO -->
  <div class="field has-addons has-background-dark">
    <div class="control">
      <button
        type="button"
        class="button is-large is-white coin-button has-background-dark"
        on:click={() => onCoinClick('receive')}
      >
        <CoinRow coin={pair.receive} showTicker />
      </button>
    </div>
    <div class="control is-expanded">
      <input
        class="input is-large has-background-dark has-text-white has-text-right"
        type="text"
        placeholder="0.00"
        bind:value={receiveAmount}
        on:input={onReceiveAmountChange}
      />
      <!-- svelte-ignore a11y-missing-attribute -->
      <a on:click={() => onFiatClick()}>
        <FiatValue coin={pair.receive} amount={receiveAmount} fiat={fiatCoin} />
      </a>
    </div>
  </div>

  <div class="field mt-3">
    <div class="control has-text-centered">
      <TradeButton type={tradeButton} on:trade={onTradeSubmit} {loading} />
    </div>
  </div>
</form>
<SelectCoinModal
  {tradableCoins}
  bind:active={showCoinModal}
  on:selected={onCoinSelected}
/>
<SelectFiatModal bind:active={showFiatModal} on:selected={onFiatSelected} />
<TradeModal
  bind:active={showTradeModal}
  status={tradeStatus}
  error={tradeError}
  {txid}
  {sendAmount}
  sendCoin={pair.send}
  {receiveAmount}
  receiveCoin={pair.receive}
/>
<LoadingModal />

<style>
  .coin-button {
    box-shadow: none !important;
    width: 140px;
  }
</style>
