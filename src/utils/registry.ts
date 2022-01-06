import { NetworkNames } from '../constants';
import { detectProvider, MarinaProvider } from 'marina-provider';

const Registries = {
  [NetworkNames.MAINNET]: 'https://raw.githubusercontent.com/TDex-network/tdex-registry/master/registry.json',
  [NetworkNames.TESTNET]: 'https://raw.githubusercontent.com/TDex-network/tdex-registry/master/registry.json', // TODO
}

/**
 * Get tdex registry url based on network selected on Marina
 * @returns url
 */
export async function getRegistryURL(): Promise<string> {
  const network = await detectProvider('marina')
    .then((marina: MarinaProvider) => {
      return marina.getNetwork().then((network) => network || NetworkNames.MAINNET );
    })
    .catch((err) => {
      console.error(err);
      return NetworkNames.MAINNET;
    });
  return Registries[network] || Registries[NetworkNames.MAINNET]
}
