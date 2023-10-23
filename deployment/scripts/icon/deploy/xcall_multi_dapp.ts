import {Jar, IconNetwork, Contract} from "../../common/icon";
import {BTP2Config} from "../../common/config";
const {JAVASCORE_PATH} = process.env

async function deployDappMulti(config: BTP2Config, jarPath: string) {
    const chainConfig = config.chainConfig.getChain()
    const contractsConfig = config.contractsConfig.getContract()

    const iconNetwork = IconNetwork.getNetwork(chainConfig);
    const content = Jar.readFromFile(jarPath);
    const dapp_multi = new Contract(iconNetwork)
    const deployTxHash = await dapp_multi.deploy({
        content: content,
        params: {
            _callService: contractsConfig.xcall_multi,
        }
    })
    const result = await dapp_multi.getTxResult(deployTxHash)
    if (result.status != 1) {
        throw new Error(`xCall multi DApp deployment failed: ${result.txHash}`);
    }
    config.contractsConfig.addContract("xcall_multi_dapp", dapp_multi.address)
    console.log(`${chainConfig.id} xCall multi DApp: deployed to ${dapp_multi.address}`);
}

async function main() {
    if (process.env.srcNetworkPath === undefined || process.env.jarPath === undefined) {
        console.log("invalid args")
        return
    }
    const config = new BTP2Config(process.env.srcNetworkPath);
    await deployDappMulti(config, process.env.jarPath)
    config.save()
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
