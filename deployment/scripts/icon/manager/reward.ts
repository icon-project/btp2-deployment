import {BTP2Config} from "../../common/config";
import {claimReward, getReward} from "./manager";



async function main() {
    if (process.env.srcNetworkPath === undefined || process.env.dstNetworkPath === undefined || process.env.method === undefined) {
        console.log("invalid args")
        return
    }

    const srcConfig = new BTP2Config(process.env.srcNetworkPath);
    const dstConfig = new BTP2Config(process.env.dstNetworkPath);

    if (process.env.method == "get") {
        await getReward(srcConfig, dstConfig)
    }else if (process.env.method == "claim") {
        if (process.env.address === undefined) {
            console.log("invalid args")
            return
        }
        await claimReward(srcConfig, dstConfig, process.env.address)
    }else{
        console.log("invalid method")
    }

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
