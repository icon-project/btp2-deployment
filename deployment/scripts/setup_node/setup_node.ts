import IconService from "icon-sdk-js";
import {IconNetwork, Chain, Gov} from "../common/icon";
import {BTP2Config} from "../common/config";

const {CI_WORKFLOW} = process.env
const {IconAmount} = IconService;

async function ensure_decentralization(chainConfig: any) {
  const network = IconNetwork.getNetwork(chainConfig);
  const chain = new Chain(network);
  const prepAddress = network.wallet.getAddress()

  const mainPReps = await chain.getMainPReps();
  console.log(`${chainConfig.network}: getMainPReps`);
  console.log(mainPReps)
  const prep = await chain.getPRep(prepAddress)
    .catch((error) => {
      console.log(`${chainConfig.network}: need to register PRep and get power first`)
    });
  if (mainPReps.preps.length == 0 && prep == undefined) {
    const totalSupply = await network.getTotalSupply()
    const minDelegated = totalSupply.div(500)
    const bondAmount = IconAmount.of(100_000, IconAmount.Unit.ICX).toLoop()

    console.log(`${chainConfig.network}: registerPRep`)
    const name = `node_${prepAddress}`
    await chain.registerPRep(name)
      .then((txHash) => chain.getTxResult(txHash))
      .then((result) => {
        if (result.status != 1) {
          throw new Error(`${chainConfig.network}: failed to registerPrep: ${result.txHash}`);
        }
      })

    console.log(`${chainConfig.network}: setStake`)
    await chain.setStake(minDelegated.plus(bondAmount))
      .then((txHash) => chain.getTxResult(txHash))
      .then((result) => {
        if (result.status != 1) {
          throw new Error(`${chainConfig.network}: failed to setStake: ${result.txHash}`);
        }
      })

    console.log(`${chainConfig.network}: setDelegation`)
    await chain.setDelegation(prepAddress, minDelegated)
      .then((txHash) => chain.getTxResult(txHash))
      .then((result) => {
        if (result.status != 1) {
          throw new Error(`${chainConfig.network}: failed to setDelegation: ${result.txHash}`);
        }
      })

    console.log(`${chainConfig.network}: setBonderList`)
    await chain.setBonderList(prepAddress)
      .then((txHash) => chain.getTxResult(txHash))
      .then((result) => {
        if (result.status != 1) {
          throw new Error(`${chainConfig.network}: failed to setBonderList: ${result.txHash}`);
        }
      })

    console.log(`${chainConfig.network}: setBond`)
    await chain.setBond(prepAddress, bondAmount)
      .then((txHash) => chain.getTxResult(txHash))
      .then((result) => {
        if (result.status != 1) {
          throw new Error(`${chainConfig.network}: failed to setBond: ${result.txHash}`);
        }
      })
  }

  if (mainPReps.preps.length == 0) {
    throw new Error(`${chainConfig.network}: need to wait until the next term for decentralization`);
  }
}

async function ensure_revision_and_pubkey(chainConfig: any) {
  const network = IconNetwork.getNetwork(chainConfig);
  const chain = new Chain(network);
  const gov = new Gov(network);
  // ensure BTP revision
  const BTP_REVISION = 21
  const rev = parseInt(await chain.getRevision(), 16);
  console.log(`${chainConfig.network}: revision: ${rev}`)
  if (rev < BTP_REVISION) {
    console.log(`${chainConfig.network}: Set revision to ${BTP_REVISION}`)
    await gov.setRevision(BTP_REVISION)
      .then((txHash) => gov.getTxResult(txHash))
      .then((result) => {
        if (result.status != 1) {
          throw new Error(`${chainConfig.network}: failed to set revision: ${result.txHash}`);
        }
      })
  }

  // ensure public key registration
  const prepAddress = network.wallet.getAddress()
  const pubkey = await chain.getPRepNodePublicKey(prepAddress)
    .catch((error) => {
      console.log(`error: ${error}`)
    })
  console.log(`${chainConfig.network}: pubkey: ${pubkey}`)
  if (pubkey == undefined) {
    console.log(`${chainConfig.network}: register PRep node publicKey`)
    // register node publicKey in compressed form
    const pkey = network.wallet.getPublicKey(true);
    await chain.registerPRepNodePublicKey(prepAddress, pkey)
      .then((txHash) => chain.getTxResult(txHash))
      .then((result) => {
        if (result.status != 1) {
          throw new Error(`${chainConfig.network}: failed to registerPRepNodePublicKey: ${result.txHash}`);
        }
      })
  }
}

function sleep(millis: number) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

async function setup_node(path: string) {
  const config = new BTP2Config(path);
  const chainConfig = config.chainConfig.getChain()
  if (!chainConfig.network.includes('icon')) {
    console.log(`${chainConfig.network}: did nothing because it's not an ICON-compatible chain.`);
    return;
  }

  let success = false;
  for (let i = 0; i < 21; i++) {
    success = await ensure_decentralization(chainConfig)
      .then(() => {
        return true;
      })
      .catch((error) => {
        if (CI_WORKFLOW == "true") {
          console.log(error);
          return false;
        }
        throw error;
      });
    if (success) {
      await ensure_revision_and_pubkey(chainConfig)
        .then(() => {
          console.log(`${chainConfig.network}: node setup completed`)
        });
      break;
    }
    console.log(`... wait 10 seconds (${i})`)
    await sleep(10000);
  }
}

async function main() {
  const paths = process.argv.slice(2);
  console.log('ICON Config Path:', paths);
  paths.map(setup_node);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
