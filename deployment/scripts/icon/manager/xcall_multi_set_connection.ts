import {IconNetwork} from "../../common/icon";
import {BTP2Config} from "../../common/config";
import {Xcall_multi} from "../../common/icon/xcall_multi";

async function setDefaultConnection(srcConfig: BTP2Config, dstConfig: BTP2Config,) {
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const dstChainConfig = dstConfig.chainConfig.getChain()
    const network = IconNetwork.getNetwork(srcChainConfig);
    const xcall_multi = new Xcall_multi(network, srcContractsConfig.xcall_multi);
    console.log(`${srcChainConfig.id}: set default connection for ${dstChainConfig.network}`)

    await xcall_multi.setDefaultConnection(dstChainConfig.network, srcContractsConfig.bmc)
        .then((txHash) => xcall_multi.getTxResult(txHash))
        .then((result) => {
            if (result.status != 1) {
                throw new Error(`ICON: failed to set default connection: ${result.txHash}`);
            }
        })
}

async function main() {
    if (process.env.srcNetworkPath === undefined || process.env.dstNetworkPath === undefined) {
        console.log("invalid args")
        return
    }
    const srcConfig = new BTP2Config(process.env.srcNetworkPath);
    const dstConfig = new BTP2Config(process.env.dstNetworkPath);
    await setDefaultConnection(srcConfig, dstConfig)
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
