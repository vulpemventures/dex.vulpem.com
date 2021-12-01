<script>
  import { isValidAmount } from '../utils/checks';
  import { CoinGeckoId, FiatSymbol } from '../constants';

  export let coin;
  export let amount;
  export let fiat;

  async function getValue(id, amount, currency) {
    if (!id || !amount || !currency) return;

    const endpoint = 'https://api.coingecko.com/api/v3/coins/markets';
    const res = await fetch(`${endpoint}?vs_currency=${currency}&ids=${id}`);
    const json = await res.json();

    if (!res.ok) throw new Error(json);

    const value = (json[0].current_price * amount).toFixed(2);
    if (!isValidAmount(value)) return;
    return `${FiatSymbol[fiat]} ${value}`;
  }

  let id;
  let currency;
  let promise;
  let visible;

  $: id = CoinGeckoId[coin];
  $: currency = CoinGeckoId[fiat];
  $: promise = getValue(id, amount, currency);
  $: visible = amount && id;
</script>

{#if visible}
  {#await promise then value}
    {#if value}
      <p>{value}</p>
    {/if}
  {/await}
{/if}

<style>
  p {
    color: white;
    padding-bottom: 1em;
    padding-right: calc(1.25em - 2px);
    text-align: right;
  }
</style>
