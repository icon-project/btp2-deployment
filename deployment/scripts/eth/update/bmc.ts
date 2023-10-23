import { ethers, upgrades  } from 'hardhat';
import {BTP2Config} from "../../common/config";
import {setEthNetwork} from "../../common/eth/network"

async function upgradeBmc(config: BTP2Config) {
    const chainConfig = config.chainConfig.getChain()
    const contractsConfig = config.contractsConfig.getContract()
    await setEthNetwork(chainConfig.hardhatNetwork)
    console.log(`${chainConfig.id}: upgrade BMC modules for ${chainConfig.network}`)
    const BMCManagement = await ethers.getContractFactory("BMCManagement");
    console.log(`${chainConfig.id}: upgrade bmcm address ${contractsConfig.bmcm}`)
    const bmcm = await upgrades.upgradeProxy(contractsConfig.bmcm, BMCManagement,  {
        txOverrides: { maxFeePerGas: 10e9 },
    });
    console.log(`BMCManagement: upgrade to ${bmcm.address}`);

    const BMCService = await ethers.getContractFactory("BMCService");
    console.log(`${chainConfig.id}: upgrade bmcs address ${contractsConfig.bmcs}`)
    const bmcs = await upgrades.upgradeProxy(contractsConfig.bmcs, BMCService,  {
        txOverrides: { maxFeePerGas: 10e9 },
    });
    console.log(`BMCService: upgrade to ${bmcs.address}`);

    const BMCPeriphery = await ethers.getContractFactory("BMCPeriphery");
    console.log(`${chainConfig.id}: upgrade bmc address ${contractsConfig.bmc}`)
    const bmcp = await upgrades.upgradeProxy(contractsConfig.bmc, BMCPeriphery,  {
        txOverrides: { maxFeePerGas: 20e9 },
    });
    console.log(`BMCPeriphery: upgrade to ${bmcp.address}`);
}

async function main() {
    if (process.env.srcNetworkPath === undefined) {
        console.log("invalid args")
        return
    }
    const config = new BTP2Config(process.env.srcNetworkPath);
    const chainConfig = config.chainConfig.getChain()
    await upgradeBmc(config)
    config.save()
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

