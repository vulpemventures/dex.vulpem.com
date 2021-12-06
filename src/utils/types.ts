export interface TDEXProvider {
  name: string;
  endpoint: string;
}

export function isTDEXProvider(
  provider: any
): provider is TDEXProvider {
  return (
    typeof provider === 'object' &&
    typeof provider.name === 'string' &&
    typeof provider.endpoint === 'string'
  );
}

export interface CoinPair {
  send: Coin;
  receive: Coin;
}

export interface Pair {
  send: Coin['assetHash'],
  receive: Coin['assetHash'],
}

export const coinPairToPair = (coinPair: CoinPair): Pair => ({ send: coinPair.send.assetHash, receive: coinPair.receive.assetHash });

export type Direction = keyof Pair;

export interface Coin {
  name: string,
  precision: number,
  ticker: string,
  assetHash: string
}