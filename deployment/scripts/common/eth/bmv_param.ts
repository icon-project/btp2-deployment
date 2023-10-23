// import {ethers} from "hardhat";
import { ethers } from 'hardhat';
import rlp from 'rlp';
import fs from "fs";
import {setEthNetwork} from "./network";
const BSC2_EPOCH = 200;
const BlsPubLength = 48;
const EthAddrLength = 20;
const ValidatorBytesLengthLuban = EthAddrLength + BlsPubLength;
const ExtraVanity = 32;
const ExtraSeal = 65;
const { exec } = require("child_process")
const {BMV_INIT_DATA_PATH, PWD} = process.env

export async function getBlockNumber(chainConfig: any) {
    await setEthNetwork(chainConfig.hardhatNetwork)
    return await ethers.provider.getBlockNumber();
}

export function genEth2JavBmvParams() : Promise<any>{
    let base: string
    if (BMV_INIT_DATA_PATH == null) {
        base = PWD+"/bmv_init_data.json"
   }else {
        base = BMV_INIT_DATA_PATH
    }

    return new Promise((resolve, reject) => {
        exec("make eth2-bmv-init", (error: { message: any; }, stdout: any, stderr: any) => {
            if (error) {
                reject(error);
            }else {
                resolve(JSON.parse(fs.readFileSync(base).toString()));
            }
        })
    });
}

export async function genUpdateBsc2JavBmvParams(chainConfig: any, bmc: string) {
    await setEthNetwork(chainConfig.hardhatNetwork)
    return {
        _bmc: bmc,
        _chainId: '0x' + (await ethers.provider.getNetwork()).chainId.toString(16)
    }
}
export async function genBsc2JavBmvParams(chainConfig: any, bmc: string, number?: number) {
    await setEthNetwork(chainConfig.hardhatNetwork)
    const curnum = number != undefined ? number : await ethers.provider.getBlockNumber();
    const tarnum = curnum - curnum % BSC2_EPOCH;
    console.log('trusted block number:', tarnum);
    const curr = await headByNumber(chainConfig, tarnum);
    const prev = tarnum != 0 ? await headByNumber(chainConfig, tarnum - BSC2_EPOCH) : curr;
    let validators = parseValidators(Buffer.from(prev.extraData.slice(2, prev.extraData.length), 'hex'));
    let candidates = parseValidators(Buffer.from(curr.extraData.slice(2, curr.extraData.length), 'hex'));

    console.log('validators:', validators);

    const recents = [];
    for (let i = Math.floor(validators.length / 2); i >= 0; i--) {
        let miner = (await ethers.provider.getBlock(tarnum-i)).miner;
        recents.push(miner);
    }

    return {
        _bmc: bmc,
        _chainId: '0x' + (await ethers.provider.getNetwork()).chainId.toString(16),
        _header: Buffer.from(rlp.encode([
            curr.parentHash,
            curr.sha3Uncles,
            curr.miner,
            curr.stateRoot,
            curr.transactionsRoot,
            curr.receiptsRoot,
            curr.logsBloom,
            curr.difficulty,
            curr.number,
            curr.gasLimit,
            curr.gasUsed,
            curr.timestamp,
            curr.extraData,
            curr.mixHash,
            curr.nonce,
            curr.baseFeePerGas
        ])).toString('hex'),
        _recents: Buffer.from(rlp.encode(recents)).toString('hex'),
        _candidates: Buffer.from(rlp.encode(candidates)).toString('hex'),
        _validators: Buffer.from(rlp.encode(validators)).toString('hex')
    }
}

async function headByNumber(chainConfig: any, number: number) {
    await setEthNetwork(chainConfig.hardhatNetwork)
    return await ethers.provider.send('eth_getBlockByNumber', ['0x' + number.toString(16), false]);
}

function parseValidators(extra: any) {
    console.log('etra:', extra.toString('hex'));
    if (extra.length <= ExtraVanity + ExtraSeal) {
        throw new Error("Wrong Validator Bytes");
    }

    const num = Buffer.from(extra, 'hex')[ExtraVanity];
    const start = ExtraVanity + 1;
    const end = start + num * ValidatorBytesLengthLuban;
    const validatorsBytes = Buffer.from(extra.slice(start, end));
    let validators = [];
    for (let i = 0; i < num; i++) {
        validators.push([
            '0x' + validatorsBytes.slice(i * ValidatorBytesLengthLuban, i * ValidatorBytesLengthLuban + EthAddrLength).toString('hex'),
            '0x' + validatorsBytes.slice(i * ValidatorBytesLengthLuban + EthAddrLength, (i+1) * ValidatorBytesLengthLuban).toString('hex')
        ]);
    }
    return validators;
}
