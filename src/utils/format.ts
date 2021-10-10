import { Decimal } from 'decimal.js';

const DEFAULT_PRECISION = 8;

export function toSatoshi(val: string, precision = DEFAULT_PRECISION): Decimal {
  return new Decimal(val).mul(Decimal.pow(10, precision));
}

export function fromSatoshi(val: string, precision = DEFAULT_PRECISION): Decimal {
  return new Decimal(val).div(Decimal.pow(10, precision));
}