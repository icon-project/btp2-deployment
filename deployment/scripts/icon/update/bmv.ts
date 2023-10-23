import {BTP2Config} from "../../common/config";
import {Contract, IconNetwork, Jar} from "../../common/icon";
import {ethers} from "hardhat";
import {genUpdateBsc2JavBmvParams} from "../../common/eth/bmv_param";
const {JAVASCORE_PATH} = process.env
async function updateHertzBmv(srcConfig: BTP2Config, dstConfig: BTP2Config) {
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const dstChainConfig = dstConfig.chainConfig.getChain()

    const iconNetwork = IconNetwork.getNetwork(srcChainConfig)
    const content = Jar.readFromFile(JAVASCORE_PATH, "bmv/bsc2");
    const bmv = new Contract(iconNetwork)
    const bmvAddr = srcConfig.contractsConfig.getBmv(dstChainConfig.id).address
    const params = await genUpdateBsc2JavBmvParams(dstChainConfig, srcContractsConfig.bmc)
    console.log(`update bmv address : ${bmvAddr}`)
    console.log(params)
    const updateTxHash = await bmv.update({
        content: content,
        address: bmvAddr,
        params
    })

    const result = await bmv.getTxResult(updateTxHash);
    if (result.status != 1) {
        throw new Error(`BMV update failed: ${result.txHash}`);
    }

    console.log(`${srcChainConfig.id}: BMV-Hertz: update to ${bmv.address}`);
}

async function main() {
    if (process.env.srcNetworkPath === undefined || process.env.dstNetworkPath === undefined) {
        console.log("invalid args")
        return
    }

    const srcConfig = new BTP2Config(process.env.srcNetworkPath);
    const dstConfig = new BTP2Config(process.env.dstNetworkPath);

    switch (dstConfig.chainConfig.getBmvType()) {
        case 'bridge':
            //TODO
            break;
        case 'hertz' :
            await updateHertzBmv(srcConfig, dstConfig)
            break;
        case 'v2.0':
            //TODO
            break;
        default:
            throw new Error(`Unknown bmv type: ${dstConfig.chainConfig.getBmvType()}`);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
