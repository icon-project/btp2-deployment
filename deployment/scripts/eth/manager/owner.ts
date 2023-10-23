import {BTP2Config} from "../../common/config";
import {addOwner, isOwner, removeOwner} from "./manager";
import {setEthNetwork} from "../../common/eth/network";
import {ethers} from "hardhat";



async function main() {
    if (process.env.srcNetworkPath === undefined || process.env.method === undefined
        || process.env.address === undefined) {
        console.log("invalid args")
        return
    }

    let index : number
    if (process.env.signerIndex === undefined) {
        index = 0
    }else{
        index = parseInt(process.env.signerIndex)
    }

    const config = new BTP2Config(process.env.srcNetworkPath);
    const chainConfig = config.chainConfig.getChain()
    await setEthNetwork(chainConfig.hardhatNetwork)
    const signers = await ethers.getSigners()
    if (process.env.method == "add") {
        await addOwner(config, index, process.env.address)
    }else if (process.env.method == "remove") {
        await removeOwner(config, index, process.env.address)
    }else if (process.env.method == "is") {
        await isOwner(config, process.env.address)
    }else{
        console.log("invalid method")
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
