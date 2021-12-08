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
</script>

<div class="modal {active && 'is-active'}">
  <div class="modal-background" on:click={onCancel} />
  <div class="modal-content box has-background-black">
    <div class="columns">
      <div class="column is-half is-offset-one-quarter">
        <h1 class="title has-text-white">Select an asset</h1>
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
      </div>
    </div>
  </div>
</div>
