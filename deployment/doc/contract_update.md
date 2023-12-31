# Update contract

## Introduction
Contract update CLI
> **Note**
> Contracts other than BMV will be updated to change the contract, 
> and BMV will distribute and replace new BMV.

### BMC Update
* ICON

```
make icon-update-bmc srcNetworkPath=./ICON_NETWORK_CONFIG.json
```

* ETH

```
make eth-update-bmc srcNetworkPath=./ETH_NETWORK_CONFIG.json
```

#### Environment

| Name           | Type   | Description                            |
|:---------------|:-------|:---------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path |

### BMV Update

* ICON

```
make icon-update-bmv \
srcNetworkPath=./ICON_NETWORK_CONFIG.json \
dstNetworkPath=./ETH_NETWORK_CONFIG.json \
```

* ETH

```
make eth-update-bmv \ 
srcNetworkPath=./ETH_NETWORK_CONFIG.json \
dstNetworkPath=./ICON_NETWORK_CONFIG.json \
networkTypeId=./ICON_NETWORK_CONFIG.json \
networkId=./ICON_NETWORK_CONFIG.json
```

#### Environment

| Name           | Type        | Description                                 |
|:---------------|:------------|:--------------------------------------------|
| srcNetworkPath | String      | Source Network Configuration file path      |
| dstNetworkPath | String      | Destination Network Configuration file path |
| networkTypeId  | Hexadecimal | Network type ID                             |
| networkId      | Hexadecimal | BTP2 Network ID                             |
| height         | Hexadecimal | Source Network Configuration file path      |


### XCALL Update

* ICON

```
make icon-update-xcall srcNetworkPath=./ICON_NETWORK_CONFIG.json
```

* ETH

```
make eth-update-xcall srcNetworkPath=./ETH_NETWORK_CONFIG.json
```

#### Environment

| Name           | Type   | Description                            |
|:---------------|:-------|:---------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path |

### DAPP Update

* ICON

```
make icon-update-dapp srcNetworkPath=./ICON_NETWORK_CONFIG.json
```

* ETH

```
make eth-update-dapp srcNetworkPath=./ETH_NETWORK_CONFIG.json
```

#### Environment

| Name           | Type   | Description                            |
|:---------------|:-------|:---------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path |