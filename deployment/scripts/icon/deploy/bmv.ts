

import {Contract, IconNetwork, Jar, BMC} from "../../common/icon";
import IconService from "icon-sdk-js";
const {IconConverter} = IconService;
import {BTP2Config, getBtpAddress} from "../../common/config";
const {JAVASCORE_PATH} = process.env
import {genEth2JavBmvParams, genBsc2JavBmvParams, getBlockNumber} from "../../common/eth/bmv_param"
import {setupLink} from "../manager/manager";
import {getFirstBtpBlockHeader} from "../../common/icon/bmv_param";

async function deployHertzBmv(srcConfig: BTP2Config, dstConfig: BTP2Config) {
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const dstChainConfig = dstConfig.chainConfig.getChain()
    const iconNetwork = IconNetwork.getNetwork(srcChainConfig)
    const content = Jar.readFromProject(JAVASCORE_PATH, "bmv/bsc2");
    const params = await genBsc2JavBmvParams(dstChainConfig, srcContractsConfig.bmc)

    console.log(`java bsc2 bmv init conf data`)
    console.log(params)
    const bmv = new Contract(iconNetwork)
    const deployTxHash = await bmv.deploy({
        content: content,
        params,
    })
    const result = await bmv.getTxResult(deployTxHash);
    if (result.status != 1) {
        throw new Error(`BMV deployment failed: ${result.txHash}`);
    }
    srcConfig.contractsConfig.addBmv(dstChainConfig.id, dstChainConfig.type, bmv.address)
    console.log(`${srcChainConfig.id}: BMV-Hertz: deployed to ${bmv.address}`);
}

async function deployEth2Bmv(srcConfig: BTP2Config, dstConfig: BTP2Config) {
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const dstChainConfig = dstConfig.chainConfig.getChain()
    const dstContractsConfig = dstConfig.contractsConfig.getContract()

    const iconNetwork = IconNetwork.getNetwork(srcChainConfig)
    const bmvInitData = await genEth2JavBmvParams()
    console.log(`java eth2 bmv init conf data.`);
    console.log(bmvInitData)
    const content = Jar.readFromProject(JAVASCORE_PATH, "bmv/eth2");
    const bmv = new Contract(iconNetwork)
    const deployTxHash = await bmv.deploy({
        content: content,
        params: {
            srcNetworkID: dstChainConfig.network,
            genesisValidatorsHash: bmvInitData.genesis_validators_hash,
            syncCommittee: bmvInitData.sync_committee,
            bmc: srcContractsConfig.bmc,
            ethBmc: dstContractsConfig.bmc,
            finalizedHeader: bmvInitData.finalized_header,
        }
    })
    const result = await bmv.getTxResult(deployTxHash);
    if (result.status != 1) {
        throw new Error(`BMV deployment failed: ${result.txHash}`);
    }
    srcConfig.contractsConfig.addBmv(dstChainConfig.id, dstChainConfig.type, bmv.address)
    console.log(`${srcChainConfig.id}: BMV-eth2: deployed to ${bmv.address}`);
}

async function deployBridgeBmv(srcConfig: BTP2Config, dstConfig: BTP2Config) {
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const dstChainConfig = dstConfig.chainConfig.getChain()
    const iconNetwork = IconNetwork.getNetwork(srcChainConfig)

    const content = Jar.readFromProject(JAVASCORE_PATH, "bmv/bridge");
    const bmv = new Contract(iconNetwork)
    const blockNum = await getBlockNumber(dstChainConfig)
    const deployTxHash = await bmv.deploy({
        content: content,
        params: {
            _bmc: srcContractsConfig.bmc,
            _net: dstChainConfig.network,
            _offset: IconConverter.toHex(blockNum)
        }
    })
    const result = await bmv.getTxResult(deployTxHash)
    if (result.status != 1) {
        throw new Error(`BMV deployment failed: ${result.txHash}`);
    }
    srcConfig.contractsConfig.addBmv(dstChainConfig.id, dstChainConfig.type, bmv.address)
    console.log(`${srcChainConfig.id}: BMV-Bridge: deployed to ${bmv.address}`);
}

async function deployBtpBlock(srcConfig: BTP2Config, dstConfig: BTP2Config, networkTypeId: string, networkId: string) {
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const dstChainConfig = dstConfig.chainConfig.getChain()
    const iconNetwork = IconNetwork.getNetwork(srcChainConfig)
    const firstBlockHeader = await getFirstBtpBlockHeader(dstChainConfig, networkId);

    const content = Jar.readFromProject(JAVASCORE_PATH, "bmv/btpblock");
    const bmv = new Contract(iconNetwork)

    const deployTxHash = await bmv.deploy({
        content: content,
        params: {
            bmc: srcContractsConfig.bmc,
            srcNetworkID: dstChainConfig.network,
            networkTypeID: networkTypeId,
            blockHeader: firstBlockHeader,
            seqOffset: '0x0'
        }
    })

    const result = await bmv.getTxResult(deployTxHash)
    if (result.status != 1) {
        throw new Error(`BMV deployment failed: ${result.txHash}`);
    }
    srcConfig.contractsConfig.addBmv(dstChainConfig.id, dstChainConfig.type, bmv.address)
    console.log(`${srcChainConfig.id}: BMV-BTPBlock: deployed to ${bmv.address}`);
}

async function main() {
    if (process.env.srcNetworkPath === undefined || process.env.dstNetworkPath === undefined ||
        process.env.networkTypeId === undefined || process.env.networkId === undefined) {
        console.log("invalid args")
        return
    }

    const srcConfig = new BTP2Config(process.env.srcNetworkPath);
    const dstConfig = new BTP2Config(process.env.dstNetworkPath);

    switch (dstConfig.chainConfig.getBmvType()) {
        case 'bridge':
            await deployBridgeBmv(srcConfig, dstConfig)
            break;
        case 'hertz' :
            await deployHertzBmv(srcConfig, dstConfig)
            break;
        case 'v2.0':
            await deployEth2Bmv(srcConfig, dstConfig)
            break;
        case 'btpblock':
            await deployBtpBlock(srcConfig, dstConfig, process.env.networkTypeId, process.env.networkId)
            break;
        default:
            throw new Error(`Unknown bmv type: ${dstConfig.chainConfig.getBmvType()}`);
    }

    await setupLink(srcConfig, dstConfig, process.env.networkId)
    srcConfig.save()
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
