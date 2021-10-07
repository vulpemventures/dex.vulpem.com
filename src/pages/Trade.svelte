<script lang="ts">
  import {
    Trade,
    IdentityType,
    greedyCoinSelector,
    TradeType,
    TraderClient,
  } from 'tdex-sdk';

  import CoinRow from '../components/CoinRow.svelte';
  import TradeButton from '../components/TradeButton.svelte';
  import SelectCoin from '../components/SelectCoin.svelte';
  import {
    Coin,
    Direction,
    TradeButtonStatus,
    SupportedPairs,
    CoinToAssetByChain,
  } from '../constants';

  /*   

    import BrowserInjectIdentity from '../utils/browserInject';

  const identity = new BrowserInjectIdentity({
    chain:'liquid',
    type: IdentityType.Inject,
    opts: {
      windowProvider: 'marina',
    },
  }); */

  const client = new TraderClient('https://provider.tdex.network:9945');

  const market = {
    baseAsset:
      '6f0279e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d', // L-BTC
    quoteAsset:
      'ce091c998b83c78bb71a632313ba3760f1763d9cfcffae02258ffa9865a37bd2', // USDT
  };

  let sendCoin = Coin.Bitcoin;
  let receiveCoin = Coin.Tether;

  $: sendAmount = undefined;
  $: receiveAmount = undefined;

  let showCoinModal = false;
  let activeInputDirection = Direction.RECEIVE;

  const isValidAmount = (amt: string) => {
    const numeric = Number(amt);
    return !Number.isNaN(numeric) && numeric > 0;
  };

  const isValidPair = (a: Coin, b: Coin) => {
    return (
      SupportedPairs.some((pair: Coin[]) => {
        return pair.includes(a) && pair.includes(b);
      }) && a !== b
    );
  };

  $: tradeButton = !isValidPair(sendCoin, receiveCoin)
    ? TradeButtonStatus.InvalidPair
    : isValidAmount(sendAmount) && isValidAmount(receiveAmount)
    ? TradeButtonStatus.Trade
    : TradeButtonStatus.EnterAmount;

  const showModal = (direction: Direction) => {
    activeInputDirection = direction;
    showCoinModal = !showCoinModal;
  };

  const onCoinSelected = (event: CustomEvent<{ coin: Coin }>) => {
    const { coin } = event.detail;

    if (activeInputDirection === Direction.SEND) {
      sendCoin = coin;
      // clean up
      sendAmount = undefined;
      return;
    }

    receiveCoin = coin;
    // clean up
    receiveAmount = undefined;
  };

  const onSendAmountChange = async () => {
    console.log('send changing...');

    if (!isValidAmount(sendAmount)) return;
    if (!isValidPair(sendCoin, receiveCoin)) return;

    const assetHash = CoinToAssetByChain['liquid'][sendCoin].hash;
    const isBaseComingIn = assetHash === market.baseAsset;
    const tradeType = isBaseComingIn ? TradeType.SELL : TradeType.BUY;

    const amountInSatoshis = sendAmount * Math.pow(10, 8);

    try {
      const [firstPrice] = await client.marketPrice(
        market,
        tradeType,
        amountInSatoshis,
        assetHash
      );

      receiveAmount = firstPrice.amount / Math.pow(10, 8);
    } catch (err: unknown) {
      (tradeButton as any) = (err as Error).message;
      console.error(err);
    }
  };

  const onReceiveAmountChange = async () => {
    console.log('receive changing...');

    if (!isValidAmount(receiveAmount)) return;
    if (!isValidPair(sendCoin, receiveCoin)) return;

    const assetHash = CoinToAssetByChain['liquid'][receiveCoin].hash;
    const isBaseComingIn = assetHash === market.baseAsset;
    const tradeType = isBaseComingIn ? TradeType.SELL : TradeType.BUY;

    const amountInSatoshis = receiveAmount * Math.pow(10, 8);

    try {
      const [firstPrice] = await client.marketPrice(
        market,
        tradeType,
        amountInSatoshis,
        assetHash
      );

      sendAmount = firstPrice.amount / Math.pow(10, 8);
    } catch (err: unknown) {
      (tradeButton as any) = (err as Error).message;
      console.error(err);
    }
  };
</script>

<div class="columns">
  <div class="column is-half is-offset-one-quarter">
    <form class="box">
      <h1 class="title">Trade</h1>

      <!-- FROM -->
      <div class="field has-addons">
        <div class="control">
          <button
            type="button"
            class="button is-large is-white coin-button"
            on:click={() => showModal(Direction.SEND)}
          >
            <CoinRow name={sendCoin} showTicker />
          </button>
        </div>
        <div class="control is-expanded">
          <input
            class="input is-large"
            type="text"
            placeholder="0.00"
            bind:value={sendAmount}
            on:input={onSendAmountChange}
          />
        </div>
      </div>

      <!-- TO -->
      <div class="field has-addons">
        <div class="control">
          <button
            type="button"
            class="button is-large is-white coin-button"
            on:click={() => showModal(Direction.RECEIVE)}
          >
            <CoinRow name={receiveCoin} showTicker />
          </button>
        </div>
        <div class="control is-expanded">
          <input
            class="input is-large"
            type="text"
            placeholder="0.00"
            bind:value={receiveAmount}
            on:input={onReceiveAmountChange}
          />
        </div>
      </div>

      <TradeButton type={tradeButton} />
    </form>
  </div>
  {#if showCoinModal}
    <SelectCoin bind:active={showCoinModal} on:selected={onCoinSelected} />
  {/if}
</div>

<style>
  .coin-button {
    width: 140px;
  }
</style>
