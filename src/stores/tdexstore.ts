import { derived, readable, Subscriber } from "svelte/store";
import type { MarketInterface } from "tdex-sdk";
import { getProvidersFromRegistry, getMarketsForProviders } from "../utils/tdex";
import type { TDEXProvider } from "../utils/types";
import { detectProvider, EventListenerID, MarinaProvider } from "marina-provider";
import { NetworkNames } from "../constants";

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
  let intervalHandler: NodeJS.Timeout, networkChangeListenerID: string;
  const listeners: EventListenerID[] = [];

  /**
   * Fetch available providers from registry url
   * Fetch markets from each provider
   * @param network  the name of the network choosen by the user
   */
  const fetchProvidersAndMarketsAndSet = async (network: string = NetworkNames.MAINNET) => {
    const providers = await getProvidersFromRegistry(network);
    const markets = await getMarketsForProviders(providers);
    set({ providers, markets });
  }

  /**
   * After network change (and also for the first time):
   * - fetch providers and markets for network
   * - create new interval (of one hour) to refresh providers and markets
   * - create new event listener for when there's a network change
   * @param marina the marina extension provider, needed to deal with event listeners
   * @param network the name of the network choosen by the user
   */
  const afterNetworkChange = (marina: MarinaProvider, network: string = NetworkNames.MAINNET) => {
    // fetch providers and markets for network
    fetchProvidersAndMarketsAndSet(network);

    // create new interval (of one hour) to refresh providers and markets
    if (intervalHandler) clearInterval(intervalHandler);
    intervalHandler = setInterval(() => fetchProvidersAndMarketsAndSet(network), INTERVAL_FETCH_PROVIDERS);

    // create new event listener for when there's a network change
    if (networkChangeListenerID) marina.off(networkChangeListenerID);
    networkChangeListenerID = marina.on('NETWORK', (network) => afterNetworkChange(marina, network));
    listeners.push(networkChangeListenerID);
  }

  detectProvider('marina')
    .then((marina: MarinaProvider) => marina.getNetwork().then((network) => afterNetworkChange(marina, network)))
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
