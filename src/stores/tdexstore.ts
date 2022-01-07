import { derived, readable, Subscriber } from "svelte/store";
import type { MarketInterface } from "tdex-sdk";
import { getProvidersFromRegistry, getMarketsForProviders } from "../utils/tdex";
import type { TDEXProvider } from "../utils/types";
import { detectProvider, EventListenerID, MarinaProvider } from "marina-provider";

export interface TdexStore {
  providers: TDEXProvider[];
  markets: Record<TDEXProvider['endpoint'], MarketInterface[]>;
}

const INTERVAL_FETCH_PROVIDERS = 1000 * 60 * 60; // 1 hour

const initialTdexState: TdexStore = {
  providers: [],
  markets: {},
};

export const tdexStore = readable<TdexStore>(initialTdexState, function(set: Subscriber<TdexStore>) {
  const listeners: EventListenerID[] = [];
  const fetchProvidersAndMarketsAndSet = async () => {
    const providers = await getProvidersFromRegistry();
    const markets = await getMarketsForProviders(providers);
    set({ providers, markets });
  }
  fetchProvidersAndMarketsAndSet();
  setInterval(fetchProvidersAndMarketsAndSet, INTERVAL_FETCH_PROVIDERS);
  detectProvider('marina')
    .then((marina: MarinaProvider) => {
      const networkChange = marina.on('NETWORK', () => fetchProvidersAndMarketsAndSet());
      listeners.push(networkChange);
    })
    .catch(console.error);
});

function assetHashFromMarkets(markets: MarketInterface[]): string[] {
  const all: string[] = []
  for (const m of markets) {
    all.push(m.baseAsset, m.quoteAsset);
  }
  return Array.from(new Set(all));
}

function allMarkets(markets: Record<string, MarketInterface[]>): MarketInterface[] {
  const all: MarketInterface[] = [];
  for (const key in markets) {
    all.push(...markets[key]);
  }
  return all;
}

export const allTradableAssets = derived(tdexStore, tdex => assetHashFromMarkets(allMarkets(tdex.markets)), []);
