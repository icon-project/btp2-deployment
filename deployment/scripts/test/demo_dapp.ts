import IconService from 'icon-sdk-js';
import {ethers} from 'hardhat';
import {IconNetwork, getBtpAddress} from "../common/icon";
import {XCall, DAppProxy} from "../common/icon";
import {BaseContract, BigNumber, ContractReceipt} from "ethers";
import {TypedEvent, TypedEventFilter} from "../../typechain-types/common";
import {BTP2Config} from "../common/config";
import {setEthNetwork} from "../common/eth/network";

const {IconConverter} = IconService;

function sleep(millis: number) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

async function waitEvent<TEvent extends TypedEvent>(
    ctr : BaseContract,
    filter: TypedEventFilter<TEvent>,
    fromBlock?: number
): Promise<Array<TEvent>> {
    let height = await ctr.provider.getBlockNumber();
    let next = height + 1;
    if (fromBlock && fromBlock < height) {
        height = fromBlock;
    }
    while (true) {
        for (;height < next;height++){
            const events = await ctr.queryFilter(filter, height);
            if (events.length > 0) {
                return events as Array<TEvent>;
            }
        }
        await sleep(1000);
        next = await ctr.provider.getBlockNumber() + 1;
    }
}

function filterEvent<TEvent extends TypedEvent>(
    ctr : BaseContract,
    filter: TypedEventFilter<TEvent>,
    receipt: ContractReceipt) : Array<TEvent> {
    const inf = ctr.interface;
    const address = ctr.address;
    const topics = filter.topics || [];
    if (receipt.events && typeof topics[0] === "string") {
        const fragment = inf.getEvent(topics[0]);
        return receipt.events
            .filter((evt) => {
                if (evt.address == address) {
                    return topics.every((v, i) => {
                        if (!v) {
                            return true
                        } else if (typeof v === "string") {
                            return v == evt.topics[i]
                        } else {
                            return v.includes(evt.topics[i])
                        }
                    })
                }
                return false
            })
            .map((evt) => {
                return { args : inf.decodeEventLog(fragment, evt.data, evt.topics) } as TEvent
            });
    }
    return [];
}

function hexToString(data: string) {
    const hexArray = ethers.utils.arrayify(data);
    let msg = '';
    for (let i = 0; i < hexArray.length; i++) {
        msg += String.fromCharCode(hexArray[i]);
    }
    return msg;
}

function isIconChain(chain: any) {
    return chain.network.includes('icon');
}

function isEVMChain(chain: any) {
    return chain.network.includes('hardhat') || chain.network.includes('eth2')|| chain.network.includes('bsc');
}

async function sendMessageFromDApp(srcChainConfig: any, srcContractConfig: any,
                                   dstChainConfig: any, dstContractConfig: any, msg: string,
                                   rollback?: string) {
    const isRollback = rollback ? true : false;
    if (isIconChain(srcChainConfig)) {
        const iconNetwork = IconNetwork.getNetwork(srcChainConfig);
        const xcallSrc = new XCall(iconNetwork, srcContractConfig.xcall);
        const fee = await xcallSrc.getFee(dstChainConfig.network, isRollback);
        console.log('fee=' + fee);

        const dappSrc = new DAppProxy(iconNetwork, srcContractConfig.dapp);
        const to = getBtpAddress(dstChainConfig.network, dstContractConfig.dapp);
        const data = IconConverter.toHex(msg);
        const rbData = rollback ? IconConverter.toHex(rollback) : undefined;

        return await dappSrc.sendMessage(to, data, rbData, fee)
            .then((txHash) => dappSrc.getTxResult(txHash))
            .then((receipt) => {
                if (receipt.status != 1) {
                    throw new Error(`DApp: failed to sendMessage: ${receipt.txHash}`);
                }
                return receipt;
            });
    } else if (isEVMChain(srcChainConfig)) {
        await setEthNetwork(srcChainConfig.hardhatNetwork)
        const xcallSrc = await ethers.getContractAt('CallService', srcContractConfig.xcall);
        const fee = await xcallSrc.getFee(dstChainConfig.network, isRollback);
        console.log('fee=' + fee);

        const dappSrc = await ethers.getContractAt('DAppProxySample', srcContractConfig.dapp);
        const to = getBtpAddress(dstChainConfig.network, dstContractConfig.dapp);
        const data = IconConverter.toHex(msg);
        const rbData = rollback ? IconConverter.toHex(rollback) : "0x";

        return await dappSrc.sendMessage(to, data, rbData, {value: fee})
            .then((tx) => tx.wait(1))
            .then((receipt) => {
                if (receipt.status != 1) {
                    throw new Error(`DApp: failed to sendMessage: ${receipt.transactionHash}`);
                }
                return receipt;
            })
    } else {
        throw new Error(`DApp: unknown source chain: ${srcChainConfig.network}`);
    }
}

async function verifyCallMessageSent(srcChainConfig: any, srcContractConfig: any, receipt: any) {
    let event;
    if (isIconChain(srcChainConfig)) {
        const iconNetwork = IconNetwork.getNetwork(srcChainConfig);
        const xcallSrc = new XCall(iconNetwork, srcContractConfig.xcall);
        const logs = xcallSrc.filterEvent(receipt.eventLogs,
            'CallMessageSent(Address,str,int,int)', xcallSrc.address);
        if (logs.length == 0) {
            throw new Error(`DApp: could not find event: "CallMessageSent"`);
        }
        console.log(logs);
        const indexed = logs[0].indexed || [];
        const data = logs[0].data || [];
        event = {
            _from: indexed[1],
            _to: indexed[2],
            _sn: BigNumber.from(indexed[3]),
            _nsn: BigNumber.from(data[0])
        };
    } else if (isEVMChain(srcChainConfig)) {
        await setEthNetwork(srcChainConfig.hardhatNetwork)
        const xcallSrc = await ethers.getContractAt('CallService', srcContractConfig.xcall);
        const logs = filterEvent(xcallSrc, xcallSrc.filters.CallMessageSent(), receipt);
        if (logs.length == 0) {
            throw new Error(`DApp: could not find event: "CallMessageSent"`);
        }
        console.log(logs);
        event = logs[0].args;
    } else {
        throw new Error(`DApp: unknown source chain: ${srcChainConfig.network}`);
    }
    console.log(`serialNum=${event._sn}`);
    return event._sn;
}

async function checkCallMessage(srcChainConfig: any, srcContractConfig: any,
                                dstChainConfig: any, dstContractConfig: any,
                                sn: BigNumber, msg: string) {
    if (isEVMChain(dstChainConfig)) {
        await setEthNetwork(dstChainConfig.hardhatNetwork)
        const xcallDst = await ethers.getContractAt('CallService', dstContractConfig.xcall);
        const filterCM = xcallDst.filters.CallMessage(
            getBtpAddress(srcChainConfig.network, srcContractConfig.dapp),
            dstContractConfig.dapp,
            sn
        )
        const logs = await waitEvent(xcallDst, filterCM);
        if (logs.length == 0) {
            throw new Error(`DApp: could not find event: "CallMessage"`);
        }
        console.log(logs[0]);
        const calldata = hexToString(logs[0].args._data)
        if (msg !== calldata) {
            throw new Error(`DApp: the calldata is different from the sent message`);
        }
        return {
            _reqId: logs[0].args._reqId,
            _data: logs[0].args._data
        };
    } else if (isIconChain(dstChainConfig)) {
        const iconNetwork = IconNetwork.getNetwork(dstChainConfig);
        const xcallDst = new XCall(iconNetwork, dstContractConfig.xcall);
        const {block, events} = await xcallDst.waitEvent("CallMessage(str,str,int,int,bytes)");
        if (events.length == 0) {
            throw new Error(`DApp: could not find event: "CallMessage"`);
        }
        console.log(events[0]);
        const indexed = events[0].indexed || [];
        const data = events[0].data || [];
        const event = {
            _from: indexed[1],
            _to: indexed[2],
            _sn: BigNumber.from(indexed[3]),
            _reqId: BigNumber.from(data[0]),
            _data: data[1]
        };
        if (!sn.eq(event._sn)) {
            throw new Error(`DApp: serial number mismatch (${sn} != ${event._sn})`);
        }
        const calldata = hexToString(event._data)
        if (msg !== calldata) {
            throw new Error(`DApp: the calldata is different from the sent message`);
        }
        return {
            _reqId: event._reqId,
            _data: event._data
        };
    } else {
        throw new Error(`DApp: unknown destination chain: ${dstChainConfig.network}`);
    }
}

async function invokeExecuteCall(dstChainConfig: any, dstContractConfig: any, reqId: BigNumber, data: string) {
    if (isEVMChain(dstChainConfig)) {
        await setEthNetwork(dstChainConfig.hardhatNetwork)
        const xcallDst = await ethers.getContractAt('CallService', dstContractConfig.xcall);
        return await xcallDst.executeCall(reqId, data, {gasLimit: 600000})
            .then((tx) => tx.wait(1))
            .then((receipt) => {
                if (receipt.status != 1) {
                    throw new Error(`DApp: failed to executeCall: ${receipt.transactionHash}`);
                }
                return receipt;
            })
    } else if (isIconChain(dstChainConfig)) {
        const iconNetwork = IconNetwork.getNetwork(dstChainConfig);
        const xcallDst = new XCall(iconNetwork, dstContractConfig.xcall);
        return await xcallDst.executeCall(reqId.toHexString(), data)
            .then((txHash) => xcallDst.getTxResult(txHash))
            .then((receipt) => {
                if (receipt.status != 1) {
                    throw new Error(`DApp: failed to executeCall: ${receipt.txHash}`);
                }
                return receipt;
            });
    } else {
        throw new Error(`DApp: unknown destination chain: ${dstChainConfig.network}`);
    }
}

async function verifyReceivedMessage(dstChainConfig: any, dstContractConfig: any, receipt: any, msg: string) {
    let event;
    if (isEVMChain(dstChainConfig)) {
        await setEthNetwork(dstChainConfig.hardhatNetwork)
        const dappDst = await ethers.getContractAt('DAppProxySample', dstContractConfig.dapp);
        const logs = filterEvent(dappDst, dappDst.filters.MessageReceived(), receipt);
        if (logs.length == 0) {
            throw new Error(`DApp: could not find event: "MessageReceived"`);
        }
        console.log(logs);
        event = logs[0].args;
    } else if (isIconChain(dstChainConfig)) {
        const iconNetwork = IconNetwork.getNetwork(dstChainConfig);
        const dappDst = new DAppProxy(iconNetwork, dstContractConfig.dapp);
        const logs = dappDst.filterEvent(receipt.eventLogs,'MessageReceived(str,bytes)', dappDst.address);
        if (logs.length == 0) {
            throw new Error(`DApp: could not find event: "MessageReceived"`);
        }
        console.log(logs);
        const data = logs[0].data || [];
        event = {_from: data[0], _data: data[1]}
    } else {
        throw new Error(`DApp: unknown destination chain: ${dstChainConfig.network}`);
    }

    const receivedMsg = hexToString(event._data)
    console.log(`From: ${event._from}`);
    console.log(`Data: ${event._data}`);
    console.log(`Msg: ${receivedMsg}`);
    if (msg !== receivedMsg) {
        throw new Error(`DApp: received message is different from the sent message`);
    }
}

async function checkCallExecuted(dstChainConfig: any, dstContractConfig: any, receipt: any, reqId: BigNumber, expectRevert: boolean) {
    let event;
    if (isEVMChain(dstChainConfig)) {
        await setEthNetwork(dstChainConfig.hardhatNetwork)
        const xcallDst = await ethers.getContractAt('CallService', dstContractConfig.xcall);
        const logs = filterEvent(xcallDst, xcallDst.filters.CallExecuted(), receipt);
        if (logs.length == 0) {
            throw new Error(`DApp: could not find event: "CallExecuted"`);
        }
        console.log(logs);
        event = logs[0].args;
    } else if (isIconChain(dstChainConfig)) {
        const iconNetwork = IconNetwork.getNetwork(dstChainConfig);
        const xcallDst = new XCall(iconNetwork, dstContractConfig.xcall);
        const logs = xcallDst.filterEvent(receipt.eventLogs,'CallExecuted(int,int,str)', xcallDst.address);
        if (logs.length == 0) {
            throw new Error(`DApp: could not find event: "CallExecuted"`);
        }
        console.log(logs);
        const indexed = logs[0].indexed || [];
        const data = logs[0].data || [];
        event = {
            _reqId: BigNumber.from(indexed[1]),
            _code: BigNumber.from(data[0]),
            _msg: data[1]
        }
    } else {
        throw new Error(`DApp: unknown destination chain: ${dstChainConfig.network}`);
    }
    if (!reqId.eq(event._reqId) ||
        (expectRevert && event._code.isZero()) || (!expectRevert && !event._code.isZero())) {
        throw new Error(`DApp: not the expected execution result`);
    }
}

async function checkResponseMessage(srcChainConfig: any, srcContractConfig: any, sn: BigNumber, expectRevert: boolean) {
    let event, blockNum;
    if (isIconChain(srcChainConfig)) {
        const iconNetwork = IconNetwork.getNetwork(srcChainConfig);
        const xcallSrc = new XCall(iconNetwork, srcContractConfig.xcall);
        const {block, events} = await xcallSrc.waitEvent("ResponseMessage(int,int,str)");
        if (events.length == 0) {
            throw new Error(`DApp: could not find event: "ResponseMessage"`);
        }
        console.log(events);
        const indexed = events[0].indexed || [];
        const data = events[0].data || [];
        event = {
            _sn: BigNumber.from(indexed[1]),
            _code: BigNumber.from(data[0]),
            _msg: data[1]
        }
        blockNum = block.height;
    } else if (isEVMChain(srcChainConfig)) {
        await setEthNetwork(srcChainConfig.hardhatNetwork)
        const xcallSrc = await ethers.getContractAt('CallService', srcContractConfig.xcall);
        const events = await waitEvent(xcallSrc, xcallSrc.filters.ResponseMessage());
        if (events.length == 0) {
            throw new Error(`DApp: could not find event: "ResponseMessage"`);
        }
        console.log(events)
        event = events[0].args;
        blockNum = (await events[0].getBlock()).number;
    } else {
        throw new Error(`DApp: unknown source chain: ${srcChainConfig.network}`);
    }
    if (!sn.eq(event._sn)) {
        throw new Error(`DApp: received serial number (${event._sn}) is different from the sent one (${sn})`);
    }
    if ((expectRevert && event._code.isZero()) || (!expectRevert && !event._code.isZero())) {
        throw new Error(`DApp: not the expected response message`);
    }
    return blockNum;
}

async function checkRollbackMessage(srcChainConfig: any, srcContractConfig: any, blockNum: number) {
    if (isEVMChain(srcChainConfig)) {
        await setEthNetwork(srcChainConfig.hardhatNetwork)
        const xcallSrc = await ethers.getContractAt('CallService', srcContractConfig.xcall);
        const logs = await waitEvent(xcallSrc, xcallSrc.filters.RollbackMessage(), blockNum);
        if (logs.length == 0) {
            throw new Error(`DApp: could not find event: "RollbackMessage"`);
        }
        console.log(logs[0]);
        return logs[0].args._sn;
    } else if (isIconChain(srcChainConfig)) {
        const iconNetwork = IconNetwork.getNetwork(srcChainConfig);
        const xcallSrc = new XCall(iconNetwork, srcContractConfig.xcall);
        const {block, events} = await xcallSrc.waitEvent("RollbackMessage(int)", blockNum);
        if (events.length == 0) {
            throw new Error(`DApp: could not find event: "RollbackMessage"`);
        }
        console.log(events[0]);
        const indexed = events[0].indexed || [];
        return BigNumber.from(indexed[1]);
    } else {
        throw new Error(`DApp: unknown source chain: ${srcChainConfig.network}`);
    }
}

async function invokeExecuteRollback(srcChainConfig: any, srcContractConfig: any, sn: BigNumber) {
    if (isEVMChain(srcChainConfig)) {
        await setEthNetwork(srcChainConfig.hardhatNetwork)
        const xcallSrc = await ethers.getContractAt('CallService', srcContractConfig.xcall);
        return await xcallSrc.executeRollback(sn, {gasLimit: 600000})
            .then((tx) => tx.wait(1))
            .then((receipt) => {
                if (receipt.status != 1) {
                    throw new Error(`DApp: failed to executeRollback: ${receipt.transactionHash}`);
                }
                return receipt;
            });
    } else if (isIconChain(srcChainConfig)) {
        const iconNetwork = IconNetwork.getNetwork(srcChainConfig);
        const xcallSrc = new XCall(iconNetwork, srcContractConfig.xcall);
        return await xcallSrc.executeRollback(sn.toHexString())
            .then((txHash) => xcallSrc.getTxResult(txHash))
            .then((receipt) => {
                if (receipt.status != 1) {
                    throw new Error(`DApp: failed to executeRollback: ${receipt.txHash}`);
                }
                return receipt;
            });
    } else {
        throw new Error(`DApp: unknown source chain: ${srcChainConfig.network}`);
    }
}

async function verifyRollbackDataReceivedMessage(srcChainConfig: any, srcContractConfig: any, receipt: any, rollback: string | undefined) {
    let event;
    if (isEVMChain(srcChainConfig)) {
        await setEthNetwork(srcChainConfig.hardhatNetwork)
        const dappSrc = await ethers.getContractAt('DAppProxySample', srcContractConfig.dapp);
        const logs = filterEvent(dappSrc, dappSrc.filters.RollbackDataReceived(), receipt);
        if (logs.length == 0) {
            throw new Error(`DApp: could not find event: "RollbackDataReceived"`);
        }
        console.log(logs)
        event = logs[0].args;
    } else if (isIconChain(srcChainConfig)) {
        const iconNetwork = IconNetwork.getNetwork(srcChainConfig);
        const dappSrc = new DAppProxy(iconNetwork, srcContractConfig.dapp);
        const logs = dappSrc.filterEvent(receipt.eventLogs,"RollbackDataReceived(str,int,bytes)", dappSrc.address);
        if (logs.length == 0) {
            throw new Error(`DApp: could not find event: "RollbackDataReceived"`);
        }
        console.log(logs)
        const data = logs[0].data || [];
        event = {_from: data[0], _ssn: data[1], _rollback: data[2]}
    } else {
        throw new Error(`DApp: unknown source chain: ${srcChainConfig.network}`);
    }

    const receivedRollback = hexToString(event._rollback)
    console.log(`From: ${event._from}`);
    console.log(`Ssn: ${event._ssn}`);
    console.log(`Data: ${event._rollback}`);
    console.log(`Rollback: ${receivedRollback}`);
    if (rollback !== receivedRollback) {
        throw new Error(`DApp: received rollback is different from the sent data`);
    }
}

async function checkRollbackExecuted(srcChainConfig: any, srcContractConfig: any, receipt: any, sn: BigNumber) {
    let event;
    if (isIconChain(srcChainConfig)) {
        const iconNetwork = IconNetwork.getNetwork(srcChainConfig);
        const xcallSrc = new XCall(iconNetwork, srcContractConfig.xcall);
        const logs = xcallSrc.filterEvent(receipt.eventLogs, "RollbackExecuted(int,int,str)", xcallSrc.address);
        if (logs.length == 0) {
            throw new Error(`DApp: could not find event: "RollbackExecuted"`);
        }
        console.log(logs);
        const indexed = logs[0].indexed || [];
        const data = logs[0].data || [];
        event = {
            _sn: BigNumber.from(indexed[1]),
            _code: BigNumber.from(data[0]),
            _msg: data[1]
        }
    } else if (isEVMChain(srcChainConfig)) {
        await setEthNetwork(srcChainConfig.hardhatNetwork)
        const xcallSrc = await ethers.getContractAt('CallService', srcContractConfig.xcall);
        const logs = filterEvent(xcallSrc, xcallSrc.filters.RollbackExecuted(), receipt);
        if (logs.length == 0) {
            throw new Error(`DApp: could not find event: "RollbackExecuted"`);
        }
        console.log(logs)
        event = logs[0].args;
    } else {
        throw new Error(`DApp: unknown source chain: ${srcChainConfig.network}`);
    }
    if (!sn.eq(event._sn)) {
        throw new Error(`DApp: received serial number (${event._sn}) is different from the sent one (${sn})`);
    }
    if (!event._code.isZero()) {
        throw new Error(`DApp: not the expected execution result`);
    }
}

async function sendCallMessage(srcConfig: BTP2Config, dstConfig: BTP2Config, msgData?: string, needRollback?: boolean) {
    const srcChainConfig = srcConfig.chainConfig.getChain()
    const srcContractsConfig = srcConfig.contractsConfig.getContract()
    const dstChainConfig = dstConfig.chainConfig.getChain()
    const dstContractsConfig = dstConfig.contractsConfig.getContract()

    const testName = sendCallMessage.name + (needRollback ? "WithRollback" : "");
    console.log(`\n### ${testName}: ${srcChainConfig.network} => ${dstChainConfig.network}`);
    if (!msgData) {
        msgData = `${testName}_${srcChainConfig.network}_${dstChainConfig.network}`;
    }
    const rollbackData = needRollback ? `ThisIsRollbackMessage_${srcChainConfig.network}_${dstChainConfig.network}` : undefined;
    const expectRevert = (msgData === "revertMessage");
    let step = 1;

    console.log(`[${step++}] send message from DApp`);
    const sendMessageReceipt =
        await sendMessageFromDApp(srcChainConfig, srcContractsConfig, dstChainConfig, dstContractsConfig, msgData, rollbackData);
    const sn = await verifyCallMessageSent(srcChainConfig, srcContractsConfig, sendMessageReceipt);

    console.log(`[${step++}] check CallMessage event on ${dstChainConfig.network} chain`);
    const callMsgEvent =
        await checkCallMessage(srcChainConfig, srcContractsConfig, dstChainConfig, dstContractsConfig, sn, msgData);
    const reqId = callMsgEvent._reqId;
    const callData = callMsgEvent._data;

    console.log(`[${step++}] invoke executeCall with reqId=${reqId}`);
    const executeCallReceipt = await invokeExecuteCall(dstChainConfig, dstContractsConfig, reqId, callData);

    if (!expectRevert) {
        console.log(`[${step++}] verify the received message`);
        await verifyReceivedMessage(dstChainConfig, dstContractsConfig, executeCallReceipt, msgData);
    }
    console.log(`[${step++}] check CallExecuted event on ${dstChainConfig.network} chain`);
    await checkCallExecuted(dstChainConfig, dstContractsConfig, executeCallReceipt, reqId, expectRevert);

    if (needRollback) {
        console.log(`[${step++}] check ResponseMessage event on ${srcChainConfig.network} chain`);
        const responseHeight = await checkResponseMessage(srcChainConfig, srcContractsConfig, sn, expectRevert);

        if (expectRevert) {
            console.log(`[${step++}] check RollbackMessage event on ${srcChainConfig.network} chain`);
            const sn = await checkRollbackMessage(srcChainConfig, srcContractsConfig, responseHeight);

            console.log(`[${step++}] invoke executeRollback with sn=${sn}`);
            const executeRollbackReceipt = await invokeExecuteRollback(srcChainConfig, srcContractsConfig, sn);

            console.log(`[${step++}] verify rollback data received message`);
            await verifyRollbackDataReceivedMessage(srcChainConfig, srcContractsConfig, executeRollbackReceipt, rollbackData);

            console.log(`[${step++}] check RollbackExecuted event on ${srcChainConfig.network} chain`);
            await checkRollbackExecuted(srcChainConfig, srcContractsConfig, executeRollbackReceipt, sn);
        }
    }
}

async function show_banner() {
    const banner = `
       ___           __
  ___ |__ \\___  ____/ /__  ____ ___  ____
 / _ \\__/ / _ \\/ __  / _ \\/ __ \`__ \\/ __ \\
/  __/ __/  __/ /_/ /  __/ / / / / / /_/ /
\\___/____\\___/\\__,_/\\___/_/ /_/ /_/\\____/
`;
    console.log(banner);
}


async function main() {
    if (process.env.srcNetworkPath == undefined || process.env.dstNetworkPath == undefined) {
        console.log("invalid args")
        return
    }

    const srcConfig = new BTP2Config(process.env.srcNetworkPath);
    const dstConfig = new BTP2Config(process.env.dstNetworkPath);

    show_banner()
        // .then(() => sendCallMessage(srcConfig, dstConfig))
        // .then(() => sendCallMessage(dstConfig, srcConfig))
        // .then(() => sendCallMessage(srcConfig, dstConfig, "checkSuccessResponse", true))
        // .then(() => sendCallMessage(dstConfig, srcConfig, "checkSuccessResponse", true))
        .then(() => sendCallMessage(srcConfig, dstConfig, "revertMessage", true))
        // .then(() => sendCallMessage(dstConfig, srcConfig, "revertMessage", true))
        .catch((error) => {
            console.error(error);
            process.exitCode = 1;
        });
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});



