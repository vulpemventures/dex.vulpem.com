<script lang="ts">
  import { isValidAmount } from '../utils/checks';
  import { CoinGeckoId, Fiat, FiatSymbol, NetworkNames } from '../constants';
  import type { Coin } from '../utils/types';
  import { marinaStore } from 'svelte-marina-button';

  export let coin: Coin;
  export let amount: number;
  export let fiat: Fiat;

  async function getValue(
    id: string | undefined,
    amount: number,
    currency: string | undefined
  ) {
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

  $: id = CoinGeckoId[coin.assetHash];
  $: currency = CoinGeckoId[fiat];
  $: promise = getValue(id, amount, currency);
  $: visible = $marinaStore.network === NetworkNames.MAINNET && amount && id;
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
