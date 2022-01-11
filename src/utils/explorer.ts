import { NetworkNames } from '../constants';

export const Explorers = {
  [NetworkNames.MAINNET]: 'https://blockstream.info/liquid/api',
  [NetworkNames.TESTNET]: 'https://blockstream.info/liquidtestnet/api',
}

/**
 * Returns the explorer to use for a given network
 * @param network
 * @returns url
 */
export function getExplorerForNetwork(network: string): string {
  return Explorers[network] || Explorers[NetworkNames.MAINNET];
}
