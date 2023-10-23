import { ethers, upgrades  } from 'hardhat';
import {BTP2Config} from "../../common/config";
import {setEthNetwork} from "../../common/eth/network"

async function upgradeDapp(config: BTP2Config) {
    const chainConfig = config.chainConfig.getChain()
    const contractsConfig = config.contractsConfig.getContract()
    await setEthNetwork(chainConfig.hardhatNetwork)
    const DAppSample = await ethers.getContractFactory("DAppProxySample")
    console.log(`${chainConfig.id}: upgrade dapp address ${contractsConfig.dapp}`)
    const dappSol = await upgrades.upgradeProxy(contractsConfig.dapp, DAppSample,  {
        txOverrides: { maxFeePerGas: 10e9 },
    });
    console.log(`DApp: upgrade to ${dappSol.address}`);
}

async function main() {
    if (process.env.srcNetworkPath === undefined) {
        console.log("invalid args")
        return
    }
    const config = new BTP2Config(process.env.srcNetworkPath);
    await upgradeDapp(config)
    config.save()
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

