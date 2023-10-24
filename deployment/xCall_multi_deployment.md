# xCall Multi Deployment

## Introduction
Configure an xCall Multi environment that is connected between icon networks.

## Step

### Install required packages
1. [install-required-packages](./README.md#install-required-packages)

### Getting Started
1. [Getting Started](./README.md#getting-started)

#### Network config example
*  SOURCE_NETWORK_CONFIG.json
```
{
"chain": {
    "id": "icon_local0",
    "network": "0x3.icon",
    "endpoint": "http://localhost:9080/api/v3/icon_dex",
    "keystore": "./icon0/keystore.json",
    "keypass": "icon_local0",
    "type": "icon-btpblock-java"
  }
}
```

*  DESTINATION_NETWORK_CONFIG.json
```
{
"chain": {
    "id": "icon_local1",
    "network": "0x101.icon",
    "endpoint": "http://localhost:9180/api/v3/icon_dex",
    "keystore": "./icon1/keystore.json",
    "keypass": "icon_local1",
    "type": "icon-btpblock-java"
  }
}
```

2. Add contract for xcall multi as submodule.
```
 git submodule add https://github.com/icon-project/xcall-multi.git ${PROJECT_ROOT}/xcall-multi
```

### Contract build
1. [javascore / Solidity contract build](./README.md#build)

2. xCall multi build
> **Warning**
> The service name registered in BMC only supports alphanumeric characters, so you need to change the CallService name. 
> In the example, installation was performed by changing ‘xcall-multi’ to ‘xcallM’.
> Path : ${PROJECT_ROOT}/xcall-multi/contracts/javascore/xcall-lib/src/main/java/foundation/icon/xcall/CallService.java
```
 cd ${PROJECT_ROOT}/xcall-multi
 make optimize-jar
```

### Deploy
#### BMC Deploy
[BMC Deploy](./README.md#bmc-deploy)

#### Open BTP Network
[Open BTP Network](./README.md#open-btp-network)

#### BMV Deploy
[BMV Deploy](./README.md#bmv-deploy)

#### xCall Multi Deploy
```
 make xcall-multi-deploy \
 srcNetworkPath=./SOURCE_NETWORK_CONFIG.json \
 jarPath=${PROJECT_ROOT}/xcall-multi/artifacts/icon/xcall-0.1.0-optimized.jar
```

#### xCall Multi DApp(simple DApp) Deploy
```
 make xcall-multi-dapp-deploy \ 
 srcNetworkPath=./SOURCE_NETWORK_CONFIG.json \
 jarPath=${PROJECT_ROOT}/xcall-multi/artifacts/icon/dapp-simple-0.1.0-optimized.jar
```
### Management

#### Add Service
The service name to register with BMC used the changed 'xcallM'.
[Add Service](./doc/network_management.md#add-service)
```
 make icon-manager-service \
 srcNetworkPath=./SOURCE_NETWORK_CONFIG.json \
 service=xcallM \
 address=${XCALL_MULTI_CONTRACT_ADDRESS} \
 method=add
```

#### xCall multi setConnection
```
 make xcall-multi-set-connection \
 srcNetworkPath=./SOURCE_NETWORK_CONFIG.json \
 dstNetworkPath=./DESTINATION_NETWORK_CONFIG.json
```
