import {BTP2Config} from "../../common/config";
import {addRelay, getRelays, removeRelay} from "./manager";

async function main() {
    if (process.env.srcNetworkPath === undefined || process.env.dstNetworkPath === undefined ||  process.env.method === undefined) {
        console.log("invalid args")
        return
    }

    const srcConfig = new BTP2Config(process.env.srcNetworkPath);
    const dstConfig = new BTP2Config(process.env.dstNetworkPath);

    if (process.env.method == "get") {
        await getRelays(srcConfig, dstConfig)
    }else if (process.env.method == "add") {
        if (process.env.address === undefined) {
            console.log("invalid args")
            return
        }
        await addRelay(srcConfig, dstConfig, process.env.address)
    }else if (process.env.method == "remove"){
        if (process.env.address === undefined) {
            console.log("invalid args")
            return
        }
        await removeRelay(srcConfig, dstConfig, process.env.address)
    } else {
        console.log("invalid method")
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
