import fs from 'fs';

export class BTP2Config {
  config: any
  path: string
  constructor(path: string) {
    console.log(path)
    const data = fs.readFileSync(path);
    if (!data) {
      //TODO error message
      throw new Error(``);
    }
    this.config = JSON.parse(data.toString());
    this.path = path
  }

  public chainConfig = new class {
    constructor(private btp2Config: BTP2Config) {
    }

    public getChain(){
      return this.btp2Config.config.chain
    }

    public getBmvType(){
      return this.btp2Config.config.chain.type.split("-")[1];
    }

    public getLanguageType(){
      return this.btp2Config.config.chain.type.split("-")[2];
    }

  }(this);

  public contractsConfig = new class {
    constructor(private btp2Config: BTP2Config) {
    }

    public getContract(){
      return this.btp2Config.config.contracts
    }

    public addContract(target: string, address: string){
      if (this.btp2Config.config.contracts == null) {
        this.btp2Config.config.contracts = {}
      }
      this.btp2Config.config.contracts[target] = address;
    }

    public removeContract(target: string){
      delete this.btp2Config.config.contracts[target]
    }

    public getBmv(target: string){
      return this.btp2Config.config.contracts.bmv[target]
    }

    public addBmv(target: string, type: string, address: string){
      if (this.btp2Config.config.contracts.bmv == null) {
        this.btp2Config.config.contracts.bmv = {}
      }
      this.btp2Config.config.contracts.bmv[target] = {
        'type': type,
        'address': address
      };
    }

    public removeBmv(target: string) {
      delete this.btp2Config.config.contracts.bmv[target]
    }

  }(this);


  public linksConfing = new class {
    constructor(private btp2Config: BTP2Config) {
    }

    public getLink(target: string) {
      return this.btp2Config.config.links[target]
    }

    public addLink(target: string, data: any){
      if (this.btp2Config.config['links'] == null) {
        this.btp2Config.config['links'] = {}
      }
      this.btp2Config.config.links[target] = data
    }

    public removeLink(target: string){
      delete this.btp2Config.config.links[target]
    }
  }(this);

  public save() {
    fs.writeFileSync(this.path, JSON.stringify(this.config), 'utf-8')
  }

}

export function chainType(chain: any) {
  return chain.network.split(".")[1];
}

export function getBtpAddress(network: string, dapp: string) {
  return `btp://${network}/${dapp}`;
}

export function isIconChain(chain: any) {
  return chain.network.includes('icon');
}

export function isEVMChain(chain: any) {
  return chain.network.includes('hardhat') || chain.network.includes('eth2')|| chain.network.includes('bsc');
}