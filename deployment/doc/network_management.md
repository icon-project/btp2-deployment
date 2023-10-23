# Network Management

## Introduction

BTP2 Network Management CLI

### Get Reward

[IIP - Get Reward](https://github.com/icon-project/IIPs/blob/master/IIPS/iip-25.md#getreward)

* ICON

```
make icon-manager-reward \
srcNetworkPath=./ICON_NETWORK_CONFIG.json \
dstNetworkPath=./BSC_NETWORK_CONFIG.json \
method=get
```

* ETH

```
make eth-manager-reward \
srcNetworkPath=./BSC_NETWORK_CONFIG.json \
dstNetworkPath=./ICON_NETWORK_CONFIG.json \
method=get
```

#### Environment

| Name           | Type   | Description                                 |
|:---------------|:-------|:--------------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path      |
| dstNetworkPath | String | Destination Network Configuration file path |
| method         | String | method                                      |

### Claim Reward

[IIP - Claim Reward](https://github.com/icon-project/IIPs/blob/master/IIPS/iip-25.md#claimreward)

* ICON

```
make icon-manager-reward \
srcNetworkPath=./ICON_NETWORK_CONFIG.json \
dstNetworkPath=./BSC_NETWORK_CONFIG.json \
address=0x123... \
method=claim
```

* ETH

```
make eth-manager-reward \
srcNetworkPath=./BSC_NETWORK_CONFIG.json \
dstNetworkPath=./ICON_NETWORK_CONFIG.json \
address=hx123... \
method=claim
```

#### Environment

| Name           | Type   | Description                                 |
|:---------------|:-------|:--------------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path      |
| dstNetworkPath | String | Destination Network Configuration file path |
| address        | String | Account address                             |
| method         | String | method                                      |

### Add Link

[IIP - Add Link](https://github.com/icon-project/IIPs/blob/master/IIPS/iip-25.md#addlink)

* ICON

```
make icon-manager-link \
srcNetworkPath=./ICON_NETWORK_CONFIG.json \
dstNetworkPath=./BSC_NETWORK_CONFIG.json \
networkId=0x1 \
method=add
```

* ETH

```
make eth-manager-reward \
srcNetworkPath=./BSC_NETWORK_CONFIG.json \
dstNetworkPath=./ICON_NETWORK_CONFIG.json \
method=add
```

#### Environment

| Name           | Type        | Description                                 |
|:---------------|:------------|:--------------------------------------------|
| srcNetworkPath | String      | Source Network Configuration file path      |
| dstNetworkPath | String      | Destination Network Configuration file path |
| networkId      | Hexadecimal | BTP2 Network ID                             |
| method         | String      | method                                      |

### Remove Link

[IIP - Remove Link](https://github.com/icon-project/IIPs/blob/master/IIPS/iip-25.md#removelink)

* ICON

```
make icon-manager-link \
srcNetworkPath=./ICON_NETWORK_CONFIG.json \
dstNetworkPath=./BSC_NETWORK_CONFIG.json \
method=remove
```

* ETH

```
make eth-manager-reward \
srcNetworkPath=./BSC_NETWORK_CONFIG.json \
dstNetworkPath=./ICON_NETWORK_CONFIG.json \
method=remove
```

#### Environment

| Name           | Type   | Description                                 |
|:---------------|:-------|:--------------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path      |
| dstNetworkPath | String | Destination Network Configuration file path |
| method         | String | method                                      |

### Get Status

[IIP - Get Status](https://github.com/icon-project/IIPs/blob/master/IIPS/iip-25.md#getstatus)

* ICON

```
make icon-manager-getStatus \
srcNetworkPath=./ICON_NETWORK_CONFIG.json \
dstNetworkPath=./BSC_NETWORK_CONFIG.json \
method=set
```

* ETH

```
make eth-manager-getStatus \
srcNetworkPath=./BSC_NETWORK_CONFIG.json \
dstNetworkPath=./ICON_NETWORK_CONFIG.json \
method=set
```

#### Environment

| Name           | Type   | Description                                 |
|:---------------|:-------|:--------------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path      |
| dstNetworkPath | String | Destination Network Configuration file path |
| method         | String | method                                      |

### Get Services

[IIP - Get Services](https://github.com/icon-project/IIPs/blob/master/IIPS/iip-25.md#getservices)

* ICON

```
make icon-manager-service \
srcNetworkPath=./ICON_NETWORK_CONFIG.json \
method=get
```

* ETH

```
make eth-manager-service \
srcNetworkPath=./BSC_NETWORK_CONFIG.json \
method=get
```

#### Environment

| Name           | Type   | Description                            |
|:---------------|:-------|:---------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path |
| method         | String | method                                 |

### Add Service

[IIP - Add Services](https://github.com/icon-project/IIPs/blob/master/IIPS/iip-25.md#addservice)

* ICON

```
make icon-manager-service \
srcNetworkPath=./ICON_NETWORK_CONFIG.json \
service=service_name \
addresss=cxabcd... \
method=add
```

* ETH

```
make eth-manager-service \
srcNetworkPath=./BSC_NETWORK_CONFIG.json \
service=service_name \
addresss=0xabcd... \
method=add
```

#### Environment

| Name           | Type   | Description                            |
|:---------------|:-------|:---------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path |
| service        | String | Service Name                           |
| address        | String | Service contract address               |
| method         | String | method                                 |

### Remove Service

[IIP - Remove Services](https://github.com/icon-project/IIPs/blob/master/IIPS/iip-25.md#removeservice)

* ICON

```
make icon-manager-service \
srcNetworkPath=./ICON_NETWORK_CONFIG.json \
service=service_name \
method=remove
```

* ETH

```
make eth-manager-service \
srcNetworkPath=./BSC_NETWORK_CONFIG.json \
service=service_name \
method=remove
```

#### Environment

| Name           | Type   | Description                            |
|:---------------|:-------|:---------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path |
| service        | String | Service Name                           |
| method         | String | method                                 |

### Get Mode

* ICON

```
make icon-manager-mode \
srcNetworkPath=./ICON_NETWORK_CONFIG.json \
method=get
```

* ETH

```
make eth-manager-mode \
srcNetworkPath=./BSC_NETWORK_CONFIG.json \
method=get
```

#### Environment

| Name           | Type   | Description                            |
|:---------------|:-------|:---------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path |
| method         | String | method                                 |

### Set Mode

* ICON

```
make icon-manager-mode \
srcNetworkPath=./ICON_NETWORK_CONFIG.json \
method=set
```

* ETH

```
make eth-manager-mode \
srcNetworkPath=./BSC_NETWORK_CONFIG.json \
method=set
```

#### Environment

| Name           | Type   | Description                            |
|:---------------|:-------|:---------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path |
| method         | String | method                                 |
