import { NetworkNames } from '../constants';

const Registries = {
  [NetworkNames.MAINNET]: 'https://raw.githubusercontent.com/tdex-network/tdex-registry/master/registry.json',
  [NetworkNames.TESTNET]: 'https://raw.githubusercontent.com/tdex-network/tdex-registry/testnet/registry.json',
}

/**
 * Get tdex registry url based on network selected on Marina
 * @returns url
 */
export function getRegistryURL(network: string = NetworkNames.MAINNET): string {
  return Registries[network] || Registries[NetworkNames.MAINNET]
}
