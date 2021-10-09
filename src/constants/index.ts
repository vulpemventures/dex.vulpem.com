export const enum Direction {
  SEND,
  RECEIVE
}

export const enum TradeButtonStatus {
  Trade = "Trade",
  EnterAmount = "Enter an amount",
  InvalidPair = "Pair not supported",
  ConnectWallet = "Connect wallet"
}

export const enum TradeStatus {
  WAITING,
  COMPLETED,
  ERROR
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
};


const LIQUID_BTC = '6f0279e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d';
const LIQUID_USDT = 'ce091c998b83c78bb71a632313ba3760f1763d9cfcffae02258ffa9865a37bd2';
const LIQUID_CAD = '0e99c1a6da379d1f4151fb9df90449d40d0608f6cb33a5bcbfc8c265f42bab0a';

export const SupportedPairs = [
  [Coin.Bitcoin, Coin.Tether],
  [Coin.Bitcoin, Coin.LCAD],
];

export const SupportedProviders: Record<string,{ market: { baseAsset: string, quoteAsset: string}, endpoint: string}> = {
  [Coin.LCAD]: {
    market: {
      baseAsset: LIQUID_BTC,
      quoteAsset: LIQUID_CAD
    },
    endpoint: "http://d7y3mzol3eo2tneqw5oytj23knm3734npwml4jzazrzzpy32e56lrxqd.onion:80",
  },
  [Coin.Tether]: {
    market: {
      baseAsset: LIQUID_BTC,
      quoteAsset: LIQUID_USDT
    },
    endpoint: "http://btuiucyiumvdzhlnhqbnj6k5yrbwo2dlznzosicwnf6nw5aewr77elyd.onion:80"
  }
}




// testnet
const LIQUID_BTC_TESTNET = '144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49';
// regtest
const LIQUID_BTC_REGTEST = '5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225';

interface AssetInfo {
  hash: string;
  precision: number;
}

type AssetInfoByCoin = Record<
  Coin.Bitcoin | Coin.Tether | Coin.LCAD,
  AssetInfo
>;

type CoinByAssetHash = Record<
  string,
  Coin.Bitcoin | Coin.Tether | Coin.LCAD
>;

const LiquidAssetByCoin: AssetInfoByCoin = {
  [Coin.Bitcoin]: {
    hash: LIQUID_BTC,
    precision: 8,
  },
  [Coin.Tether]: {
    hash: LIQUID_USDT,
    precision: 8,
  },
  [Coin.LCAD]: {
    hash: LIQUID_CAD,
    precision: 8,
  },
};

const LiquidCoinByAssetHash: CoinByAssetHash = {
  [LIQUID_BTC]: Coin.Bitcoin,
  [LIQUID_USDT]: Coin.Tether,
  [LIQUID_CAD]: Coin.LCAD,
};



export const CoinToAssetByChain: Record<
  'liquid' | 'testnet' | 'regtest',
  AssetInfoByCoin
> = {
  liquid: LiquidAssetByCoin,
  testnet: null,
  regtest: null,
};

export const AssetToCoinByChain: Record<
  'liquid' | 'testnet' | 'regtest',
  CoinByAssetHash
> = {
  liquid: LiquidCoinByAssetHash,
  testnet: null,
  regtest: null,
};
