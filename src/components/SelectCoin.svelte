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

<div class="modal is-active">
  <div class="modal-background" />
  <div class="modal-content box">
    <div class="columns">
      <div class="column is-half is-offset-one-quarter">
        <h1 class="title">Select an asset</h1>
        <ul>
          <li>
            <!-- svelte-ignore a11y-missing-attribute -->
            <a on:click={() => onSelect(Coin.Bitcoin)}>
              <CoinRow name={Coin.Bitcoin} />
            </a>
          </li>
          <li>
            <!-- svelte-ignore a11y-missing-attribute -->
            <a on:click={() => onSelect(Coin.Tether)}>
              <CoinRow name={Coin.Tether} />
            </a>
          </li>
          <li>
            <!-- svelte-ignore a11y-missing-attribute -->
            <a on:click={() => onSelect(Coin.LCAD)}>
              <CoinRow name={Coin.LCAD} />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <button class="modal-close is-large" aria-label="close" on:click={onCancel} />
</div>
