export const enum TradeButtonStatus {
  Trade = "Trade",
  EnterAmount = "Enter an amount",
  InvalidPair = "Pair not supported",
  ConnectWallet = "Connect wallet",
  ErrorPreview = "Preview not available"
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

// testnet
const LIQUID_BTC_TESTNET = '144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49';
// regtest
const LIQUID_BTC_REGTEST = '5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225';

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