import { ethers, upgrades  } from 'hardhat';
import {BTP2Config} from "../../common/config";
import {setEthNetwork} from "../../common/eth/network"

async function deployDapp(config: BTP2Config) {
    const chainConfig = config.chainConfig.getChain()
    const contractsConfig = config.contractsConfig.getContract()

    await setEthNetwork(chainConfig.hardhatNetwork)
    const DAppSample = await ethers.getContractFactory("DAppProxySample")
    const dappSol = await upgrades.deployProxy(DAppSample, [contractsConfig.xcall],  {
        txOverrides: { maxFeePerGas: 10e9 },
    });

    await dappSol.deployed()
    config.contractsConfig.addContract("dapp", dappSol.address)
    console.log(`${chainConfig.id} DApp: upgrades deployed to ${dappSol.address}`);
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
