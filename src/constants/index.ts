import type { Coin } from "../utils/types";

export const enum TradeButtonStatus {
  Trade = "Trade",
  EnterAmount = "Enter an amount",
  InvalidPair = "Pair not supported",
  ConnectWallet = "Connect wallet",
  ErrorPreview = "Preview not available",
  NoUtxos = "Need at least one utxo"
}

export const enum TradeStatus {
  WAITING,
  COMPLETED,
  ERROR
}

export enum Fiat {
  CAD = "Canadian dollar",
  EUR = "Euro",
  USD = "US dollar",
};

export const FiatSymbol: Record<Fiat, string> = {
  [Fiat.CAD]: "C$",
  [Fiat.EUR]: "€",
  [Fiat.USD]: "$"
};

export const LIQUID_BTC = '6f0279e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d';
export const LIQUID_USDT = 'ce091c998b83c78bb71a632313ba3760f1763d9cfcffae02258ffa9865a37bd2';
export const LIQUID_CAD = '0e99c1a6da379d1f4151fb9df90449d40d0608f6cb33a5bcbfc8c265f42bab0a';

export const EXPLORER = 'https://blockstream.info/liquid/api'

// used on FiatValue component
export const CoinGeckoId: Record<string,string> = {
  [LIQUID_BTC]: "bitcoin",
  [LIQUID_USDT]: "tether",
  [LIQUID_CAD]: "cad",
  [Fiat.CAD]: "cad",
  [Fiat.EUR]: "eur",
  [Fiat.USD]: "usd",
};

// ASSETS is an array of "featured assets"
// (i.e assets data harcoded in the app, it lets to save some network requests for very common assets)
export const ASSETS: Coin[] = [
  {
    assetHash: LIQUID_BTC,
    name: "Liquid bitcoin",
    precision: 8,
    ticker: "L-BTC",
  },
  {
    assetHash: LIQUID_USDT,
    name: 'Tether USD',
    precision: 8,
    ticker: 'USDT',
  },
  {
    assetHash: LIQUID_CAD,
    name: 'Liquid CAD',
    precision: 8,
    ticker: 'LCAD',
  },
  {
    assetHash: 'b00b0ff0b11ebd47f7c6f57614c046dbbd204e84bf01178baf2be3713a206eb7',
    name: 'BTSE Token',
    precision: 8,
    ticker: 'BTSE',
  },
];
