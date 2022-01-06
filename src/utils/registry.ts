import { NetworkNames } from '../constants';
import { detectProvider, MarinaProvider } from 'marina-provider';

const Registries = {
  [NetworkNames.MAINNET]: 'https://raw.githubusercontent.com/TDex-network/tdex-registry/master/registry.json',
  [NetworkNames.TESTNET]: 'https://joaobordalo.com/labs/tdex-registry/registry.json', // TODO: change this
}

/**
 * Get tdex registry url based on network selected on Marina
 * @returns url
 */
export async function getRegistryURL(): Promise<string> {
  const network = await detectProvider('marina')
    .then(async (marina: MarinaProvider): Promise<string> => {
      const network = await marina.getNetwork();
      return network || NetworkNames.MAINNET;
    })
    .catch((err) => {
      console.error(err);
      return NetworkNames.MAINNET;
    });
  return Registries[network] || Registries[NetworkNames.MAINNET]
}
