import { ethers, upgrades  } from 'hardhat';
import {BTP2Config} from "../../common/config";
import {setEthNetwork} from "../../common/eth/network"

async function deployBmc(config: BTP2Config) {
    const chainConfig = config.chainConfig.getChain()
    await setEthNetwork(chainConfig.hardhatNetwork)
    console.log(`${chainConfig.id}: upgrades deploy BMC modules for ${chainConfig.network}`)
    const BMCManagement = await ethers.getContractFactory("BMCManagement");
    const bmcm = await upgrades.deployProxy(BMCManagement, [],  {
        txOverrides: { maxFeePerGas: 10e9 },
    });
    await bmcm.deployed();
    console.log(`BMCManagement: upgrades deployed to ${bmcm.address}`);

    const BMCService = await ethers.getContractFactory("BMCService");
    const bmcs = await upgrades.deployProxy(BMCService, [bmcm.address],  {
        txOverrides: { maxFeePerGas: 10e9 },
    });
    await bmcs.deployed();
    console.log(`BMCService: upgrades deployed to ${bmcs.address}`);

    const BMCPeriphery = await ethers.getContractFactory("BMCPeriphery");
    const bmcp = await upgrades.deployProxy(BMCPeriphery, [chainConfig.network, bmcm.address, bmcs.address],  {
        txOverrides: { maxFeePerGas: 20e9 },
    });
    await bmcp.deployed();
    console.log(`BMCPeriphery: upgrades deployed to ${bmcp.address}`);

    console.log(`${chainConfig.id}: management.setBMCPeriphery`);
    await bmcm.setBMCPeriphery(bmcp.address)
        .then((tx: { wait: (arg0: number) => any; }) => {
            return tx.wait(1)
        });
    console.log(`${chainConfig.id}: management.setBMCService`);
    await bmcm.setBMCService(bmcs.address)
        .then((tx: { wait: (arg0: number) => any; }) => {
            return tx.wait(1)
        });
    console.log(`${chainConfig.id}: service.setBMCPeriphery`);
    await bmcs.setBMCPeriphery(bmcp.address)
        .then((tx: { wait: (arg0: number) => any; }) => {
            return tx.wait(1)
        });

    config.contractsConfig.addContract('bmcm', bmcm.address)
    config.contractsConfig.addContract('bmcs', bmcs.address)
    config.contractsConfig.addContract('bmc', bmcp.address)
    console.log('bmc deploy done')
    return
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
