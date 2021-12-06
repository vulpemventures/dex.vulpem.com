import { LIQUID_BTC, LIQUID_CAD, LIQUID_USDT } from ".";
import type { Coin } from "../utils/types";

export const ASSETS: Coin[] = [
  {
    name: "Liquid bitcoin",
    ticker: "L-BTC",
    assetHash: LIQUID_BTC,
    precision: 8,
  },
  {
    ticker: 'USDT',
    assetHash: LIQUID_USDT,
    precision: 8,
    name: 'Tether USD',
  },
  {
    ticker: 'LCAD',
    assetHash: LIQUID_CAD,
    precision: 8,
    name: 'Liquid CAD',
  },
  {
    ticker: 'BTSE',
    assetHash: 'b00b0ff0b11ebd47f7c6f57614c046dbbd204e84bf01178baf2be3713a206eb7',
    precision: 8,
    name: 'BTSE Token',
  },
];
