# Deploy contract

## Introduction
Contract deploy CLI

### BMC Deploy
* ICON

```
make icon-deploy-bmc srcNetworkPath=./ICON_NETWORK_CONFIG.json
```

* ETH

```
make eth-deploy-bmc srcNetworkPath=./ETH_NETWORK_CONFIG.json
```

#### Environment

| Name           | Type   | Description                            |
|:---------------|:-------|:---------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path |

### BMV Deploy
* ICON

```
make icon-deploy-bmv \
srcNetworkPath=./ICON_NETWORK_CONFIG.json \
dstNetworkPath=./ETH_NETWORK_CONFIG.json \
networkId=0x1 \
networkTypeId=0x1
```

* ETH

```
make eth-deploy-bmv \
srcNetworkPath=./ETH_NETWORK_CONFIG.json \
dstNetworkPath=./ICON_NETWORK_CONFIG.json \
networkId=0x1 \
networkTypeId=0x1
```

#### Environment

| Name           | Type        | Description                                 |
|:---------------|:------------|:--------------------------------------------|
| srcNetworkPath | String      | Source Network Configuration file path      |
| dstNetworkPath | String      | Destination Network Configuration file path |
| networkTypeId  | Hexadecimal | Network type ID                             |
| networkId      | Hexadecimal | Network ID                                  |


### XCALL Deploy
* ICON

```
make icon-deploy-xcall srcNetworkPath=./ICON_NETWORK_CONFIG.json
```

* ETH

```
make eth-deploy-xcall srcNetworkPath=./ETH_NETWORK_CONFIG.json
```

#### Environment

| Name           | Type   | Description                            |
|:---------------|:-------|:---------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path |

### DAPP Deploy

* ICON

```
make icon-deploy-dapp srcNetworkPath=./ICON_NETWORK_CONFIG.json
```

* ETH

```
make eth-deploy-dapp srcNetworkPath=./ETH_NETWORK_CONFIG.json
```

#### Environment

| Name           | Type   | Description                            |
|:---------------|:-------|:---------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path |