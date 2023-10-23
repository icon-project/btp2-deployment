# Deployment

## Introduction
This document describes how to use scripts for configuring and managing BTP2 networks.

> **Warning**
> This repository is restricted to use by adding a contract to the submodule after a GIT fork.

## API Document
- [Contract deploy document](doc/contract_deploy.md)
- [Contract update document](doc/contract_update.md)
- [BTP2 network management document](doc/network_management.md)


## Install required packages
This is a one-time setup procedure.
Before moving to the next step, you need to install all required packages via `npm` command.

```
npm install
```

A new directory named `node_modules` is created in the current working directory.

## Getting Started

### Submodule
Add contract for btp2 network configuration as submodule. 

* JAVA Score
```
 git submodule add https://github.com/icon-project/btp2-java.git ${PROJECT_ROOT}/javascore
```

* Solidity Score
```
 git submodule add https://github.com/icon-project/btp2-solidity.git ${PROJECT_ROOT}/solidity
```


### Network config
Create a network configuration file as JSON for configuration of the BTP2 network.


> **Note**
> When a contract is deployed, the contract address is saved in the network configuration file, 
> so it should not be deleted for contract update and management.

#### Network config example 
*  Berlin
```
{
  "chain": {
    "id": "berlin",
    "network": "0x7.icon",
    "endpoint": "https://berlin.net.solidwallet.io/api/v3/icon_dex",
    "keystore": "/berlin/keystore.json",
    "keypass": "",
    "type": "icon-btpblock-java"
  }
}
```

* BSC-testnet
```
{
  "chain": {
    "id": "bsc",
    "network": "0x61.bsc",
    "endpoint": "https://data-seed-prebsc-2-s1.bnbchain.org:8545",
    "type": "bsc-hertz-solidity",
    "hardhatNetwork": "bsc_testnet"
  }
}
```


### Hardhat config
If you configure the BTP2 network on the Ethereum blockchain, set the hardhat configuration.
* [hardhat config file](hardhat.config.ts).
* [hardhat config](https://hardhat.org/hardhat-runner/docs/config).



## Deployment
Describes how to configure a BTP2 network

### Build
To build all contracts, run the following command.
```
make build-all
```
It compiles both Java and Solidity contracts and generates artifacts for later deployment.


### Deploy
Describes contract deployment.
> **Note**
> In the case of solidity contact, files created in the ${PROJECT_ROOT}/deployment/.openzeppelin path must be
> managed because openzeppelin is being used for contract upgradeable.
> <br/>[[Openzeppelin document]](https://docs.openzeppelin.com/contracts/5.x/)

#### BMC Deploy
To deploy a BMC contract, set the network configuration path to deploy and run the following command.

* ICON
```
make icon-deploy-bmc srcNetworkPath=./berlin.json
```
 
* ETH
```
make eth-deploy-bmc srcNetworkPath=./bsc.json
```
#### Open BTP Network
Proceed with OpenBTPNetwork using the deployed BMC contract address and obtain the Network ID.

#### BMV Deploy
To deploy a BMV contract, set up and execute the network configuration path and other data to deploy the following commands.

> **Note**
> Instead of updating contacts, the BMV deploys and replaces new BMV.
> <br/>[[BMV Update]](doc/contract_update.md#bmv-update)

* ICON
```
make icon-deploy-bmv srcNetworkPath=./berlin.json dstNetworkPath=./bsc.json networkId=0x1 networkTypeId=0x1
```

* ETH
```
make eth-deploy-bmv srcNetworkPath=./bsc.json dstNetworkPath=./berlin.json networkId=0x1 networkTypeId=0x1
```

#### XCALL Deploy
To deploy a Xcall contract, set the network configuration path to deploy and run the following command.

> **Note**
> To use services other than xcall, you must register the service contract to use using ['addService'](doc/network_management.md#add-services) 

* ICON
```
make icon-deploy-xcall srcNetworkPath=./berlin.json
```

* ETH
```
make eth-deploy-xcall srcNetworkPath=./bsc.json
```

#### DAPP Deploy
To deploy a sample DAPP contract, set the network configuration path to deploy and run the following command.

* ICON
```
make icon-deploy-dapp srcNetworkPath=./berlin.json
```

* ETH
```
make eth-deploy-dapp srcNetworkPath=./bsc.json
```
