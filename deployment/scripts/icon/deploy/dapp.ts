import {Jar, IconNetwork, Contract} from "../../common/icon";
import {BTP2Config} from "../../common/config";
const {JAVASCORE_PATH} = process.env

async function deployDapp(config: BTP2Config) {
    const chainConfig = config.chainConfig.getChain()
    const contractsConfig = config.contractsConfig.getContract()

    const iconNetwork = IconNetwork.getNetwork(chainConfig);
    const content = Jar.readFromFile(JAVASCORE_PATH, "dapp-sample");
    const dapp = new Contract(iconNetwork)
    const deployTxHash = await dapp.deploy({
        content: content,
        params: {
            _callService: contractsConfig.xcall,
        }
    })
    const result = await dapp.getTxResult(deployTxHash)
    if (result.status != 1) {
        throw new Error(`DApp deployment failed: ${result.txHash}`);
    }
    config.contractsConfig.addContract("dapp", dapp.address)
    console.log(`${chainConfig.id} DApp: deployed to ${dapp.address}`);
}

async function main() {
    if (process.env.srcNetworkPath === undefined) {
        console.log("invalid args")
        return
    }
    const config = new BTP2Config(process.env.srcNetworkPath);
    await deployDapp(config)
    config.save()
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
