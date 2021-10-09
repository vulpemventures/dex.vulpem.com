<script lang="ts">
  import { TradeStatus } from '../constants';
  import SuccessIcon from './SuccessIcon.svelte';
  import ErrorIcon from './ErrorIcon.svelte';

  export let active: boolean;

  export let status: TradeStatus;
  export let txid: string;
  export let error: string;

  export let sendAmount;
  export let receiveAmount;
  export let sendCoin;
  export let receiveCoin;

  const onCancel = () => {
    active = false;
  };
</script>

<div class="modal {active && 'is-active'}">
  <div class="modal-background" on:click={onCancel} />
  <div class="modal-content box has-background-black">
    <div class="columns">
      <div class="column is-full has-text-centered">
        {#if status === TradeStatus.WAITING}
          <div class="loader-wrapper is-active">
            <div class="loader is-loading" />
          </div>
          <div class="block mt-6 mb-3">
            <h1 class="title has-text-white">Waiting for Confirmation...</h1>
            <p class="subtitle">
              Swapping {sendAmount}
              {sendCoin} for {receiveAmount}
              {receiveCoin}
            </p>
            <p class="subtitle is-6 has-text-weight-light has-text-grey">
              Confirm this transaction in your Marina wallet
            </p>
          </div>
        {:else if status === TradeStatus.COMPLETED}
          <SuccessIcon />
          <div class="block mt-6 mb-3">
            <h1 class="title has-text-white">Trade Completed</h1>
            <a
              target="_blank"
              href={'https://blockstream.info/liquid/tx/' + txid}
            >
              <p class="subtitle">View on Explorer</p>
            </a>
            <button
              type="button"
              class="button is-primary is-medium is-fullwidth is-rounded mt-6"
              on:click={onCancel}
            >
              Close
            </button>
          </div>
        {:else}
          <ErrorIcon />
          <div class="block mt-6 mb-3">
            <h1 class="title has-text-white">Something went wrong</h1>
            <p class="subtitle">
              {error}
            </p>
            <button
              type="button"
              class="button is-primary is-medium is-fullwidth is-rounded mt-6"
              on:click={onCancel}
            >
              Close
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
