import { ethers, upgrades  } from 'hardhat';
import {BTP2Config} from "../../common/config";
import {setEthNetwork} from "../../common/eth/network"

async function upgradeXcall(config: BTP2Config) {
    const chainConfig = config.chainConfig.getChain()
    const contractsConfig = config.contractsConfig.getContract()
    await setEthNetwork(chainConfig.hardhatNetwork)
    const CallSvc = await ethers.getContractFactory("CallService")
    console.log(`${chainConfig.id}: upgrade xcall address ${contractsConfig.xcall}`)
    const xcallSol = await upgrades.upgradeProxy(contractsConfig.xcall, CallSvc,  {
        txOverrides: { maxFeePerGas: 10e9 },
    });
    console.log(`xcall: upgrade to ${xcallSol.address}`);
}

async function main() {
    if (process.env.srcNetworkPath === undefined) {
        console.log("invalid args")
        return
    }
    const config = new BTP2Config(process.env.srcNetworkPath);
    await upgradeXcall(config)
    config.save()
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

