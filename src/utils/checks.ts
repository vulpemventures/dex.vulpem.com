import { Coin, SupportedPairs } from "../constants";

export const isValidAmount = (amt: string) => {
  const numeric = Number(amt);
  return !Number.isNaN(numeric) && numeric > 0;
};

export const isValidPair = (a: Coin, b: Coin) => {
  return (
    SupportedPairs.some((pair: Coin[]) => {
      return pair.includes(a) && pair.includes(b);
    }) && a !== b
  );
};