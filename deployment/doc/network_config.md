# Network configuration

## Introduction

This document specifies the network configuration file format.

## Configuration

### Chain

Network information required to configure the BTP2 network

* ICON example

```json
{
  "chain": {
    "id": "berlin",
    "network": "0x7.icon",
    "endpoint": "https://berlin.net.solidwallet.io/api/v3/icon_dex",
    "keystore": "./chains/keystore/berlin/keystore.json",
    "keypass": "",
    "type": "icon-btpblock-java"
  }
}
```

* ETH example

```json
{
  "chain": {
    "id": "bsc",
    "network": "0x61.bsc",
    "endpoint": "https://data-seed-prebsc-2-s1.bnbchain.org:8545",
    "hardhatNetwork": "bsc_testnet",
    "type": "bsc-hertz-solidity"
  }
}
```

| Key            | Description                                            | Require   |
|:---------------|:-------------------------------------------------------|:----------|
| id             | Chain network ID                                       | ALL       |
| network        | Network address (nid.network)                          | ALL       |
| endpoint       | Network endpoint                                       | ALL       |
| keystore       | Deployer keystore                                      | ICON ONLY |
| keypass        | Deployer keystore password                             | ICON ONLY |
| hardhatNetwork | NetworkName in the hardhat configuration network field | ETH ONLY  |
| type           | BTP2 contract type                                     | ALL       |

#### Support type
{`Network Type`}-{`BMV Type`}-{`Network language Type`}
* ICON
    * icon-btpblock-java
    * icon-bridge-java
* BSC
    * bsc-hertz-solidity
    * bsc-bridge-solidity
* Sepolia
    * eth2-v2.0-solidity
    * eth2-bridge-solidity

### Contracts

When deploying a contract, it is added to the network configuration file.

```json
{
  "contracts": {
    "bmc": "cxf1b0808f09138fffdb890772315aeabb37072a8a",
    "bmv": {
      "sepolia": {
        "type": "eth2-v2.0-solidity",
        "address": "cxdd91f194673553097745f33dd464a39740075735"
      },
      "bsc": {
        "type": "bsc-hertz-solidity",
        "address": "cxd9c67ab9ff545d0c9c0420ae24757472de070819"
      },
      "havah": {
        "type": "icon-btpblock-java",
        "address": "cx90b6dca89aa45388b24a6c158eb9d21d51263037"
      }
    },
    "xcall": "cxf4958b242a264fc11d7d8d95f79035e35b21c1bb",
    "dapp": "cx92283a47a95164bd3d604da08128886125593545"
  }
}
```

### Links

When connected between networks, it is added to the network configuration file.

```json
{
  "links": {
    "sepolia": {
      "network": "0xaa36a7.eth2",
      "networkId": "0x6",
      "bmc": "0xE602326106f5E1d436a3CCEB2A408759925f81ff"
    },
    "bsc": {
      "network": "0x61.bsc",
      "networkId": "0x4",
      "bmc": "0x9Fd9e050682A8795dEa6eE70870A82a513d390Ac"
    },
    "havah": {
      "network": "0x61.bsc",
      "networkId": "0x7",
      "bmc": "cxf36efc770627067c41949a16688a0246ea6428e8"
    }
  }
}
```

## Network confing example

```json
{
  "chain": {
    "id": "berlin",
    "network": "0x7.icon",
    "endpoint": "https://berlin.net.solidwallet.io/api/v3/icon_dex",
    "keystore": "./chains/keystore/berlin/keystore.json",
    "keypass": "",
    "type": "icon-btpblock-java"
  },
  "contracts": {
    "bmc": "cxf1b0808f09138fffdb890772315aeabb37072a8a",
    "bmv": {
      "sepolia": {
        "type": "eth2-v2.0-solidity",
        "address": "cxdd91f194673553097745f33dd464a39740075735"
      },
      "bsc": {
        "type": "bsc-hertz-solidity",
        "address": "cxd9c67ab9ff545d0c9c0420ae24757472de070819"
      },
      "havah": {
        "type": "icon-btpblock-java",
        "address": "cx90b6dca89aa45388b24a6c158eb9d21d51263037"
      }
    },
    "xcall": "cxf4958b242a264fc11d7d8d95f79035e35b21c1bb",
    "dapp": "cx92283a47a95164bd3d604da08128886125593545"
  },
  "links": {
    "sepolia": {
      "network": "0xaa36a7.eth2",
      "networkId": "0x6",
      "bmc": "0xE602326106f5E1d436a3CCEB2A408759925f81ff"
    },
    "bsc": {
      "network": "0x61.bsc",
      "networkId": "0x4",
      "bmc": "0x9Fd9e050682A8795dEa6eE70870A82a513d390Ac"
    },
    "havah": {
      "network": "0x61.bsc",
      "networkId": "0x7",
      "bmc": "cxf36efc770627067c41949a16688a0246ea6428e8"
    }
  }
}
```

