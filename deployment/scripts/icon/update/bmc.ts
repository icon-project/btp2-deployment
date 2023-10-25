import {BTP2Config} from "../../common/config";
import {Jar, IconNetwork, Contract} from "../../common/icon";
const {JAVASCORE_PATH} = process.env
async function upgradeBmc(config: BTP2Config) {
    const chainConfig = config.chainConfig.getChain()
    const contractsConfig = config.contractsConfig.getContract()
    const iconNetwork = IconNetwork.getNetwork(chainConfig);

    const content = Jar.readFromProject(JAVASCORE_PATH, "bmc");
    const bmc = new Contract(iconNetwork)
    const updateBmcTxHash = await bmc.update({
        content: content,
        address: contractsConfig.bmc,
        params: {
            _net: chainConfig.network
        }
    })

    const result = await bmc.getTxResult(updateBmcTxHash)
    if (result.status != 1) {
        throw new Error(`BMC update failed: ${result.txHash}`);
    }
    console.log(`${chainConfig.id}: BMC update to ${bmc.address}`);
}

async function main() {
    if (process.env.srcNetworkPath === undefined) {
        return
    }
    const config = new BTP2Config(process.env.srcNetworkPath);
    await upgradeBmc(config)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

