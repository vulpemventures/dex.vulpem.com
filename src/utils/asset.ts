import axios from "axios";
import type { Coin } from "./types";

function tickerFromAssetHash(assetHash: string) {
  return assetHash.slice(0, 4).toUpperCase();
}

export function assetHashToCoin(assetHash: string): Coin {
  const ticker = tickerFromAssetHash(assetHash);
  const precision = 8;
  const name = 'unknown';
  return {
    name,
    precision,
    ticker,
    assetHash
  };
}

/**
 * a non-blocking function that returns the coin data for a given asset hash
 * @param assetHash asset hash to get coin data for
 * @param explorerLiquidAPI the api supporting /assets/{assetHash} endpoints
 */
export async function getAssetData(assetHash: string, explorerLiquidAPI: string): Promise<Coin> {
  try {
    const { precision, ticker, name } = (await axios.get(`${explorerLiquidAPI}/asset/${assetHash}`)).data;
    return {
      precision: precision ?? 8,
      ticker: ticker || tickerFromAssetHash(assetHash),
      name: name || '',
      assetHash
    };
  } catch (e) {
    console.error(e);
    return assetHashToCoin(assetHash);
  }
}