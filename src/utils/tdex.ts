import { Coin, SupportedProviders } from "../constants"



export const getProviderByPair = (pair: Coin[]) => {
  
  if (pair.includes(Coin.Bitcoin) && pair.includes(Coin.Tether)) 
    return SupportedProviders[Coin.Tether];
  
  if (pair.includes(Coin.Bitcoin) && pair.includes(Coin.LCAD)) 
    return SupportedProviders[Coin.LCAD];

  return;
}

