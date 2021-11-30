<script>
  import { FiatSymbol } from '../constants';
  export let name;
</script>

<div class="columns is-mobile is-vcentered">
  <div class="column is-one-third">
    <p>{FiatSymbol[name]}</p>
  </div>
  <div class="column is-two-third">
    <p>{name}</p>
  </div>
</div>
