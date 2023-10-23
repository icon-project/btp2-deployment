import {BTP2Config} from "../../common/config";
import {Jar, IconNetwork, Contract} from "../../common/icon";
const {JAVASCORE_PATH} = process.env

async function upgradeDapp(config: BTP2Config) {
    const chainConfig = config.chainConfig.getChain()
    const contractsConfig = config.contractsConfig.getContract()
    const iconNetwork = IconNetwork.getNetwork(chainConfig);

    const content = Jar.readFromProject(JAVASCORE_PATH, "dapp-sample");
    const dapp = new Contract(iconNetwork)
    const updateXcallTxHash = await dapp.update({
        content: content,
        address: contractsConfig.dapp,
        params: {
            _callService: contractsConfig.xcall,
        }
    })

    const result = await dapp.getTxResult(updateXcallTxHash)
    if (result.status != 1) {
        throw new Error(`XCALL update failed: ${result.txHash}`);
    }
    console.log(`${chainConfig.id}: XCALL update to ${dapp.address}`);
}

async function main() {
    if (process.env.srcNetworkPath === undefined) {
        console.log("invalid args")
        return
    }
    const config = new BTP2Config(process.env.srcNetworkPath);
    await upgradeDapp(config)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

