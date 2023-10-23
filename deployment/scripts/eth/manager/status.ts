import {BTP2Config} from "../../common/config";
import {getStatus} from "./manager";

async function main(){
    if (process.env.srcNetworkPath === undefined || process.env.dstNetworkPath === undefined) {
        console.log("invalid args")
        return
    }

    const srcConfig = new BTP2Config(process.env.srcNetworkPath);
    const dstConfig = new BTP2Config(process.env.dstNetworkPath);

    await getStatus(srcConfig, dstConfig)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
