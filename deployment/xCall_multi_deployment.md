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

### Tutorial
#### BMC Deploy
[BMC Deploy](./README.md#bmc-deploy)
* Source Network
```
 make icon-deploy-bmc srcNetworkPath=./SOURCE_NETWORK_CONFIG.json
```
* Destination Network
```
 make icon-deploy-bmc srcNetworkPath=./DESTINATION_NETWORK_CONFIG.json
```

#### Open BTP Network
[Open BTP Network](./README.md#open-btp-network)

Example for Tutorial
* Opened BTPNetworkID of destination network in the source network
```json
{
  "networkID": "0x3",
  "networkName": "destination_network",
  "networkTypeID": "0x1",
  "networkTypeName": "eth",
  "open": "0x1",
  ...
}
```

* Opened BTPNetworkID of source network in the destination network
```json
{
  "networkID": "0x2",
  "networkName": "source_network",
  "networkTypeID": "0x1",
  "networkTypeName": "eth",
  "open": "0x1",
  ...
}
```

#### BMV Deploy
[BMV Deploy](./README.md#bmv-deploy)
* Source Network
```
make icon-deploy-bmv \
srcNetworkPath=./SOURCE_NETWORK_CONFIG.json \
dstNetworkPath=./DESTINATION_NETWORK_CONFIG.json \
dstNetworkId=0x2 \
dstNetworkTypeId=0x1
```
* Destination Network
```
make icon-deploy-bmv \
srcNetworkPath=./DESTINATION_NETWORK_CONFIG.json \
dstNetworkPath=./SOURCE_NETWORK_CONFIG.json \
dstNetworkId=0x3 \
dstNetworkTypeId=0x1
```

> **Warning**
> Executing the 'Add Link' command must be done after deploying the BMV on both networks.

#### Add Link
[Add Link](./README.md#add-link)
* Source Network
```
make icon-manager-link \ 
srcNetworkPath=./SOURCE_NETWORK_CONFIG.json \
dstNetworkPath=./DESTINATION_NETWORK_CONFIG.json \
srcNetworkId=0x3 \
method=add
```
* Destination Network
```
make icon-manager-link \ 
srcNetworkPath=./DESTINATION_NETWORK_CONFIG.json \
dstNetworkPath=./SOURCE_NETWORK_CONFIG.json \
srcNetworkId=0x2 \
method=add
```

#### xCall Multi Deploy
* Source Network
```
 make xcall-multi-deploy \
 srcNetworkPath=./SOURCE_NETWORK_CONFIG.json \
 jarPath=${PROJECT_ROOT}/xcall-multi/artifacts/icon/xcall-0.1.0-optimized.jar
```
* Destination Network
```
 make xcall-multi-deploy \
 srcNetworkPath=./DESTINATION_NETWORK_CONFIG.json \
 jarPath=${PROJECT_ROOT}/xcall-multi/artifacts/icon/xcall-0.1.0-optimized.jar
```

#### xCall Multi DApp( Simple DApp) Deploy
* Source Network
```
 make xcall-multi-dapp-deploy \ 
 srcNetworkPath=./SOURCE_NETWORK_CONFIG.json \
 jarPath=${PROJECT_ROOT}/xcall-multi/artifacts/icon/dapp-simple-0.1.0-optimized.jar
```
* Destination Network
```
 make xcall-multi-dapp-deploy \ 
 srcNetworkPath=./DESTINATION_NETWORK_CONFIG.json \
 jarPath=${PROJECT_ROOT}/xcall-multi/artifacts/icon/dapp-simple-0.1.0-optimized.jar
```


#### Add Service
The service name to register with BMC used the changed 'xcallM'.
[Add Service](./doc/network_management.md#add-service)
* Source Network
```
 make icon-manager-service \
 srcNetworkPath=./SOURCE_NETWORK_CONFIG.json \
 service=xcallM \
 address=${XCALL_MULTI_CONTRACT_ADDRESS} \
 method=add
```
* Destination Network
```
 make icon-manager-service \
 srcNetworkPath=./DESTINATION_NETWORK_CONFIG.json \
 service=xcallM \
 address=${XCALL_MULTI_CONTRACT_ADDRESS} \
 method=add
```


#### xCall multi setConnection
* Source Network
```
 make xcall-multi-set-connection \
 srcNetworkPath=./SOURCE_NETWORK_CONFIG.json \
 dstNetworkPath=./DESTINATION_NETWORK_CONFIG.json
```
* Destination Network
```
 make xcall-multi-set-connection \
 srcNetworkPath=./DESTINATION_NETWORK_CONFIG.json \
 dstNetworkPath=./SOURCE_NETWORK_CONFIG.json
```

#### Add Relay
[Add Relay](./README.md#add-relay)
* Source Network
```
 make icon-manager-relay \
 srcNetworkPath=./SOURCE_NETWORK_CONFIG.json \
 dstNetworkPath=./DESTINATION_NETWORK_CONFIG.json \
 address=${RELAY_ACCOUNT_ADDRESS} \
 method=add
```
* Destination Network
```
 make icon-manager-relay \
 srcNetworkPath=./DESTINATION_NETWORK_CONFIG.json \
 dstNetworkPath=./SOURCE_NETWORK_CONFIG.json \
 address=${RELAY_ACCOUNT_ADDRESS} \
 method=add
```