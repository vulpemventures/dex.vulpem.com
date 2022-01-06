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

const PRECISION = 8;

// used on FiatValue component
export const CoinGeckoId: Record<string,string> = {
  [LIQUID_BTC]: "bitcoin",
  [LIQUID_USDT]: "tether",
  [LIQUID_CAD]: "cad",
  [Fiat.CAD]: "cad",
  [Fiat.EUR]: "eur",
  [Fiat.USD]: "usd",
};

export const enum NetworkNames {
  MAINNET = 'liquid',
  TESTNET = 'testnet',
}

export const enum AssetNames {
  BTSE = 'BTSE Token',
  LBTC = 'Liquid bitcoin',
  LCAD = 'Liquid CAD',
  USDT = 'Tether USD',
}

export const enum AssetTickers {
  BTSE = 'BTSE',
  LBTC = 'L-BTC',
  LCAD = 'LCAD',
  USDT = 'USDT',
}

interface IAssetHash {
  [network: string]: string;
}

export const AssetHashes: Record<string, IAssetHash> = {
  [AssetNames.BTSE]: {
    [NetworkNames.MAINNET]: 'b00b0ff0b11ebd47f7c6f57614c046dbbd204e84bf01178baf2be3713a206eb7',
  },
  [AssetNames.LBTC]: {
    [NetworkNames.MAINNET]: '6f0279e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d',
    [NetworkNames.TESTNET]: '144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49',
  },
  [AssetNames.LCAD]: {
    [NetworkNames.MAINNET]: '0e99c1a6da379d1f4151fb9df90449d40d0608f6cb33a5bcbfc8c265f42bab0a',
    [NetworkNames.TESTNET]: 'ac3e0ff248c5051ffd61e00155b7122e5ebc04fd397a0ecbdd4f4e4a56232926',
  },
  [AssetNames.USDT]: {
    [NetworkNames.MAINNET]: 'ce091c998b83c78bb71a632313ba3760f1763d9cfcffae02258ffa9865a37bd2',
    [NetworkNames.TESTNET]: 'f3d1ec678811398cd2ae277cbe3849c6f6dbd72c74bc542f7c4b11ff0e820958',
  },
}

// ASSETS is an array of "featured assets"
// (i.e assets data harcoded in the app, it lets to save some network requests for very common assets)
export const ASSETS: Coin[] = [
  {
    assetHash: AssetHashes[AssetNames.LBTC][NetworkNames.MAINNET],
    name: AssetNames.LBTC,
    precision: PRECISION,
    ticker: AssetTickers.LBTC,
  },
  {
    assetHash: AssetHashes[AssetNames.USDT][NetworkNames.MAINNET],
    name: AssetNames.USDT,
    precision: PRECISION,
    ticker: AssetTickers.USDT,
  },
  {
    assetHash: AssetHashes[AssetNames.LCAD][NetworkNames.MAINNET],
    name: AssetNames.LCAD,
    precision: PRECISION,
    ticker: AssetTickers.LCAD,
  },
  {
    assetHash: AssetHashes[AssetNames.BTSE][NetworkNames.MAINNET],
    name: AssetNames.BTSE,
    precision: PRECISION,
    ticker: AssetTickers.BTSE,
  },
  {
    assetHash: AssetHashes[AssetNames.LBTC][NetworkNames.TESTNET],
    name: AssetNames.LBTC,
    precision: PRECISION,
    ticker: AssetTickers.LBTC,
  },
  {
    assetHash: AssetHashes[AssetNames.USDT][NetworkNames.TESTNET],
    name: AssetNames.USDT,
    precision: PRECISION,
    ticker: AssetTickers.USDT,
  },
  {
    assetHash: AssetHashes[AssetNames.LCAD][NetworkNames.TESTNET],
    name: AssetNames.LCAD,
    precision: PRECISION,
    ticker: AssetTickers.LCAD,
  },
];
