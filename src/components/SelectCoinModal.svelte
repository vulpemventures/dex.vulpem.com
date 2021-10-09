<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  import CoinRow from './CoinRow.svelte';
  import { Coin } from '../constants';

  export let active: boolean;

  const onCancel = () => {
    active = false;
  };

  const onSelect = (coin: string) => {
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
          <li class="mt-3">
            <!-- svelte-ignore a11y-missing-attribute -->
            <a on:click={() => onSelect(Coin.Bitcoin)}>
              <CoinRow name={Coin.Bitcoin} />
            </a>
          </li>
          <li class="mt-3">
            <!-- svelte-ignore a11y-missing-attribute -->
            <a on:click={() => onSelect(Coin.Tether)}>
              <CoinRow name={Coin.Tether} />
            </a>
          </li>
          <li class="mt-3">
            <!-- svelte-ignore a11y-missing-attribute -->
            <a on:click={() => onSelect(Coin.LCAD)}>
              <CoinRow name={Coin.LCAD} />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
