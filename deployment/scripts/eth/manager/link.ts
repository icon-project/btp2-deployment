import {BTP2Config} from "../../common/config";
import {addLink, removeLink} from "./manager";

async function main() {
    if (process.env.srcNetworkPath === undefined || process.env.dstNetworkPath === undefined || process.env.method === undefined) {
        console.log("invalid args")
        return
    }

    const srcConfig = new BTP2Config(process.env.srcNetworkPath);
    const dstConfig = new BTP2Config(process.env.dstNetworkPath);

    if (process.env.method == "add") {
        await addLink(srcConfig, dstConfig)
    }else if (process.env.method == "remove") {
        await removeLink(srcConfig, dstConfig)
    }else{
        console.log("invalid method")
    }
    srcConfig.save()
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

