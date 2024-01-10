import {BTP2Config} from "../../common/config";
import {setFeeTable, getFeeTable} from "./manager";



async function main() {

    if (process.env.srcNetworkPath === undefined || process.env.dstNetworkPath === undefined || process.env.method === undefined) {
        console.log("invalid args")
        return
    }

    const srcConfig = new BTP2Config(process.env.srcNetworkPath);
    const dstConfig = new BTP2Config(process.env.dstNetworkPath);

    if (process.env.method == "get") {
        await getFeeTable(srcConfig, dstConfig);
    } else if (process.env.method == "set") {
        if (process.env.feeTable === undefined) {
            console.log("invalid data for feeTable. Should be in format of \"[0x12345,0x213423]\"")
            return
        }
        const feeTable = process.env.feeTable.replace(/'| |\[|\]/g, '').split(',');
        await setFeeTable(srcConfig, dstConfig, feeTable);
    } else {
        console.log("invalid method")
    }

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
