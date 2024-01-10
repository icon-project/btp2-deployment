import {BTP2Config, getBtpAddress, getRelayAddress} from "../../common/config";
import {BMC, IconNetwork} from "../../common/icon";

function getBMCContract(config: BTP2Config) {
    const chainConfig = config.chainConfig.getChain()
    const contractsConfig = config.contractsConfig.getContract()
    const network = IconNetwork.getNetwork(chainConfig);
    return  new BMC(network, contractsConfig.bmc);
}


export async function getRelays(srcConfig: BTP2Config, dstConfig: BTP2Config){
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const dstChainConfig = dstConfig.chainConfig.getChain()
    const dstContractsConfig = dstConfig.contractsConfig.getContract()
    const dstBmcAddr = getBtpAddress(dstChainConfig.network, dstContractsConfig.bmc);

    const srcNetwork = IconNetwork.getNetwork(srcChainConfig);
    const bmc = new BMC(srcNetwork, srcContractsConfig.bmc);
    console.log(`${srcChainConfig.id}: getRelays`)
    const relays = await bmc.getRelays(dstBmcAddr)
    console.log(relays)
}

export async function addRelay(srcConfig: BTP2Config, dstConfig: BTP2Config, address: string) {
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const dstChainConfig = dstConfig.chainConfig.getChain()
    const dstContractsConfig = dstConfig.contractsConfig.getContract()

    const srcNetwork = IconNetwork.getNetwork(srcChainConfig);
    const bmc = new BMC(srcNetwork, srcContractsConfig.bmc);
    const dstBmcAddr = getBtpAddress(dstChainConfig.network, dstContractsConfig.bmc);

    console.log(`${srcChainConfig.id}: addRelay`)
    await bmc.addRelay(dstBmcAddr, address)
        .then((txHash) => bmc.getTxResult(txHash))
        .then((result) => {
            if (result.status != 1) {
                throw new Error(`ICON: failed to addRelay: ${result.txHash}`);
            }
        })
}

export async function removeRelay(srcConfig: BTP2Config, dstConfig: BTP2Config, address: string) {
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const dstChainConfig = dstConfig.chainConfig.getChain()
    const dstContractsConfig = dstConfig.contractsConfig.getContract()

    const srcNetwork = IconNetwork.getNetwork(srcChainConfig);
    const bmc = new BMC(srcNetwork, srcContractsConfig.bmc);
    const dstBmcAddr = getBtpAddress(dstChainConfig.network, dstContractsConfig.bmc);

    console.log(`${srcChainConfig.id}: removeRelay`)
    await bmc.removeRelay(dstBmcAddr, address)
        .then((txHash) => bmc.getTxResult(txHash))
        .then((result) => {
            if (result.status != 1) {
                throw new Error(`ICON: failed to removeRelay: ${result.txHash}`);
            }
        })
}


export async function getVerifiers(srcConfig: BTP2Config){
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()

    const srcNetwork = IconNetwork.getNetwork(srcChainConfig);
    const bmc = new BMC(srcNetwork, srcContractsConfig.bmc);
    console.log(`${srcChainConfig.id}: getVerifiers`)
    const verifier = await bmc.getVerifiers()
    console.log(verifier)
}

export async function addVerifier(srcConfig: BTP2Config, dstConfig: BTP2Config){
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const dstChainConfig = dstConfig.chainConfig.getChain()
    const dstContractsConfig = dstConfig.contractsConfig.getContract()

    const srcNetwork = IconNetwork.getNetwork(srcChainConfig);
    const bmc = new BMC(srcNetwork, srcContractsConfig.bmc);
    const dstBmcAddr = getBtpAddress(dstChainConfig.network, dstContractsConfig.bmc);

    console.log(`${srcChainConfig.id}: addVerifier for ${dstChainConfig.network}`)
    const bmvAddress = srcConfig.contractsConfig.getBmv(dstChainConfig.id).address
    await bmc.addVerifier(dstChainConfig.network, bmvAddress)
        .then((txHash) => bmc.getTxResult(txHash))
        .then((result) => {
            if (result.status != 1) {
                throw new Error(`ICON: failed to register BMV to BMC: ${result.txHash}`);
            }
        })
    srcConfig.save()
}

export async function removeVerifier(srcConfig: BTP2Config, dstConfig: BTP2Config){
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const dstChainConfig = dstConfig.chainConfig.getChain()

    const srcNetwork = IconNetwork.getNetwork(srcChainConfig);
    const bmc = new BMC(srcNetwork, srcContractsConfig.bmc);

    console.log(`${srcChainConfig.id}: removeVerifier for ${dstChainConfig.network}`)
    await bmc.removeVerifier(dstChainConfig.network)
        .then((txHash) => bmc.getTxResult(txHash))
        .then((result) => {
            if (result.status != 1) {
                throw new Error(`ICON: failed to remove verifier: ${result.txHash}`);
            }
        })
    srcConfig.contractsConfig.removeBmv(dstChainConfig.id)
    srcConfig.save()
}

export async function getLink(srcConfig: BTP2Config){
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()

    const srcNetwork = IconNetwork.getNetwork(srcChainConfig);
    const bmc = new BMC(srcNetwork, srcContractsConfig.bmc);

    console.log(`${srcChainConfig.id}: getLink`)
    const links = await bmc.getLinks()
    console.log(links)
}

export async function addLink(srcConfig: BTP2Config, dstConfig: BTP2Config, networkId: string){
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const dstChainConfig = dstConfig.chainConfig.getChain()
    const dstContractsConfig = dstConfig.contractsConfig.getContract()

    const srcNetwork = IconNetwork.getNetwork(srcChainConfig);
    const bmc = new BMC(srcNetwork, srcContractsConfig.bmc);
    const dstBmcAddr = getBtpAddress(dstChainConfig.network, dstContractsConfig.bmc);

    console.log(`${srcChainConfig.id}: addBTPLink for ${dstBmcAddr}, (networkId:${networkId})`)
    await bmc.addBTPLink(dstBmcAddr, networkId)
        .then((txHash) => bmc.getTxResult(txHash))
        .then((result) => {
            if (result.status != 1) {
                throw new Error(`ICON: failed to addBTPLink: ${result.txHash}`);
            }
        })

    srcConfig.linksConfing.addLink(dstChainConfig.id, {
        'network' : dstChainConfig.network,
        'networkId' : networkId,
        'bmc' : dstContractsConfig.bmc
    })
    srcConfig.save()
}

export async function removeLink(srcConfig: BTP2Config, dstConfig: BTP2Config){
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const dstChainConfig = dstConfig.chainConfig.getChain()
    const dstContractsConfig = dstConfig.contractsConfig.getContract()

    const bmc = getBMCContract(srcConfig)
    const dstBmcAddr = getBtpAddress(dstChainConfig.network, dstContractsConfig.bmc);


    console.log(`${srcChainConfig.id}: removeLink for ${dstBmcAddr}`)
    await bmc.removeLink(dstBmcAddr)
        .then((txHash) => bmc.getTxResult(txHash))
        .then((result) => {
            if (result.status != 1) {
                throw new Error(`Failed to removeLink: ${result.txHash}`);
            }else{
                console.log(`success to removeLink :  ${result.txHash}`)
            }
        })

    srcConfig.contractsConfig.removeBmv(dstChainConfig.id)
    srcConfig.linksConfing.removeLink(dstChainConfig.id)
    srcConfig.save()
}

export async function getServices(config: BTP2Config) {
    const bmc = getBMCContract(config)
    const services = await bmc.getServices()
    console.log(services)
}

export async function addService(config: BTP2Config, service: string, address: string) {
    const bmc = getBMCContract(config)
    await bmc.addService(service, address).then((txHash) => bmc.getTxResult(txHash))
        .then((result) => {
            if (result.status != 1) {
                throw new Error(`Failed to addService: ${result.txHash}`);
            }else{
                console.log(`success to addService :  ${result.txHash}`)
            }
        })
}

export async function removeService(config: BTP2Config, service: string) {
    const bmc = getBMCContract(config)
    await bmc.removeService(service).then((txHash) => bmc.getTxResult(txHash))
        .then((result) => {
            if (result.status != 1) {
                throw new Error(`Failed to removeService: ${result.txHash}`);
            }else{
                console.log(`success to removeService :  ${result.txHash}`)
            }
        })
}

export async function getMode(config: BTP2Config) {
    const bmc = getBMCContract(config)
    const mode = await bmc.getMode()
    console.log(`getMode : ${mode}`)

}

export async function setMode(config: BTP2Config) {
    const bmc = getBMCContract(config)
    const beforeMode = await bmc.getMode()
    console.log(`before bmc mode : ${beforeMode}`)
    if (beforeMode == 0) {
        await bmc.setMode("0x1")
            .then((txHash) => bmc.getTxResult(txHash))
            .then((result) => {
                if (result.status != 1) {
                    throw new Error(`Failed to setMode: ${result.txHash}`);
                }else{
                    console.log(`success to setMode :  ${result.txHash}`)
                }
            })
    }else if (beforeMode == 1 ){
        await bmc.setMode("0x0")
            .then((txHash) => bmc.getTxResult(txHash))
            .then((result) => {
                if (result.status != 1) {
                    throw new Error(`Failed to setMode: ${result.txHash}`);
                }else{
                    console.log(`success to setMode :  ${result.txHash}`)
                }
            })
    }
    const afterMode = await bmc.getMode()
    console.log(`after bmc mode : ${afterMode}`)
}

export async function getReward(srcConfig: BTP2Config, dstConfig: BTP2Config){
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const dstChainConfig = dstConfig.chainConfig.getChain()

    const dstNetwork = IconNetwork.getNetwork(srcChainConfig);
    const bmc = new BMC(dstNetwork, srcContractsConfig.bmc);
    const address = await getRelayAddress(srcChainConfig)

    const reward = await bmc.getReward(dstChainConfig.network, address)
    console.log(`GetRewardReward : ${reward}`)
}

export async function claimReward(srcConfig: BTP2Config, dstConfig: BTP2Config, address: string){
    const dstChainConfig = dstConfig.chainConfig.getChain()

    const bmc = getBMCContract(srcConfig)

    const fee = await bmc.getFee(dstChainConfig.network, true)
    console.log(`GetFee : ${fee}`)
    await bmc.claimReward(dstChainConfig.network, address, fee)
        .then((txHash) => bmc.getTxResult(txHash))
        .then((result) => {
            if (result.status != 1) {
                throw new Error(`Failed to claimReward tx hash: ${result.txHash}`);
            }
            console.log("ClaimReward txHash : " + result.txHash)
        })
}

export async function getStatus(srcConfig: BTP2Config, dstConfig: BTP2Config){
    const dstChainConfig = dstConfig.chainConfig.getChain()
    const dstContractsConfig = dstConfig.contractsConfig.getContract()

    const bmc = getBMCContract(srcConfig)
    const link = getBtpAddress(dstChainConfig.network, dstContractsConfig.bmc);
    const status = await bmc.getStatus(link)
    console.log(`getStatus`)
    console.log(status)
    return status
}

export async function getFeeTable(srcConfig: BTP2Config, dstConfig: BTP2Config) {

    const dstChainConfig = dstConfig.chainConfig.getChain()

    let networks: string[] = [];
    networks.push(dstChainConfig.network);

    const bmc = getBMCContract(srcConfig);
    const feeTable = await bmc.getFeeTable(networks);
    console.log("get fee table");
    console.log(feeTable);
    
}

export async function setFeeTable(srcConfig:BTP2Config, dstConfig: BTP2Config, feeTable: string[]) {
    const dstChainConfig = dstConfig.chainConfig.getChain()
    const srcChainConfig = srcConfig.chainConfig.getChain()

    console.log(`${srcChainConfig.id}: set fee table for ${dstChainConfig.network}`)

    let networks: string[] = [];
    networks.push(dstChainConfig.network);

    let fees: string[][] = [];
    fees.push(feeTable);

    const bmc = getBMCContract(srcConfig);
    await bmc.setFeeTable(networks, fees)
        .then((txHash) => bmc.getTxResult(txHash))
        .then((result) => {
            if (result.status != 1) {
                throw new Error(`${srcChainConfig.id}: failed to set fee table: ${result.txHash}`);
            }
            console.log("SetFeeTable txHash : "+ result.txHash)
        })
    console.log(`${srcChainConfig.id}: setFeeTable for ${dstChainConfig.network}`)
}