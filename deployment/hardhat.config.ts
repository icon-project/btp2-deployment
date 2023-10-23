import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";

const config: HardhatUserConfig = {
  paths: {
    sources: "./solidity/contracts",
    tests: "./solidity/test",
    cache: "./solidity/build/cache",
    artifacts: "./solidity/build/artifacts"
  },
  networks: {
    hardhat: {
      mining: {
        auto: false,
        interval: 3000
      }},
    goerli: {
      url: "https://goerli.infura.io/v3/ffbf8ebe228f4758ae82e175640275e0",
      accounts: [process.env.OPERATOR_WALLET_PRIVATE_KEY]
    },
    sepolia: {
      url: "https://rpc-sepolia.rockx.com",
      accounts: [process.env.OPERATOR_WALLET_PRIVATE_KEY]
    },
    bsc_testnet: {
      url: "https://data-seed-prebsc-1-s3.binance.org:8545",
      accounts: [process.env.OPERATOR_WALLET_PRIVATE_KEY]
    },
  },

  solidity: {
    version: "0.8.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 10,
      },
    },
  },
};

export default config;



