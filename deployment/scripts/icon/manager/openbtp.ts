

import {Contract, IconNetwork, Jar, BMC, Gov} from "../../common/icon";
import IconService from "icon-sdk-js";
const {IconConverter} = IconService;
import {BTP2Config, getBtpAddress} from "../../common/config";

async function open_btp_network(srcConfig: BTP2Config, netName: string) {
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const iconNetwork = IconNetwork.getNetwork(srcChainConfig)
    const lastBlock = await iconNetwork.getLastBlock();
    console.log(`open BTP network for ${netName}`)
    const gov = new Gov(iconNetwork);
    await gov.openBTPNetwork(netName, srcContractsConfig.bmc)
        .then((txHash) => gov.getTxResult(txHash))
        .then((result) => {
            if (result.status != 1) {
                throw new Error(`ICON: failed to openBTPNetwork: ${result.txHash}`);
            }
            return gov.filterEvent(result.eventLogs,
                'BTPNetworkOpened(int,int)', 'cx0000000000000000000000000000000000000000')
        })
        .then((events) => {
            console.log(events);
            if (events.length == 0) {
                throw new Error(`ICON: failed to find networkId`);
            }
            const indexed = events[0].indexed || [];
            const netTypeId = indexed[1];
            const netId = indexed[2];
            console.log(`networkTypeId=${netTypeId}`);
            console.log(`networkId=${netId}`);
        })
}

async function main() {
    if (process.env.srcNetworkPath === undefined || process.env.networkName === undefined) {
        console.log("invalid args")
        return
    }
    const srcConfig = new BTP2Config(process.env.srcNetworkPath);

    open_btp_network(srcConfig, process.env.networkName)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
