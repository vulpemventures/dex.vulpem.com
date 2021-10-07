<script lang="ts">
  import CoinRow from '../components/CoinRow.svelte';
  import SelectCoin from '../components/SelectCoin.svelte';
  import { Coin } from '../constants';

  const enum Direction {
    SEND,
    RECEIVE,
  }

  let showCoinModal = false;
  let activeInputDirection = Direction.RECEIVE;

  let sendCoin = Coin.Bitcoin;
  let receiveCoin = Coin.Tether;

  const showModal = (direction: Direction) => {
    activeInputDirection = direction;
    showCoinModal = !showCoinModal;
  };

  const onCoinSelected = (event: CustomEvent<{ coin: Coin }>) => {
    const { coin } = event.detail;

    console.log(coin);

    if (activeInputDirection === Direction.SEND) {
      sendCoin = coin;
      return;
    }

    receiveCoin = coin;
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
          <input class="input is-large" type="text" placeholder="0.00" />
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
          <input class="input is-large" type="text" placeholder="0.00" />
        </div>
      </div>

      <button type="button" class="button is-primary">Trade</button>
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
