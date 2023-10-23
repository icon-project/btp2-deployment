import fs from 'fs';
import {IconService, Wallet} from 'icon-sdk-js';

const {IconWallet, HttpProvider} = IconService;

export class IconNetwork {
  iconService: IconService;
  nid: number;
  wallet: Wallet;
  constructor(_iconService: IconService, _nid: number, _wallet: Wallet) {
    this.iconService = _iconService;
    this.nid = _nid;
    this.wallet = _wallet;
  }

  public static getNetwork(chainConfig: any) {
    const httpProvider = new HttpProvider(chainConfig.endpoint);
    const iconService = new IconService(httpProvider);
    const keystore = this.readFile(chainConfig.keystore);
    const keypass = chainConfig.keysecret
        ? this.readFile(chainConfig.keysecret)
        : chainConfig.keypass;
    const wallet = IconWallet.loadKeystore(keystore, keypass, false);
    const nid = parseInt(chainConfig.network.split(".")[0], 16);
    const network = new this(iconService, nid, wallet);
    return network;
  }


  private static readFile(path: string) {
    return fs.readFileSync(path).toString();
  }

  async getTotalSupply() {
    return this.iconService.getTotalSupply().execute();
  }

  async getLastBlock() {
    return this.iconService.getLastBlock().execute();
  }

  async getBTPNetworkInfo(nid: string) {
    return this.iconService.getBTPNetworkInfo(nid).execute();
  }

  async getBTPHeader(nid: string, height: string) {
    return this.iconService.getBTPHeader(nid, height).execute();
  }
}
