import {Jar, IconNetwork, Contract} from "../../common/icon";
import {BTP2Config} from "../../common/config";

async function deployXcallMulti(config: BTP2Config, jarPath: string) {
    const chainConfig = config.chainConfig.getChain()
    const iconNetwork = IconNetwork.getNetwork(chainConfig);
    const content = Jar.readFromFile(jarPath);
    const xcall_multi = new Contract(iconNetwork)
    const deployTxHash = await xcall_multi.deploy({
        content: content,
        params: {
            networkId: chainConfig.network,
        }
    })
    const result = await xcall_multi.getTxResult(deployTxHash);
    if (result.status != 1) {
        throw new Error(`xCall multi deployment failed: ${result.txHash}`);
    }
    console.log(`${chainConfig.id}: xCall multi: deployed to ${xcall_multi.address}`);
    config.contractsConfig.addContract("xcall_multi", xcall_multi.address)
}

async function main() {
    if (process.env.srcNetworkPath === undefined || process.env.jarPath === undefined) {
        console.log("invalid args")
        return
    }
    const config = new BTP2Config(process.env.srcNetworkPath);
    await deployXcallMulti(config, process.env.jarPath)
    config.save()
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
