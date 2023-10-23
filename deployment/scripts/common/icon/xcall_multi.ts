import {Contract} from "./contract";
import {IconNetwork} from "./network";

export class Xcall_multi extends Contract {
  constructor(iconNetwork: IconNetwork, address: string) {
    super(iconNetwork, address)
  }

  getFee(network: string, rollback: boolean) {
    return this.call({
      method: 'getFee',
      params: {
        _net: network,
        _rollback: rollback ? '0x1' : '0x0'
      }
    })
  }

  getProtocolFee() {
    return this.call({
      method: 'getProtocolFee'
    })
  }


  executeCall(reqId: string, data: string) {
    return this.invoke({
      method: 'executeCall',
      params: {
        _reqId: reqId,
        _data: data
      }
    })
  }

  executeRollback(sn: string) {
    return this.invoke({
      method: 'executeRollback',
      params: {
        _sn: sn
      }
    })
  }

  setAdmin(address: string) {
    return this.invoke({
      method: 'setAdmin',
      params: {
        _admin: address
      }
    })
  }

  setProtocolFeeHandler(address: string) {
    return this.invoke({
      method: 'setProtocolFeeHandler',
      params: {
        _admin: address
      }
    })
  }

  setProtocolFee(protocolFee: string) {
    return this.invoke({
      method: 'setProtocolFee',
      params: {
        _protocolFee: protocolFee
      }
    })
  }

  setDefaultConnection(nid: string, address: string) {
    return this.invoke({
      method: 'setDefaultConnection',
      params: {
        _nid: nid,
        _connection: address,
      }
    })
  }


}
