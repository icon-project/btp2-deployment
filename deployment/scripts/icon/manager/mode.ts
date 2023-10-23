import {IconNetwork, BMC} from "../../common/icon";
import {BTP2Config} from "../../common/config";
import {getMode, setMode} from "./manager";




async function main() {
    if (process.env.srcNetworkPath === undefined || process.env.method === undefined) {
        console.log("invalid args")
        return
    }

    const config = new BTP2Config(process.env.srcNetworkPath);

    if (process.env.method == "get") {
        await getMode(config)
    }else if (process.env.method == "set") {
        await setMode(config)
    }else{
        console.log("invalid method")
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
