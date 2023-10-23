import {Jar, IconNetwork, Contract, BMC} from "../../common/icon";
import {BTP2Config} from "../../common/config";
const {JAVASCORE_PATH} = process.env

async function deployXcall(config: BTP2Config) {
    const chainConfig = config.chainConfig.getChain()
    const contractsConfig = config.contractsConfig.getContract()
    const iconNetwork = IconNetwork.getNetwork(chainConfig);
    const content = Jar.readFromProject(JAVASCORE_PATH, "xcall", "0.6.2");
    const xcall = new Contract(iconNetwork)
    const deployTxHash = await xcall.deploy({
        content: content,
        params: {
            _bmc: contractsConfig.bmc,
        }
    })
    const result = await xcall.getTxResult(deployTxHash);
    if (result.status != 1) {
        throw new Error(`xCall deployment failed: ${result.txHash}`);
    }
    // chain.contracts.xcall = xcall.address;
    console.log(`${chainConfig.id}: xCall: deployed to ${xcall.address}`);

    console.log(`${chainConfig.id}: register xCall to BMC`);
    const bmc = new BMC(iconNetwork, contractsConfig.bmc)
    await bmc.addService('xcall', xcall.address)
        .then((txHash) => bmc.getTxResult(txHash))
        .then((result) => {
            if (result.status != 1) {
                throw new Error(`${chainConfig.id}: failed to register xCall to BMC: ${result.txHash}`);
            }
        })
    config.contractsConfig.addContract("xcall", xcall.address)
}

async function main() {
    if (process.env.srcNetworkPath === undefined) {
        console.log("invalid args")
        return
    }
    const config = new BTP2Config(process.env.srcNetworkPath);
    await deployXcall(config)
    config.save()
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
