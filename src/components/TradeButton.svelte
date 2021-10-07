<script lang="ts">
  import { TradeButtonStatus } from '../constants';

  export let type: string;

  $: disabled =
    type === TradeButtonStatus.EnterAmount ||
    type === TradeButtonStatus.SelectAsset ||
    type === TradeButtonStatus.InvalidPair;
  $: tradeButtonMessage = type;
</script>

<button
  type="button"
  class="button is-primary is-medium is-fullwidth"
  {disabled}>{tradeButtonMessage}</button
>
