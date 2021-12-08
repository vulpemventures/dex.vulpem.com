import { bestBalanceDiscovery, bestPriceDiscovery, BuySellOpts, CoinSelector, combineDiscovery, Discoverer, greedyCoinSelector, IdentityInterface, MarketInterface, Trade, TradeOrder, TraderClient, TradeType, UtxoInterface } from "tdex-sdk";
import axios from "axios";
import { isTDEXProvider, TDEXProvider, Pair } from "./types";

function tdexOrdersForProvider(pair: Pair, providerEndpoint: string, markets: MarketInterface[], torProxy?: string) {
  const orders: TradeOrder[] = [];
  const traderClient = new TraderClient(providerEndpoint, torProxy);

  for (const market of markets) {
    if (pair.send === market.baseAsset && pair.receive === market.quoteAsset) {
      orders.push({
        market,
        type: TradeType.SELL,
        traderClient
      });
    }

    if (pair.send === market.quoteAsset && pair.receive === market.baseAsset) {
      orders.push({
        market,
        type: TradeType.BUY,
        traderClient
      });
    }
  }

  return orders;
}

const TDEX_REGISTRY_URL = 'https://raw.githubusercontent.com/TDex-network/tdex-registry/master/registry.json';

/**
 * Get a list of registered providers from TDEX_REGISTRY_URL
 * @returns a list of providers
 */
export async function getProvidersFromRegistry(): Promise<TDEXProvider[]> {
  const res = (await axios.get(TDEX_REGISTRY_URL)).data
  if (!Array.isArray(res)) throw new Error('Invalid registry response')
  return res.filter(isTDEXProvider)
}

async function getMarkets(providerEndpoint: string): Promise<MarketInterface[]> {
  const traderClient = new TraderClient(providerEndpoint);
  return traderClient.markets();
}

/**
 * Get all markets for each providers
 * @param providers list of providers
 * // TODO handle errors (i.e should not throw if a provider is down)
 * // TODO optimization: do all the requests in parallel
 */
export async function getMarketsForProviders(providers: TDEXProvider[]): Promise<Record<TDEXProvider['endpoint'], MarketInterface[]>> {
  const marketsByProvider = {} as Record<TDEXProvider['endpoint'], MarketInterface[]>;
  for (const provider of providers) {
    try {
      const markets = await getMarkets(provider.endpoint);
      marketsByProvider[provider.endpoint] = markets;
    } catch (e) {
      console.error(e);
    }
  }
  return marketsByProvider;
}

/**
 * Construct all the TradeOrder from a set of markets + a pair
 * @param marketsByProvider the set of available markets mapped to provider endpoint
 * @param pair the pair to get the orders for
 */
export function computeOrders(
  pair: Pair,
  marketsByProvider: Record<TDEXProvider['endpoint'], MarketInterface[]>,
): TradeOrder[] {
  const orders: TradeOrder[] = [];
  for (const [providerEndpoint, markets] of Object.entries(marketsByProvider)) {
    orders.push(...tdexOrdersForProvider(pair, providerEndpoint, markets));
    if (orders.length > 0) {
      return orders;
    }
  }

  return orders;
}

// Create discoverer object for a specific set of trader clients
function createDiscoverer(orders: TradeOrder[], errorHandler?: () => Promise<void>): Discoverer {
  return new Discoverer(orders, combineDiscovery(bestBalanceDiscovery, bestPriceDiscovery), errorHandler);
}

/**
 * discover the best provider for a pair
 * @param orders orders to compare
 * @param pair pair describing the trade
 * @param type send or receive
 * @param sats amount of `type` asset in satoshis
 */
export async function discoverBestOrder(orders: TradeOrder[], pair: Pair, type: keyof Pair, sats: number): Promise<TradeOrder> {
  const discoverer = createDiscoverer(orders);
  const best = await discoverer.discover({
    asset: pair[type],
    amount: sats
  });

  return best[0];
}

function createTrade(
  order: TradeOrder,
  utxos: UtxoInterface[],
  explorerUrl: string
): Trade {
  return new Trade({
    explorerUrl: explorerUrl,
    providerUrl: order.traderClient.providerUrl,
    utxos,
    coinSelector: greedyCoinSelector(),
  });
}


export async function calculateMarketPrice(
  order: TradeOrder,
  coinHash: string,
  satoshis: number,
) {
  const [firstPrice] = await order.traderClient.marketPrice(
    order.market,
    order.type,
    satoshis,
    coinHash
  );

  return firstPrice.amount;
}

/**
 * make a trade
 * @param identity who sign/blind the tx
 * @param known asset/amount in sats pair to trade
 * @param order order describing the trade
 * @param utxos unspents available to be selected for the trade
 * @param explorerUrl the explorerURL (using to broadcast the tx)
 */
export async function makeTrade(
  identity: IdentityInterface,
  known: { sats: number, asset: string },
  order: TradeOrder,
  utxos: UtxoInterface[],
  explorerUrl: string
): Promise<string> {
  const trade = createTrade(order, utxos, explorerUrl);
  const args: BuySellOpts = {
    amount: known.sats,
    asset: known.asset,
    market: order.market,
    identity
  }
  const promise = order.type === TradeType.BUY ? trade.buy(args) : trade.sell(args);
  const txid = await promise;
  return txid;
}