export const enum Direction {
  SEND,
  RECEIVE
}

export const enum TradeButtonStatus {
  Trade = "Trade",
  EnterAmount = "Enter an amount",
  SelectAsset = "Select an asset",
  InvalidPair = "Pair not supported",
}

export enum Coin {
  Bitcoin = "Liquid Bitcoin",
  Tether = "Tether USD",
  LCAD = "Liquid CAD"
};

export const CoinTicker: Record<string,string> = {
  [Coin.Bitcoin]: "L-BTC",
  [Coin.Tether]: "USDt",
  [Coin.LCAD]: "LCAD"
}


export const SupportedPairs = [
  [Coin.Bitcoin, Coin.Tether],
  [Coin.Bitcoin, Coin.LCAD],
] 
