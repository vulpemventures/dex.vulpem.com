<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { TradeButtonStatus } from '../constants';

  const dispatch = createEventDispatcher();

  const onClick = () => {
    dispatch('trade');
  };

  export let type: string;
  export let loading: boolean;

  $: disabled = type !== TradeButtonStatus.Trade;
  $: tradeButtonMessage = type;
</script>

<button
  type="button"
  class="button is-primary is-medium is-fullwidth is-rounded {loading &&
    'is-loading'}"
  {disabled}
  on:click={onClick}
>
  {tradeButtonMessage}
</button>
