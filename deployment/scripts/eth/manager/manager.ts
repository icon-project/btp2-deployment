import {BTP2Config, getBtpAddress} from "../../common/config";
import {setEthNetwork} from "../../common/eth/network";
import {ethers} from "hardhat";
import {BigNumber} from "ethers";

export async function getRelays(srcConfig: BTP2Config, dstConfig: BTP2Config){
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const dstChainConfig = dstConfig.chainConfig.getChain()
    const dstContractsConfig = dstConfig.contractsConfig.getContract()
    setEthNetwork(srcChainConfig.hardhatNetwork)
    const bmcm = await ethers.getContractAt('BMCManagement', srcContractsConfig.bmcm)
    const dstBmcAddr = getBtpAddress(dstChainConfig.network, dstContractsConfig.bmc);
    console.log(`${srcChainConfig.id}: getRelays`)
    const relays = await bmcm.getRelays(dstBmcAddr)
    console.log(relays)
}

export async function addRelay(srcConfig: BTP2Config, dstConfig: BTP2Config, address: string) {
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const dstChainConfig = dstConfig.chainConfig.getChain()
    const dstContractsConfig = dstConfig.contractsConfig.getContract()
    setEthNetwork(srcChainConfig.hardhatNetwork)
    const bmcm = await ethers.getContractAt('BMCManagement', srcContractsConfig.bmcm)
    const dstBmcAddr = getBtpAddress(dstChainConfig.network, dstContractsConfig.bmc);

    console.log(`${srcChainConfig.id}: addVerifier for ${dstChainConfig.network}`)
    await bmcm.addRelay(dstBmcAddr, address, {gasLimit:600000})
        .then((tx: { wait: (arg0: number) => any; }) => {
            return tx.wait(1)
        });
}

export async function removeRelay(srcConfig: BTP2Config, dstConfig: BTP2Config, address: string) {
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const dstChainConfig = dstConfig.chainConfig.getChain()
    const dstContractsConfig = dstConfig.contractsConfig.getContract()
    setEthNetwork(srcChainConfig.hardhatNetwork)
    const bmcm = await ethers.getContractAt('BMCManagement', srcContractsConfig.bmcm)
    const dstBmcAddr = getBtpAddress(dstChainConfig.network, dstContractsConfig.bmc);

    console.log(`${srcChainConfig.id}: removeVerifier for ${dstChainConfig.network}`)
    await bmcm.removeRelay(dstBmcAddr, address, {gasLimit:600000})
        .then((tx: { wait: (arg0: number) => any; }) => {
            return tx.wait(1)
        });
}
export async function addOwner( config: BTP2Config, signerIndex: number, addAddr: string) {
    const chainConfig = config.chainConfig.getChain()
    const contractsConfig = config.contractsConfig.getContract()
    setEthNetwork(chainConfig.hardhatNetwork)
    const signers = await ethers.getSigners()
    const bmcm = await ethers.getContractAt('BMCManagement', contractsConfig.bmcm, signers[signerIndex])
    const gas = await ethers.provider.getGasPrice()
    await bmcm.addOwner(addAddr, {gasLimit:600000, gasPrice:gas})
        .then((tx: { wait: (arg0: number) => any; }) => tx.wait(1))
        .then(async (receipt: { status: number; transactionHash: string; }) => {
            if (receipt.status != 1) {
                throw new Error(`Failed to addOwner txHash: ${receipt.transactionHash}`);
            }
            console.log("addOwner txHash : " + receipt.transactionHash)
        })
    const isOwner = await bmcm.isOwner(addAddr)
    console.log(isOwner)
}

export async function removeOwner( config: BTP2Config, signerIndex: number, removeAddr: string) {
    const chainConfig = config.chainConfig.getChain()
    const contractsConfig = config.contractsConfig.getContract()
    setEthNetwork(chainConfig.hardhatNetwork)
    const signers = await ethers.getSigners()
    const bmcm = await ethers.getContractAt('BMCManagement', contractsConfig.bmcm, signers[signerIndex])
    const gas = await ethers.provider.getGasPrice()
    await bmcm.removeOwner(removeAddr, {gasLimit:600000, gasPrice:gas})
        .then((tx: { wait: (arg0: number) => any; }) => tx.wait(1))
        .then(async (receipt: { status: number; transactionHash: string; }) => {
            if (receipt.status != 1) {
                throw new Error(`Failed to addOwner txHash: ${receipt.transactionHash}`);
            }
            console.log("addOwner txHash : " + receipt.transactionHash)
        })
    const isOwner = await bmcm.isOwner(removeAddr)
    console.log(isOwner)
}

export async function isOwner( config: BTP2Config, addr: string) {
    const chainConfig = config.chainConfig.getChain()
    const contractsConfig = config.contractsConfig.getContract()
    setEthNetwork(chainConfig.hardhatNetwork)
    const bmcm = await ethers.getContractAt('BMCManagement', contractsConfig.bmcm)
    const gas = await ethers.provider.getGasPrice()
    const isOwner = await bmcm.isOwner(addr)
    console.log(isOwner)
}


export async function getMode(config: any) {
    const chainConfig = config.chainConfig.getChain()
    const contractsConfig = config.contractsConfig.getContract()
    setEthNetwork(chainConfig.hardhatNetwork)
    const bmcm = await ethers.getContractAt('BMCManagement', contractsConfig.bmcm)
    const mode = await bmcm.getMode()
    console.log(`getMode : ${mode}`)

}

export async function getVerifiers(config: any){
    const chainConfig = config.chainConfig.getChain()
    const contractsConfig = config.contractsConfig.getContract()
    setEthNetwork(chainConfig.hardhatNetwork)
    const bmcm = await ethers.getContractAt('BMCManagement', contractsConfig.bmcm)
    const verifiers = await bmcm.getVerifiers()
    console.log(verifiers)
}

export async function getServices(config: any) {
    const chainConfig = config.chainConfig.getChain()
    const contractsConfig = config.contractsConfig.getContract()
    setEthNetwork(chainConfig.hardhatNetwork)
    const bmcm = await ethers.getContractAt('BMCManagement', contractsConfig.bmcm)
    const services = await bmcm.getServices()
    console.log(services)

}

export async function addService(config: BTP2Config, service: string, address: string) {
    const chainConfig = config.chainConfig.getChain()
    const contractsConfig = config.contractsConfig.getContract()
    setEthNetwork(chainConfig.hardhatNetwork)
    const bmcm = await ethers.getContractAt('BMCManagement', contractsConfig.bmcm)
    const gas = await ethers.provider.getGasPrice()
    await bmcm.addService(service, address, {gasLimit:600000, gasPrice:gas})
        .then((tx: { wait: (arg0: number) => any; }) => tx.wait(1))
        .then(async (receipt: { status: number; transactionHash: string; }) => {
            if (receipt.status != 1) {
                throw new Error(`Failed to addService txHash: ${receipt.transactionHash}`);
            }
            console.log("addService txHash : " + receipt.transactionHash)
        })
}


export async function removeService(config: BTP2Config, service: string) {
    const chainConfig = config.chainConfig.getChain()
    const contractsConfig = config.contractsConfig.getContract()
    setEthNetwork(chainConfig.hardhatNetwork)
    const bmcm = await ethers.getContractAt('BMCManagement', contractsConfig.bmcm)
    const gas = await ethers.provider.getGasPrice()
    await bmcm.removeService(service, {gasLimit:600000, gasPrice:gas})
        .then((tx: { wait: (arg0: number) => any; }) => tx.wait(1))
        .then(async (receipt: { status: number; transactionHash: string; }) => {
            if (receipt.status != 1) {
                throw new Error(`Failed to removeService txHash: ${receipt.transactionHash}`);
            }
            console.log("removeService txHash : " + receipt.transactionHash)
        })
}




export async function setMode( config: BTP2Config, signerIndex: number) {
    const chainConfig = config.chainConfig.getChain()
    const contractsConfig = config.contractsConfig.getContract()
    setEthNetwork(chainConfig.hardhatNetwork)
    const signers = await ethers.getSigners()
    const bmcm = await ethers.getContractAt('BMCManagement', contractsConfig.bmcm, signers[signerIndex])
    const beforeMode = await bmcm.getMode()
    console.log(`before bmc mode : ${beforeMode}`)
    const gas = await ethers.provider.getGasPrice()

    if ( beforeMode.eq(BigNumber.from("0"))) {
        await bmcm.setMode(1, {gasLimit:600000, gasPrice:gas})
            .then((tx: { wait: (arg0: number) => any; }) => tx.wait(1))
            .then(async (receipt: { status: number; transactionHash: string; }) => {
                if (receipt.status != 1) {
                    throw new Error(`Failed to setMode txHash: ${receipt.transactionHash}`);
                }
                console.log("SetMode txHash : " + receipt.transactionHash)
            })
    } else {
        await bmcm.setMode(0)
            .then((tx: { wait: (arg0: number) => any; }) => tx.wait(1))
            .then(async (receipt: { status: number; transactionHash: string; }) => {
                if (receipt.status != 1) {
                    throw new Error(`Failed to setMode txHash: ${receipt.transactionHash}`);
                }
                console.log("SetMode txHash : " + receipt.transactionHash)
            })
    }
    const afterMode = await bmcm.getMode()
    console.log(`after bmc mode : ${afterMode}`)
}

export async function removeVerifier(srcConfig: BTP2Config, dstConfig: BTP2Config){
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const dstChainConfig = dstConfig.chainConfig.getChain()
    const dstContractsConfig = dstConfig.contractsConfig.getContract()
    setEthNetwork(srcChainConfig.hardhatNetwork)
    const bmcm = await ethers.getContractAt('BMCManagement', srcContractsConfig.bmcm)

    console.log(`${srcChainConfig.id}: removeVerifier for ${dstChainConfig.id}`)
    await bmcm.removeVerifier(dstChainConfig.network, {gasLimit:600000})
        .then((tx) => tx.wait(1))
        .then((receipt) => {
            if (receipt.status != 1) {
                throw new Error(`Failed to removeVerifier: ${receipt.transactionHash}`);
            }
            return receipt;
        })


    srcConfig.contractsConfig.removeBmv(dstChainConfig.id)
    srcConfig.save()
}

export async function addVerifier(srcConfig: BTP2Config, dstConfig: BTP2Config){
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const dstChainConfig = dstConfig.chainConfig.getChain()
    const dstContractsConfig = dstConfig.contractsConfig.getContract()
    setEthNetwork(srcChainConfig.hardhatNetwork)
    const bmcm = await ethers.getContractAt('BMCManagement', srcContractsConfig.bmcm)

    console.log(`${srcChainConfig.id}: addVerifier for ${dstChainConfig.network}`)
    const bmvAddress = srcConfig.contractsConfig.getBmv(dstChainConfig.id).address
    await bmcm.addVerifier(dstChainConfig.network, bmvAddress, {gasLimit:600000})
        .then((tx: { wait: (arg0: number) => any; }) => {
            return tx.wait(1)
        });
    srcConfig.save()
}
export async function removeLink(srcConfig: BTP2Config, dstConfig: BTP2Config){
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const dstChainConfig = dstConfig.chainConfig.getChain()
    const dstContractsConfig = dstConfig.contractsConfig.getContract()

    setEthNetwork(srcChainConfig.hardhatNetwork)
    const bmcm = await ethers.getContractAt('BMCManagement', srcContractsConfig.bmcm)
    const dstBmcAddr = getBtpAddress(dstChainConfig.network, dstContractsConfig.bmc);

    console.log(`${srcChainConfig.id}: removeLink for ${dstBmcAddr}`)
    await bmcm.removeLink(dstBmcAddr ,{gasLimit:600000})
        .then((tx) => tx.wait(1))
        .then((receipt) => {
            if (receipt.status != 1) {
                throw new Error(`Failed to removeLink: ${receipt.transactionHash}`);
            }
            return receipt;
        })

    srcConfig.contractsConfig.removeBmv(dstChainConfig.id)
    srcConfig.linksConfing.removeLink(dstChainConfig.id)
    srcConfig.save()
}

export async function getLink(srcConfig: BTP2Config){
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    setEthNetwork(srcChainConfig.hardhatNetwork)
    const bmcm = await ethers.getContractAt('BMCManagement', srcContractsConfig.bmcm)

    console.log(`${srcChainConfig.id}: getLink`)
    const links =  await bmcm.getLinks();
    console.log(links)
}
export async function addLink(srcConfig: BTP2Config, dstConfig: BTP2Config){
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const dstChainConfig = dstConfig.chainConfig.getChain()
    const dstContractsConfig = dstConfig.contractsConfig.getContract()
    setEthNetwork(srcChainConfig.hardhatNetwork)
    const bmcm = await ethers.getContractAt('BMCManagement', srcContractsConfig.bmcm)
    const dstBmcAddr = getBtpAddress(dstChainConfig.network, dstContractsConfig.bmc);


    console.log(`${srcChainConfig.id}: addLink: ${dstBmcAddr}`)
    await bmcm.addLink(dstBmcAddr, {gasLimit:600000})
        .then((tx: { wait: (arg0: number) => any; }) => {
            return tx.wait(1)
        });

    srcConfig.linksConfing.addLink(dstChainConfig.id, {
        'network' : dstChainConfig.network,
        'bmc' : dstContractsConfig.bmc
    })
    srcConfig.save()
}

export async function getReward(srcConfig: BTP2Config, dstConfig: BTP2Config){
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const dstChainConfig = dstConfig.chainConfig.getChain()
    setEthNetwork(srcChainConfig.hardhatNetwork)
    const signers = await ethers.getSigners()
    const address = await signers[0].getAddress()
    const bmcp = await ethers.getContractAt('BMCPeriphery', srcContractsConfig.bmc)
    const reward = await bmcp.getReward(dstChainConfig.network, address)

    console.log(`GetReward : ${reward}`)
}

export async function claimReward(srcConfig: BTP2Config, dstConfig: BTP2Config, address: string){
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const dstChainConfig = dstConfig.chainConfig.getChain()

    setEthNetwork(srcChainConfig.hardhatNetwork)
    const bmcp = await ethers.getContractAt('BMCPeriphery', srcContractsConfig.bmc)
    const fee = await bmcp.getFee(dstChainConfig.network, true)
    console.log("Fee : " + fee )
    await bmcp.claimReward(dstChainConfig.network, address, {value: fee})
        .then((tx: { wait: (arg0: number) => any; }) => tx.wait(1))
        .then(async (receipt: { status: number; transactionHash: string; }) => {
            if (receipt.status != 1) {
                throw new Error(`Failed to claimReward txHash: ${receipt.transactionHash}`);
                return
            }
            console.log("ClaimReward txHash : " + receipt.transactionHash)
        })
}


export async function getStatus(srcConfig: BTP2Config, dstConfig: BTP2Config){
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const dstChainConfig = dstConfig.chainConfig.getChain()
    const dstContractsConfig = dstConfig.contractsConfig.getContract()
    setEthNetwork(srcChainConfig.hardhatNetwork)
    const link = getBtpAddress(dstChainConfig.network, dstContractsConfig.bmc);
    const bmcp = await ethers.getContractAt('BMCPeriphery', srcContractsConfig.bmc)

    const status = await bmcp.getStatus(link)
    console.log(`getStatus : ${status}`)
    return status
}

// export async function setupLink(srcConfig: BTP2Config, dstConfig: BTP2Config, networkTypeId: string, networkId: string) {
//     const srcChainConfig = srcConfig.chainConfig.getChain()
//     const srcContractsConfig = srcConfig.contractsConfig.getContract()
//     const dstChainConfig = dstConfig.chainConfig.getChain()
//     const dstContractsConfig = dstConfig.contractsConfig.getContract()
//     setEthNetwork(srcChainConfig.hardhatNetwork)
//     const bmcm = await ethers.getContractAt('BMCManagement', srcContractsConfig.bmcm)
//     const dstBmcAddr = getBtpAddress(dstChainConfig.network, dstContractsConfig.bmc);
//
//     console.log(`${srcChainConfig.id}: addVerifier for ${dstChainConfig.network}`)
//     const bmvAddress = srcConfig.contractsConfig.getBmv(dstChainConfig.id).address
//     await bmcm.addVerifier(dstChainConfig.network, bmvAddress, {gasLimit:600000})
//         .then((tx: { wait: (arg0: number) => any; }) => {
//             return tx.wait(1)
//         });
//
//     console.log(`${srcChainConfig.id}: addLink: ${dstBmcAddr}`)
//     await bmcm.addLink(dstBmcAddr, {gasLimit:600000})
//         .then((tx: { wait: (arg0: number) => any; }) => {
//             return tx.wait(1)
//         });
//
//     console.log(`${srcChainConfig.id}: addRelay`)
//     const signers = await ethers.getSigners()
//     await bmcm.addRelay(dstBmcAddr, signers[0].getAddress(), {gasLimit:600000})
//         .then((tx: { wait: (arg0: number) => any; }) => {
//             return tx.wait(1)
//         });
//
//     srcConfig.linksConfing.addLink(dstChainConfig.id, {
//         'network' : dstChainConfig.network,
//         'networkTypeId' : networkTypeId,
//         'networkId' : networkId,
//         'bmc' : dstContractsConfig.bmc
//     })
//
// }
