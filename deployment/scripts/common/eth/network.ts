import {createProvider} from "hardhat/internal/core/providers/construction";

const hre = require("hardhat");

export function setEthNetwork(network: string) {
    if (!hre.config.networks[network]) {
        console.log(`Couldn't find network (input network : ${network}) `);
        return
    }

    hre.network.name = network;
    hre.network.config = hre.config.networks[network];
    hre.network.provider = createProvider(
        network,
        hre.config.networks[network],
        hre.config.paths,
        hre.artifacts
    );
    if (hre.ethers) {
        const { EthersProviderWrapper } = require("@nomiclabs/hardhat-ethers/internal/ethers-provider-wrapper");
        hre.ethers.provider = new EthersProviderWrapper(hre.network.provider);
    }
}
