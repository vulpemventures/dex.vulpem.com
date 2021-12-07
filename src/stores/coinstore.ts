import { Readable, writable } from "svelte/store";
import { EXPLORER, ASSETS } from "../constants";
import { assetHashToCoin, getAssetData } from "../utils/asset";
import type { Coin } from "../utils/types";

interface State {
  coins: Coin[]
}

export type CoinStore = Readable<State> & {
  updateWithAssets(assets: string[]): Promise<void>
  getCoin(assetHash: string): Coin
}

function createCoinStore(initialCoins: Coin[]): CoinStore {
  let state: State = { coins: initialCoins };
  const { subscribe, set, update } = writable<State>(state);

  subscribe((v) => state = v);

  return {
    subscribe,
    getCoin: (assetHash: string) => state.coins.find(c => c.assetHash === assetHash) || assetHashToCoin(assetHash),
    updateWithAssets: async (assets: string[]) => {
      for (const asset of assets) {
        if (!state.coins.find(c => c.assetHash === asset)) {
          const newCoin = await getAssetData(asset, EXPLORER);
          update((s) => {
            s.coins.push(newCoin);
            return s;
          });
        }
      }
    }
  }
}

export const coinStore = createCoinStore(ASSETS);
