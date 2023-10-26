import { ethers  } from 'hardhat';
import {BTP2Config, getBtpAddress} from "../../common/config";
import {setEthNetwork} from "../../common/eth/network"
import {getFirstBtpBlockHeader, getLastBlockNumber} from "../../common/icon/bmv_param"
import {addVerifier} from "../manager/manager";

async function deployBridgeBmv(srcConfig: BTP2Config, dstConfig: BTP2Config) {
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const dstChainConfig = dstConfig.chainConfig.getChain()

    const blockNum = await getLastBlockNumber(dstConfig)
    const BMVBridge = await ethers.getContractFactory("BMV")
    const bmvb = await BMVBridge.deploy(srcContractsConfig.bmc, dstChainConfig.network, blockNum)
    await bmvb.deployed()
    srcConfig.contractsConfig.addBmv(dstChainConfig.id, dstChainConfig.type, bmvb.address)
    console.log(`${srcChainConfig.id}: BMV-Bridge: deployed to ${bmvb.address}`);
}

async function deployBTPBlockBmv(srcConfig: BTP2Config, dstConfig: BTP2Config, networkTypeId: string, networkId: string) {
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const dstChainConfig = dstConfig.chainConfig.getChain()

    const firstBlockHeader = await getFirstBtpBlockHeader(dstChainConfig, networkId)

    const BMVBtp = await ethers.getContractFactory("BtpMessageVerifier");
    const bmvBtp = await BMVBtp.deploy(srcContractsConfig.bmc, dstChainConfig.network, networkTypeId, firstBlockHeader, '0x0', '0x0');
    await bmvBtp.deployed()
    srcConfig.contractsConfig.addBmv(dstChainConfig.id, dstChainConfig.type, bmvBtp.address)
    console.log(`${srcChainConfig.id}: BMV-BTPBlock: deployed to ${bmvBtp.address}`);
}




async function main() {
    if (process.env.srcNetworkPath === undefined || process.env.dstNetworkPath === undefined
        || process.env.dstNetworkTypeId === undefined || process.env.dstNetworkId === undefined) {
        console.log("invalid args")
        return
    }

    const srcConfig = new BTP2Config(process.env.srcNetworkPath);
    const dstConfig = new BTP2Config(process.env.dstNetworkPath);

    const srcChainConfig = srcConfig.chainConfig.getChain()
    await setEthNetwork(srcChainConfig.hardhatNetwork)

    switch (dstConfig.chainConfig.getBmvType()) {
        case 'bridge':
            await deployBridgeBmv(srcConfig, dstConfig)
            break;
        case 'btpblock':
            await deployBTPBlockBmv(srcConfig, dstConfig, process.env.dstNetworkTypeId, process.env.dstNetworkId)
            break;
        default:
            throw new Error(`Unknown bmv type: ${dstConfig.chainConfig.getBmvType()}`);
    }

    await addVerifier(srcConfig, dstConfig)
    srcConfig.save()

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
