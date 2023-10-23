import {BTP2Config} from "../../common/config";
import {getUpdateBtpBlockHeader} from "../../common/icon/bmv_param"
import {ethers} from "hardhat";
import {setEthNetwork} from "../../common/eth/network";
import {addVerifier, getStatus, removeVerifier} from "../manager/manager";

async function updateBTPBlockBmv(srcConfig: BTP2Config, dstConfig: BTP2Config, networkTypeId: string, networkId: string, status: any, height?: string) {
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const dstChainConfig = dstConfig.chainConfig.getChain()

    const updateParam = await getUpdateBtpBlockHeader(dstChainConfig, networkTypeId, networkId, status.rxSeq.toNumber(), height)
    if (typeof updateParam === "string") {
        const param = JSON.parse(updateParam);

        const messageSn = param.message_sn
        const nextMsgOffset= status.rxSeq.toNumber() - messageSn
        console.log("MessageSn : " + param.message_sn)
        console.log("MessageSn : " + messageSn)
        console.log("nextMessageOffset : " + nextMsgOffset)
        console.log("rxSeq : " + status.rxSeq.toNumber())
        console.log("Base64 first block header : "  + param.first_block_header)
        console.log('hex rxSeq:', '0x' + status.rxSeq.toNumber().toString(16));
        console.log('hex nextMessageOffset:', '0x' + nextMsgOffset.toString(16));

        const firstBlockHeader = '0x' + Buffer.from(param.first_block_header, 'base64').toString('hex');
        const BMVBtp = await ethers.getContractFactory("BtpMessageVerifier");
        const gas = await ethers.provider.getGasPrice()
        const bmvBtp = await BMVBtp.deploy(srcContractsConfig.bmc, dstChainConfig.network, networkTypeId, firstBlockHeader,
            0,
            '0x' + nextMsgOffset.toString(16), {
                gasPrice: gas,
            });

        await bmvBtp.deployed()

        console.log(`${srcChainConfig.id}: BMV-BTPBlock: Update to ${bmvBtp.address}`);
        return bmvBtp.address
    }else {
        throw new Error(`Invalid BMV update param"`);
    }

}

async function updateBridgeBmv(srcConfig: BTP2Config, dstConfig: BTP2Config) {
    //TODO
    return ""
}


async function main() {
    if (process.env.srcNetworkPath === undefined || process.env.dstNetworkPath === undefined
        || process.env.networkTypeId === undefined || process.env.networkId === undefined) {
        console.log("invalid args")
        return
    }
    let bmvAddr : string
    const srcConfig = new BTP2Config(process.env.srcNetworkPath);
    const dstConfig = new BTP2Config(process.env.dstNetworkPath);

    const srcChainConfig = srcConfig.chainConfig.getChain()
    await setEthNetwork(srcChainConfig.hardhatNetwork)

    const status = await getStatus(srcConfig, dstConfig)
    //deploy update bmv
    switch (dstConfig.chainConfig.getBmvType()) {
        case 'bridge':
            bmvAddr = await updateBridgeBmv(srcConfig, dstConfig)
            break;
        case 'btpblock':
            bmvAddr = await updateBTPBlockBmv(srcConfig, dstConfig, process.env.networkTypeId, process.env.networkId, status, process.env.height)
            break;
        default:
            throw new Error(`Unknown bmv type: ${dstConfig.chainConfig.getBmvType()}`);
    }

    //Remove Link
    await removeVerifier(srcConfig, dstConfig)
    srcConfig.save()

    const dstChainConfig = dstConfig.chainConfig.getChain()
    srcConfig.contractsConfig.addBmv(dstChainConfig.id, dstChainConfig.type, bmvAddr)
    srcConfig.save()

    //Setup bmv link
    await addVerifier(srcConfig, dstConfig)
    srcConfig.save()
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
