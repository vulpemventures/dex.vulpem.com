import { NetworkNames } from '../constants';
import { detectProvider, MarinaProvider } from 'marina-provider';

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

/**
 * Checks for network selected on Marina and returns explorer for that network
 * @returns url
 */
export async function getExplorer(): Promise<string> {
  const network = await detectProvider('marina')
    .then(async (marina: MarinaProvider): Promise<string> => {
      const network = await marina.getNetwork();
      return network || NetworkNames.MAINNET;
    })
    .catch((err) => {
      console.error(err);
      return NetworkNames.MAINNET;
    });
  return getExplorerForNetwork(network);
}
