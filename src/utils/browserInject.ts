import { address, AddressInterface, BrowserInject, IdentityOpts, InjectOpts } from 'ldk';
import type { MarinaProvider } from 'marina-provider';

export default class BrowserInjectOpenDex extends BrowserInject {
  private _provider: MarinaProvider;
  private blindKeyByScript: Record<string, string> = {};

  constructor(args: IdentityOpts<InjectOpts>) {
    super(args);
    this._provider = (window as any)[args.opts.windowProvider];
  }

  async getBlindingPrivateKey(script: string): Promise<string> {
    // check if blinding private key is already in the instance
    if (this.blindKeyByScript.hasOwnProperty(script)) {
      return this.blindKeyByScript[script];
    }

    try {
      // get addresses from marina
      const addresses = await this._provider.getAddresses();
      // find the address of the requested script
      let found: AddressInterface | undefined;
      addresses.forEach((addr: AddressInterface) => {
        const currentScript = address
          .toOutputScript(addr.confidentialAddress)
          .toString('hex');
        if (currentScript === script) {
          found = addr;
        }
      });

      if (!found) throw new Error('no blinding key for script ' + script);

      this.blindKeyByScript[script] = found.blindingPrivateKey;
      return found.blindingPrivateKey;
    } catch (e) {
      throw e;
    }
  }
}
