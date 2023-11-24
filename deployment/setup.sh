#Deploy BMC
make icon-deploy-bmc srcNetworkPath=./docker/deployment_config/local_icon0.json
make icon-deploy-bmc srcNetworkPath=./docker/deployment_config/local_icon1.json
make eth-deploy-bmc srcNetworkPath=./docker/deployment_config/local_hardhat.json

#OpenBTPNetwork
make icon-manager-open-btp srcNetworkPath=./docker/deployment_config/local_icon1.json networkName=icon0_v1
make icon-manager-open-btp srcNetworkPath=./docker/deployment_config/local_icon0.json networkName=icon1_v1
make icon-manager-open-btp srcNetworkPath=./docker/deployment_config/local_icon0.json networkName=hardhat_v1

#BMV Deploy
make icon-deploy-bmv srcNetworkPath=./docker/deployment_config/local_icon1.json dstNetworkPath=./docker/deployment_config/local_icon0.json dstNetworkId=0x1 dstNetworkTypeId=0x1
make icon-deploy-bmv srcNetworkPath=./docker/deployment_config/local_icon0.json dstNetworkPath=./docker/deployment_config/local_icon1.json dstNetworkId=0x1 dstNetworkTypeId=0x1
make icon-deploy-bmv srcNetworkPath=./docker/deployment_config/local_icon0.json dstNetworkPath=./docker/deployment_config/local_hardhat.json
make eth-deploy-bmv srcNetworkPath=./docker/deployment_config/local_hardhat.json dstNetworkPath=./docker/deployment_config/local_icon0.json dstNetworkId=0x2 dstNetworkTypeId=0x1

#Add Link
make icon-manager-link srcNetworkPath=./docker/deployment_config/local_icon1.json dstNetworkPath=./docker/deployment_config/local_icon0.json srcNetworkId=0x1 method=add
make icon-manager-link srcNetworkPath=./docker/deployment_config/local_icon0.json dstNetworkPath=./docker/deployment_config/local_icon1.json srcNetworkId=0x1 method=add
make icon-manager-link srcNetworkPath=./docker/deployment_config/local_icon0.json dstNetworkPath=./docker/deployment_config/local_hardhat.json srcNetworkId=0x2 method=add
make eth-manager-link srcNetworkPath=./docker/deployment_config/local_hardhat.json dstNetworkPath=./docker/deployment_config/local_icon0.json method=add

#Xcall Deploy
make icon-deploy-xcall srcNetworkPath=./docker/deployment_config/local_icon1.json
make icon-deploy-xcall srcNetworkPath=./docker/deployment_config/local_icon0.json
make eth-deploy-xcall srcNetworkPath=./docker/deployment_config/local_hardhat.json


#Dapp Deploy
make icon-deploy-dapp srcNetworkPath=./docker/deployment_config/local_icon1.json
make icon-deploy-dapp srcNetworkPath=./docker/deployment_config/local_icon0.json
make eth-deploy-dapp srcNetworkPath=./docker/deployment_config/local_hardhat.json

#Add Relay
make icon-manager-relay srcNetworkPath=./docker/deployment_config/local_icon1.json dstNetworkPath=./docker/deployment_config/local_icon0.json address=hxb6b5791be0b5ef67063b3c10b840fb81514db2fd method=add
make icon-manager-relay srcNetworkPath=./docker/deployment_config/local_icon0.json dstNetworkPath=./docker/deployment_config/local_icon1.json address=hxb6b5791be0b5ef67063b3c10b840fb81514db2fd method=add
make icon-manager-relay srcNetworkPath=./docker/deployment_config/local_icon0.json dstNetworkPath=./docker/deployment_config/local_hardhat.json address=hxb6b5791be0b5ef67063b3c10b840fb81514db2fd method=add
make eth-manager-relay srcNetworkPath=./docker/deployment_config/local_hardhat.json dstNetworkPath=./docker/deployment_config/local_icon0.json address=f39fd6e51aad88f6f4ce6ab8827279cfffb92266 method=add
