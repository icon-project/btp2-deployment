import { ethers, upgrades  } from 'hardhat';
import {BTP2Config} from "../../common/config";
import {setEthNetwork} from "../../common/eth/network";

async function deployXcall(config: BTP2Config) {
    const chainConfig = config.chainConfig.getChain()
    const contractsConfig = config.contractsConfig.getContract()
    await setEthNetwork(chainConfig.hardhatNetwork)

    const CallSvc = await ethers.getContractFactory("CallService")
    const xcallSol = await upgrades.deployProxy(CallSvc, [contractsConfig.bmc],  {
        txOverrides: { maxFeePerGas: 20e9 },
    });
    await xcallSol.deployed()
    console.log(`${chainConfig.id}: xCall: upgrades deployed to ${xcallSol.address}`);

    console.log(`${chainConfig.id}: register xCall to BMC`);
    const bmcm = await ethers.getContractAt('BMCManagement', contractsConfig.bmcm)
    await bmcm.addService('xcall', xcallSol.address);

    config.contractsConfig.addContract("xcall", xcallSol.address)
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
