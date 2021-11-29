<script lang="ts">
  import { onDestroy } from 'svelte';
  import {
    Trade,
    IdentityType,
    greedyCoinSelector,
    TradeType,
    TraderClient,
    UtxoInterface,
  } from 'tdex-sdk';

  import { marinaStore, MarinaStore } from '../stores/store';

  import CoinRow from '../components/CoinRow.svelte';
  import ArrowDownIcon from '../components/icons/ArrowDownIcon.svelte';
  import TradeButton from '../components/TradeButton.svelte';
  import SelectCoinModal from '../components/SelectCoinModal.svelte';
  import TradeModal from '../components/TradeModal.svelte';
  import {
    Coin,
    Direction,
    TradeButtonStatus,
    CoinToAssetByChain,
    TradeStatus,
  } from '../constants';

  import { getProviderByPair } from '../utils/tdex';
  import { fromSatoshi, toSatoshi } from '../utils/format';
  import BrowserInjectIdentity from '../utils/browserInject';
  import { isValidAmount, isValidPair } from '../utils/checks';

  let isWalletConnected = false;
  const unsubscribe = marinaStore.subscribe((s: MarinaStore) => {
    isWalletConnected = s.enabled;
  });

  let sendCoin = Coin.Bitcoin;
  let receiveCoin = Coin.Tether;

  let sendAmount = undefined;
  let receiveAmount = undefined;

  let showCoinModal = false;
  let showTradeModal = false;

  let activeInputDirection = Direction.RECEIVE;

  let loading = false;

  let txid = undefined;
  let tradeError = undefined;
  let tradeStatus = TradeStatus.WAITING;

  $: tradeButton = !isWalletConnected
    ? TradeButtonStatus.ConnectWallet
    : !isValidPair(sendCoin, receiveCoin)
    ? TradeButtonStatus.InvalidPair
    : !isValidAmount(sendAmount) || !isValidAmount(receiveAmount)
    ? TradeButtonStatus.EnterAmount
    : TradeButtonStatus.Trade;

  let provider = getProviderByPair([sendCoin, receiveCoin]);

  const onCoinClick = (direction: Direction) => {
    activeInputDirection = direction;
    showCoinModal = !showCoinModal;
  };

  const onCoinSelected = (event: CustomEvent<{ coin: Coin }>) => {
    const { coin } = event.detail;

    if (activeInputDirection === Direction.SEND) {
      sendCoin = coin;
      //update the provider
      provider = getProviderByPair([sendCoin, receiveCoin]);
      // clean up
      sendAmount = undefined;
      return;
    }

    receiveCoin = coin;
    //update the provider
    provider = getProviderByPair([sendCoin, receiveCoin]);
    // clean up
    receiveAmount = undefined;
  };

  const onSwap = () => {
    [sendCoin, receiveCoin] = [receiveCoin, sendCoin];
    [sendAmount, receiveAmount] = [receiveAmount, sendAmount];
  };

  const onSendAmountChange = async () => {
    if (!isValidAmount(sendAmount)) return;
    if (!isValidPair(sendCoin, receiveCoin)) return;

    loading = true;

    const { hash, precision } = CoinToAssetByChain['liquid'][sendCoin];
    const isBaseComingIn = hash === provider.market.baseAsset;
    const tradeType = isBaseComingIn ? TradeType.SELL : TradeType.BUY;

    const amountInSatoshis = toSatoshi(sendAmount, precision);

    try {
      const client = new TraderClient(provider.endpoint);
      const [firstPrice] = await client.marketPrice(
        provider.market,
        tradeType,
        amountInSatoshis.toNumber(),
        hash
      );

      receiveAmount = fromSatoshi(
        firstPrice.amount.toString(),
        CoinToAssetByChain['liquid'][receiveCoin].precision
      ).toString();
    } catch (err: unknown) {
      tradeButton = TradeButtonStatus.ErrorPreview;
      console.error(err);
    } finally {
      loading = false;
    }
  };

  const onReceiveAmountChange = async () => {
    if (!isValidAmount(receiveAmount)) return;
    if (!isValidPair(sendCoin, receiveCoin)) return;

    loading = true;

    const { hash, precision } = CoinToAssetByChain['liquid'][receiveCoin];
    const isBaseComingIn = hash === provider.market.quoteAsset;
    const tradeType = isBaseComingIn ? TradeType.SELL : TradeType.BUY;

    const amountInSatoshis = toSatoshi(receiveAmount, precision);

    try {
      const client = new TraderClient(provider.endpoint);
      const [firstPrice] = await client.marketPrice(
        provider.market,
        tradeType,
        amountInSatoshis.toNumber(),
        hash
      );

      sendAmount = fromSatoshi(
        firstPrice.amount.toString(),
        CoinToAssetByChain['liquid'][sendCoin].precision
      ).toString();
    } catch (err: unknown) {
      tradeButton = TradeButtonStatus.ErrorPreview;
      console.error(err);
    } finally {
      loading = false;
    }
  };

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
      const utxos = await window.marina.getCoins();
      const trade = new Trade({
        providerUrl: provider.endpoint,
        explorerUrl: 'https://blockstream.info/liquid/api',
        coinSelector: greedyCoinSelector(),
        utxos: utxos.filter((u) => (u as UtxoInterface).prevout),
      });

      const { hash, precision } = CoinToAssetByChain['liquid'][sendCoin];
      const amountToBeSentInSatoshis = toSatoshi(sendAmount, precision);

      const isBuy = hash === provider.market.quoteAsset;

      console.debug(
        `trading ${amountToBeSentInSatoshis} of ${sendCoin} for ${receiveCoin}...`
      );

      if (isBuy) {
        txid = await trade.buy({
          market: provider.market,
          amount: amountToBeSentInSatoshis.toNumber(),
          asset: hash,
          identity,
        });
      } else {
        txid = await trade.sell({
          market: provider.market,
          amount: amountToBeSentInSatoshis.toNumber(),
          asset: hash,
          identity,
        });
      }

      tradeStatus = TradeStatus.COMPLETED;
    } catch (e) {
      console.error(e);
      tradeStatus = TradeStatus.ERROR;
      tradeError = (e as Error).message;
    } finally {
      loading = false;
    }
  };

  onDestroy(unsubscribe);
</script>

<form class="box has-background-black">
  <h1 class="title has-text-white">Trade</h1>

  <!-- FROM -->
  <div class="field has-addons">
    <div class="control">
      <button
        type="button"
        class="button is-large is-white coin-button has-background-dark"
        on:click={() => onCoinClick(Direction.SEND)}
      >
        <CoinRow name={sendCoin} showTicker />
      </button>
    </div>
    <div class="control is-expanded">
      <input
        class="input is-large has-background-dark has-text-white has-text-right"
        type="number"
        placeholder="0.00"
        bind:value={sendAmount}
        on:input={onSendAmountChange}
      />
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
  <div class="field has-addons">
    <div class="control">
      <button
        type="button"
        class="button is-large is-white coin-button has-background-dark"
        on:click={() => onCoinClick(Direction.RECEIVE)}
      >
        <CoinRow name={receiveCoin} showTicker />
      </button>
    </div>
    <div class="control is-expanded">
      <input
        class="input is-large has-background-dark has-text-white has-text-right"
        type="number"
        placeholder="0.00"
        bind:value={receiveAmount}
        on:input={onReceiveAmountChange}
      />
    </div>
  </div>

  <div class="field mt-3">
    <div class="control has-text-centered">
      <TradeButton type={tradeButton} on:trade={onTradeSubmit} {loading} />
    </div>
  </div>
</form>
<SelectCoinModal bind:active={showCoinModal} on:selected={onCoinSelected} />
<TradeModal
  bind:active={showTradeModal}
  status={tradeStatus}
  error={tradeError}
  {txid}
  {sendAmount}
  {sendCoin}
  {receiveAmount}
  {receiveCoin}
/>

<style>
  .coin-button {
    width: 140px;
  }
</style>
