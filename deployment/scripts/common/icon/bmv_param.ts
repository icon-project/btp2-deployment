import { IconNetwork } from "./network";
import fs from "fs";
const {BTP_BLOCK_HEADER_PATH, PWD} = process.env
const { exec } = require("child_process")

export async function getUpdateBtpBlockHeader(dstChainConfig: any, networkTypeId: string, networkId: string, rsSeq: number, hexHeight?: string) {
    var height : number
    const network = IconNetwork.getNetwork(dstChainConfig);
    let base: string
    if (BTP_BLOCK_HEADER_PATH == null) {
        base = PWD+"/btp_bmv_update_param.json"
    }else {
        base = BTP_BLOCK_HEADER_PATH
    }

    if (hexHeight == "" ){
        const lastBlock = await network.getLastBlock()
        height = lastBlock.height
        console.log(height)
    }else {
        if (hexHeight != null) {
            height = parseInt(hexHeight, 10)
        }
    }
    console.log(base)
    return new Promise((resolve, reject) => {
        exec("make icon-btp-block", { env: { ...process.env, url: dstChainConfig.endpoint,
                networkTypeId:networkTypeId, networkId:networkId, rxSeq:rsSeq ,output:base, height:height} }, (error: { message: any; }, stdout: any, stderr: any) => {
            console.log('stdout', stdout);
            if (error) {
                reject(error);
                return
            }else {
                resolve(fs.readFileSync(base).toString());
            }
        })
    });

}
export async function getFirstBtpBlockHeader(dstChainConfig: any, networkId: string) {
    // get firstBlockHeader via btp2 API
    const network = IconNetwork.getNetwork(dstChainConfig);
    const networkInfo = await network.getBTPNetworkInfo(networkId);
    console.log('networkInfo:', networkInfo);
    console.log('startHeight:', '0x' + networkInfo.startHeight.toString(16));
    const receiptHeight = '0x' + networkInfo.startHeight.plus(1).toString(16);
    console.log('receiptHeight:', receiptHeight);
    const header = await network.getBTPHeader(networkId, receiptHeight);
    const firstBlockHeader = '0x' + Buffer.from(header, 'base64').toString('hex');
    console.log('firstBlockHeader:', firstBlockHeader);
    return firstBlockHeader;
}

export async function getLastBlockNumber(dstChain: any) {
    const network = IconNetwork.getNetwork(dstChain);
    const lastBlock = await network.getLastBlock();
    return lastBlock.height
}
