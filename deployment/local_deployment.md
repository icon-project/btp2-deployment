# Local test BTP2 network deployment

## Introduction
Configuring the environment for testing in a local environment

## BTP2 network configuration
icon1 <-> icon0 <-> hardhat

## Prepare
1. git submodule add https://github.com/icon-project/btp2-java.git ${PROJECT_ROOT}/javascore
2. git submodule add https://github.com/icon-project/btp2-solidity.git ${PROJECT_ROOT}/solidity
3. np install
4. cd ./deployment
5. export OPERATOR_WALLET_PRIVATE_KEY=0xabcd... 
6. make build-all

## Setup node
1. make start-nodes
2. make setup-node
* You will be seeing a series of commands executed. But at first, the script will be stopped with the following message.
```
Error: ICON: need to wait until the next term for decentralization
```
## Deployment order

### BMC Deploy
1. make icon-deploy-bmc srcNetworkPath=./docker/deployment_config/local_icon0.json
2. make icon-deploy-bmc srcNetworkPath=./docker/deployment_config/local_icon1.json
3. make eth-deploy-bmc srcNetworkPath=./docker/deployment_config/local_hardhat.json

### ICON OpenBTPNetwork
1. make icon-manager-open-btp srcNetworkPath=./docker/deployment_config/local_icon1.json networkName=icon0_v1
* Created network ID: networkId=0x1
2. make icon-manager-open-btp srcNetworkPath=./docker/deployment_config/local_icon0.json networkName=icon1_v1
* Created network ID: networkId=0x1
3. make icon-manager-open-btp srcNetworkPath=./docker/deployment_config/local_icon0.json networkName=hardhat_v1
* Created network ID: networkId=0x2

### BMV Deploy
1. make icon-deploy-bmv srcNetworkPath=./docker/deployment_config/local_icon1.json dstNetworkPath=./docker/deployment_config/local_icon0.json dstNetworkId=0x1 dstNetworkTypeId=0x1
2. make icon-deploy-bmv srcNetworkPath=./docker/deployment_config/local_icon0.json dstNetworkPath=./docker/deployment_config/local_icon1.json dstNetworkId=0x1 dstNetworkTypeId=0x1
3. make icon-deploy-bmv srcNetworkPath=./docker/deployment_config/local_icon0.json dstNetworkPath=./docker/deployment_config/local_hardhat.json
4. make eth-deploy-bmv srcNetworkPath=./docker/deployment_config/local_hardhat.json dstNetworkPath=./docker/deployment_config/local_icon0.json dstNetworkId=0x2 dstNetworkTypeId=0x1

### Xcall Deploy
1. make icon-deploy-xcall srcNetworkPath=./docker/deployment_config/local_icon1.json
2. make icon-deploy-xcall srcNetworkPath=./docker/deployment_config/local_icon0.json
3. make eth-deploy-xcall srcNetworkPath=./docker/deployment_config/local_hardhat.json

### Dapp Deploy
1. make icon-deploy-dapp srcNetworkPath=./docker/deployment_config/local_icon1.json
2. make icon-deploy-dapp srcNetworkPath=./docker/deployment_config/local_icon0.json
3. make eth-deploy-dapp srcNetworkPath=./docker/deployment_config/local_hardhat.json

### Add Relay
1. make icon-manager-relay srcNetworkPath=./docker/deployment_config/local_icon1.json dstNetworkPath=./docker/deployment_config/local_icon0.json address=hxb6b5791be0b5ef67063b3c10b840fb81514db2fd method=add
2. make icon-manager-relay srcNetworkPath=./docker/deployment_config/local_icon0.json dstNetworkPath=./docker/deployment_config/local_icon1.json address=hxb6b5791be0b5ef67063b3c10b840fb81514db2fd method=add
3. make icon-manager-relay srcNetworkPath=./docker/deployment_config/local_icon0.json dstNetworkPath=./docker/deployment_config/local_hardhat.json address=hxb6b5791be0b5ef67063b3c10b840fb81514db2fd method=add
4. make eth-manager-relay srcNetworkPath=./docker/deployment_config/local_hardhat.json dstNetworkPath=./docker/deployment_config/local_icon0.json address=f39fd6e51aad88f6f4ce6ab8827279cfffb92266 method=add

### Run relay
#### ICON1 to ICON0 Relay

1. Change bmc address in relay config file
   * ${PROJECT_ROOT}/relay/icon0_hardhat/config/icon_to_hardhat_config.json
```
```

2. docker compose run
```
cd ${PROJECT_ROOT}/relay/icon1_icon0
docker-compose up -d
```

#### ICON0 to Hardhat Relay
1. Change bmc address in relay config file
   * ${PROJECT_ROOT}/relay/icon1_icon0/config/icon_to_icon_config.json

2. docker compose run
```
cd ${PROJECT_ROOT}/relay/icon0_hardhat
docker-compose up -d
```

### Run relay