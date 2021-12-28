<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import CoinRow from './CoinRow.svelte';
  import type { Coin } from '../utils/types';

  const dispatch = createEventDispatcher();

  export let tradableCoins: Coin[] = [];
  export let active: boolean;

  const onCancel = () => {
    active = false;
  };

  const onSelect = (coin: Coin) => {
    dispatch('selected', { coin });
    active = false;
  };

  // Show a loading message while we wait for tdex markets
  // After a timeout delay, show a different message
  enum MESSAGES {
    loading = 'Discovering TDEX providers...',
    timeout = 'All TDEX providers are not available. Try again later',
  }
  let message = MESSAGES.loading;
  const timeoutDelay = 60 * 1000; // 60 seconds
  setTimeout(() => (message = MESSAGES.timeout), timeoutDelay);
  $: message;
</script>

<div class="modal {active && 'is-active'}">
  <div class="modal-background" on:click={onCancel} />
  <div class="modal-content box has-background-black">
    <div class="columns">
      <div class="column is-half is-offset-one-quarter">
        <h1 class="title has-text-white">Select an asset</h1>
        {#if tradableCoins.length > 0}
          <ul class="mt-6">
            {#each tradableCoins as coin}
              <li class="mt-3">
                <!-- svelte-ignore a11y-missing-attribute -->
                <a on:click={() => onSelect(coin)}>
                  <CoinRow {coin} />
                </a>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="has-text-white">{message}</p>
        {/if}
      </div>
    </div>
  </div>
</div>
