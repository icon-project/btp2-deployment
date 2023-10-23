import {BTP2Config} from "../../common/config";
import {getServices, addService, removeService} from "./manager";



async function main() {
    if (process.env.srcNetworkPath === undefined || process.env.method === undefined) {
        console.log("invalid args")
        return
    }

    const config = new BTP2Config(process.env.srcNetworkPath);

    if (process.env.method == "get") {
        await getServices(config)
    }else if (process.env.method == "add") {
        if (process.env.service === undefined || process.env.address === undefined) {
            console.log("invalid args")
            return
        }
        await addService(config, process.env.service, process.env.address)
    }else if (process.env.method == "remove") {
        if (process.env.service === undefined) {
            console.log("invalid args")
            return
        }
        await removeService(config, process.env.service)
    }else{
        console.log("invalid method")
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
