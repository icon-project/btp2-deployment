import {BTP2Config} from "../../common/config";
import {Jar, IconNetwork, Contract} from "../../common/icon";
const {JAVASCORE_PATH} = process.env
async function upgradeXcall(config: BTP2Config) {
    const chainConfig = config.chainConfig.getChain()
    const contractsConfig = config.contractsConfig.getContract()
    const iconNetwork = IconNetwork.getNetwork(chainConfig);

    const content = Jar.readFromFile(JAVASCORE_PATH, "xcall", "0.6.2");
    const xcall = new Contract(iconNetwork)
    const updateXcallTxHash = await xcall.update({
        content: content,
        address: contractsConfig.xcall,
        params: {
            _bmc: contractsConfig.bmc,
        }
    })

    const result = await xcall.getTxResult(updateXcallTxHash)
    if (result.status != 1) {
        throw new Error(`XCALL update failed: ${result.txHash}`);
    }
    console.log(`${chainConfig.id}: XCALL update to ${xcall.address}`);
}

async function main() {
    if (process.env.srcNetworkPath === undefined) {
        console.log("invalid args")
        return
    }
    const config = new BTP2Config(process.env.srcNetworkPath);
    await upgradeXcall(config)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

