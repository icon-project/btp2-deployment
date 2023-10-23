import {Jar, IconNetwork, Contract} from "../../common/icon";
import {BTP2Config} from "../../common/config";
const {JAVASCORE_PATH} = process.env

async function deployBmc(config: BTP2Config) {
    const chainConfig = config.chainConfig.getChain()
    const iconNetwork = IconNetwork.getNetwork(chainConfig);
    console.log(`${chainConfig.id}: deploy BMC for ${chainConfig.network}`)

    const content = Jar.readFromFile(JAVASCORE_PATH, "bmc");
    const bmc = new Contract(iconNetwork)
    const deployTxHash = await bmc.deploy({
        content: content,
        params: {
            _net: chainConfig.network
        }
    })
    const result = await bmc.getTxResult(deployTxHash)
    if (result.status != 1) {
        throw new Error(`BMC deployment failed: ${result.txHash}`);
    }
    console.log(`${chainConfig.id}: BMC deployed to ${bmc.address}`);

    config.contractsConfig.addContract('bmc', bmc.address)
}

async function main() {
    if (process.env.srcNetworkPath === undefined) {
        console.log("invalid args")
        return
    }
    const config = new BTP2Config(process.env.srcNetworkPath);
    await deployBmc(config)
    config.save()
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
