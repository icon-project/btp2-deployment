# Network Management

## Introduction

BTP2 Network Management CLI

### Get Reward

[IIP - Get Reward](https://github.com/icon-project/IIPs/blob/master/IIPS/iip-25.md#getreward)

* ICON

```
make icon-manager-reward \
srcNetworkPath=./ICON_NETWORK_CONFIG.json \
dstNetworkPath=./ETH_NETWORK_CONFIG.json \
method=get
```

* ETH

```
make eth-manager-reward \
srcNetworkPath=./ETH_NETWORK_CONFIG.json \
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
dstNetworkPath=./ETH_NETWORK_CONFIG.json \
address=0x123... \
method=claim
```

* ETH

```
make eth-manager-reward \
srcNetworkPath=./ETH_NETWORK_CONFIG.json \
dstNetworkPath=./ICON_NETWORK_CONFIG.json \
address=hx1234... \
method=claim
```

#### Environment

| Name           | Type   | Description                                 |
|:---------------|:-------|:--------------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path      |
| dstNetworkPath | String | Destination Network Configuration file path |
| address        | String | Account address                             |
| method         | String | method                                      |

### Get Links

[IIP - Get Links](https://github.com/icon-project/IIPs/blob/master/IIPS/iip-25.md#getlinks)

* ICON

```
make icon-manager-link \
srcNetworkPath=./ICON_NETWORK_CONFIG.json
method=get
```

* ETH

```
make eth-manager-link \
srcNetworkPath=./ETH_NETWORK_CONFIG.json
method=get
```

#### Environment

| Name           | Type   | Description                                 |
|:---------------|:-------|:--------------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path      |
| dstNetworkPath | String | Destination Network Configuration file path |
| method         | String | method                                      |                                      

### Add Link

[IIP - Add Link](https://github.com/icon-project/IIPs/blob/master/IIPS/iip-25.md#addlink)

* ICON

```
make icon-manager-link \
srcNetworkPath=./ICON_NETWORK_CONFIG.json \
dstNetworkPath=./ETH_NETWORK_CONFIG.json \
srcNetworkId=0x1 \
method=add
```

* ETH

```
make eth-manager-link \
srcNetworkPath=./ETH_NETWORK_CONFIG.json \
dstNetworkPath=./ICON_NETWORK_CONFIG.json \
method=add
```

#### Environment

| Name           | Type        | Description                                                      |
|:---------------|:------------|:-----------------------------------------------------------------|
| srcNetworkPath | String      | Source Network Configuration file path                           |
| dstNetworkPath | String      | Destination Network Configuration file path                      |
| srcNetworkId   | Hexadecimal | Opened BTPNetworkID of destination network in the source network |
| method         | String      | method                                                           |

### Remove Link

[IIP - Remove Link](https://github.com/icon-project/IIPs/blob/master/IIPS/iip-25.md#removelink)

* ICON

```
make icon-manager-link \
srcNetworkPath=./ICON_NETWORK_CONFIG.json \
dstNetworkPath=./ETH_NETWORK_CONFIG.json \
method=remove
```

* ETH

```
make eth-manager-reward \
srcNetworkPath=./ETH_NETWORK_CONFIG.json \
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
dstNetworkPath=./ETH_NETWORK_CONFIG.json \
```

* ETH

```
make eth-manager-getStatus \
srcNetworkPath=./ETH_NETWORK_CONFIG.json \
dstNetworkPath=./ICON_NETWORK_CONFIG.json \
```

#### Environment

| Name           | Type   | Description                                 |
|:---------------|:-------|:--------------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path      |
| dstNetworkPath | String | Destination Network Configuration file path |

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
srcNetworkPath=./ETH_NETWORK_CONFIG.json \
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
srcNetworkPath=./ETH_NETWORK_CONFIG.json \
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
srcNetworkPath=./ETH_NETWORK_CONFIG.json \
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

Get network id of the BTPLink
> 0: Normal<br/>
> 1: Maintenance

* ICON

```
make icon-manager-mode \
srcNetworkPath=./ICON_NETWORK_CONFIG.json \
method=get
```

* ETH

```
make eth-manager-mode \
srcNetworkPath=./ETH_NETWORK_CONFIG.json \
method=get
```

#### Environment

| Name           | Type   | Description                            |
|:---------------|:-------|:---------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path |
| method         | String | method                                 |

### Set Mode

Called by the operator to manage the BTPNetwork.

* ICON

```
make icon-manager-mode \
srcNetworkPath=./ICON_NETWORK_CONFIG.json \
method=set
```

* ETH

```
make eth-manager-mode \
srcNetworkPath=./ETH_NETWORK_CONFIG.json \
method=set
```

#### Environment

| Name           | Type   | Description                            |
|:---------------|:-------|:---------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path |
| method         | String | method                                 |

### Get Verifiers

Get registered verifiers.

* ICON

```
make icon-manager-verifier \
srcNetworkPath=./ICON_NETWORK_CONFIG.json
method=get
```

* ETH

```
make eth-manager-verifier \
srcNetworkPath=./ETH_NETWORK_CONFIG.json
method=get
```

#### Environment

| Name           | Type   | Description                            |
|:---------------|:-------|:---------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path |
| method         | String | method                                 |

### Add Verifier

Registers BMV for the network

* ICON

```
make icon-manager-verifier \
srcNetworkPath=./ICON_NETWORK_CONFIG.json \
dstNetworkPath=./ETH_NETWORK_CONFIG.json \
method=add
```

* ETH

```
make eth-manager-verifier \
srcNetworkPath=./ETH_NETWORK_CONFIG.json \
dstNetworkPath=./ICON_NETWORK_CONFIG.json \
method=add
```

#### Environment

| Name           | Type   | Description                                 |
|:---------------|:-------|:--------------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path      |
| dstNetworkPath | String | Destination Network Configuration file path |
| method         | String | method                                      |

### Remove Verifier

Unregisters BMV for the network.

* ICON

```
make icon-manager-verifier \
srcNetworkPath=./ICON_NETWORK_CONFIG.json \
dstNetworkPath=./ETH_NETWORK_CONFIG.json \
method=remove
```

* ETH

```
make eth-manager-verifier \
srcNetworkPath=./ETH_NETWORK_CONFIG.json \
dstNetworkPath=./ICON_NETWORK_CONFIG.json \
method=remove
```

#### Environment

| Name           | Type   | Description                                 |
|:---------------|:-------|:--------------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path      |
| dstNetworkPath | String | Destination Network Configuration file path |
| method         | String | method                                      |

### Get Relays

Get status of registered relays by link

* ICON

```
make icon-manager-relay \
srcNetworkPath=./ICON_NETWORK_CONFIG.json \
dstNetworkPath=./ETH_NETWORK_CONFIG.json \
method=get
```

* ETH

```
make eth-manager-relay \
srcNetworkPath=./ETH_NETWORK_CONFIG.json \
dstNetworkPath=./ICON_NETWORK_CONFIG.json \
method=set
```

#### Environment

| Name           | Type   | Description                                 |
|:---------------|:-------|:--------------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path      |
| dstNetworkPath | String | Destination Network Configuration file path |
| method         | String | method                                      |

### Add Relay

Registers relay for the network.

* ICON

```
make icon-manager-relay \
srcNetworkPath=./ICON_NETWORK_CONFIG.json \
dstNetworkPath=./ETH_NETWORK_CONFIG.json \
address=hx1234... \
method=add
```

* ETH

```
make eth-manager-relay \
srcNetworkPath=./ETH_NETWORK_CONFIG.json \
dstNetworkPath=./ICON_NETWORK_CONFIG.json \
address=1234...
method=add
```

#### Environment

| Name           | Type   | Description                                 |
|:---------------|:-------|:--------------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path      |
| dstNetworkPath | String | Destination Network Configuration file path |
| address        | String | Relay account address                       |
| method         | String | method                                      |

### Remove Relay

Unregisters relay for the network.

* ICON

```
make icon-manager-relay \
srcNetworkPath=./ICON_NETWORK_CONFIG.json \
dstNetworkPath=./ETH_NETWORK_CONFIG.json \
address=hx1234... \
method=remove
```

* ETH

```
make eth-manager-relay \
srcNetworkPath=./ETH_NETWORK_CONFIG.json \
dstNetworkPath=./ICON_NETWORK_CONFIG.json \
address=abcd...
method=remove
```

#### Environment

| Name           | Type   | Description                                 |
|:---------------|:-------|:--------------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path      |
| dstNetworkPath | String | Destination Network Configuration file path |
| address        | String | Relay account address                       |
| method         | String | method                                      |

### Get Fee Table
Gets fee table of a network

* ICON

```
make icon-manager-feeTable \
srcNetworkPath=./ICON_NETWORK_CONFIG.json \
dstNetworkPath=./ETH_NETWORK_CONFIG.json \
method=get
```

* ETH

```
make eth-manager-feeTable \
srcNetworkPath=./ETH_NETWORK_CONFIG.json \
dstNetworkPath=./ICON_NETWORK_CONFIG.json \
method=set
```

#### Environment

| Name           | Type   | Description                                 |
|:---------------|:-------|:--------------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path      |
| dstNetworkPath | String | Destination Network Configuration file path |
| method         | String | method                                      |


### Set Fee Table
Sets fee table of dst on src chain

* ICON

```
make icon-manager-feeTable \
srcNetworkPath=./ICON_NETWORK_CONFIG.json \
dstNetworkPath=./ETH_NETWORK_CONFIG.json \
method=set \
feeTable="[0x1234...,0x12345...]"
```

* ETH

```
make eth-manager-feeTable \
srcNetworkPath=./ETH_NETWORK_CONFIG.json \
dstNetworkPath=./ICON_NETWORK_CONFIG.json \
method=set \
feeTable="[0x1234...,0x12345...]"
```

#### Environment

| Name           | Type   | Description                                 |
|:---------------|:-------|:--------------------------------------------|
| srcNetworkPath | String | Source Network Configuration file path      |
| dstNetworkPath | String | Destination Network Configuration file path |
| method         | String | method                                      |
| feeTable       | String | Fee Table Array in string format            |