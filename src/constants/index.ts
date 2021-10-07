export const enum Direction {
    SEND,
    RECEIVE
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