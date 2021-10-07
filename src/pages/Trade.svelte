<script lang="ts">
  import CoinRow from '../components/CoinRow.svelte';
  import TradeButton from '../components/TradeButton.svelte';
  import SelectCoin from '../components/SelectCoin.svelte';
  import {
    Coin,
    Direction,
    TradeButtonStatus,
    SupportedPairs,
  } from '../constants';

  let sendCoin = Coin.Bitcoin;
  let receiveCoin = Coin.Tether;

  let sendAmount = undefined;
  let receiveAmount = undefined;

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
      return;
    }

    receiveCoin = coin;
  };

  const onSendAmountChange = () => {
    console.log('send changing...');
  };

  const onReceiveAmountChange = () => {
    console.log('receive changing...');
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
