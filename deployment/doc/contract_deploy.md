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
dstNetworkPath=./ETH_NETWORK_CONFIG.json
```

> **Note**
> When the BMV Type of the destination network is ‘btpblock’ [[Support Type]](./network_config.md#support-type)
> ```
> make icon-deploy-bmv \
> srcNetworkPath=./ICON_NETWORK_CONFIG.json \
> dstNetworkPath=./ICON2_BTPBLOCK_NETWORK_CONFIG.json \
> dstNetworkId=0x1 \
> dstNetworkTypeId=0x1
> ```

* ETH

```
make eth-deploy-bmv \
srcNetworkPath=./ETH_NETWORK_CONFIG.json \
dstNetworkPath=./ICON_NETWORK_CONFIG.json \
dstNetworkId=0x1 \
dstNetworkTypeId=0x1
```

> **Note**
> When the BMV Type of the destination network is ‘bridge’ [[Support Type]](./network_config.md#support-type)
> ```
> make icon-deploy-bmv \
> srcNetworkPath=./ETH_NETWORK_CONFIG.json \
> dstNetworkPath=./ICON_BRIDGE_NETWORK_CONFIG.json
> ```

#### Environment

| Name             | Type        | Description                                                          |
|:-----------------|:------------|:---------------------------------------------------------------------|
| srcNetworkPath   | String      | Source Network Configuration file path                               |
| dstNetworkPath   | String      | Destination Network Configuration file path                          |
| dstNetworkTypeId | Hexadecimal | Opened BTPNetworkTypeID of source network in the destination network |
| dstNetworkId     | Hexadecimal | Opened BTPNetworkID of source network in the destination network     |

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