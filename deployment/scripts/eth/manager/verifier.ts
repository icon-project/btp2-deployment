import {BTP2Config} from "../../common/config";
import {addVerifier, getVerifiers, removeVerifier} from "./manager";



async function main() {
    if (process.env.srcNetworkPath === undefined || process.env.method === undefined) {
        console.log("invalid args")
        return
    }

    const srcConfig = new BTP2Config(process.env.srcNetworkPath);

    if (process.env.method == "get") {
        await getVerifiers(srcConfig)
    }else if (process.env.method == "add") {
        if (process.env.dstNetworkPath === undefined) {
            console.log("invalid args")
            return
        }
        const dstConfig = new BTP2Config(process.env.dstNetworkPath);
        await addVerifier(srcConfig, dstConfig)
    }else if (process.env.method == "remove") {
        if (process.env.dstNetworkPath === undefined) {
            console.log("invalid args")
            return
        }
        const dstConfig = new BTP2Config(process.env.dstNetworkPath);
        await removeVerifier(srcConfig, dstConfig)
    }else{
        console.log("invalid method")
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
