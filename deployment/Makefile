PWD = $(abspath ./)

export JAVASCORE_PATH = $(PWD)/../javascore
export BMV_INIT_DATA_PATH= $(PWD)/bmv_init_data.json
export BTP_BLOCK_HEADER_PATH= $(PWD)/btp_bmv_update_param.json
ETH2_BEACON_NODE_ENDPOINT=http://35.73.133.230:9596
GRADLE = ./gradlew


HARDHAT = npx hardhat
TS_NODE = npx ts-node

SOLIDITY_CONTRACTS = ./solidity/contracts

.DEFAULT_GOAL := all
all:
	@echo $(PWD)

args = `arg="$(filter-out $@,$(MAKECMDGOALS))" && echo $${arg:-${1}}`
test:
	@echo $(call args)


.PHONY: build clean deploy


clean-java:
	(cd $(JAVASCORE_PATH); $(GRADLE) clean)

clean-solidity:
	$(HARDHAT) clean
	$(RM) -rf \
	    $(SOLIDITY_CONTRACTS)/bmc \
	    $(SOLIDITY_CONTRACTS)/bmv* \
	    $(SOLIDITY_CONTRACTS)/xcall

clean: clean-java clean-solidity

copy-src:
	@ echo ">>> Copy BMC/BMV/xCall solidity codes" ; \
	$(TS_NODE) scripts/common/eth/copy_src.ts

compile: copy-src
	@ echo ">>> Compile solidity codes" ; \
	$(HARDHAT) compile

build-bmc-java:
	@ echo ">>> Build BMC javascore" ; \
	cd $(JAVASCORE_PATH) ; \
	$(GRADLE) bmc:optimizedJar

build-bmv-java:
	@ echo ">>> Build BMV javascore" ; \
	cd $(JAVASCORE_PATH) ; \
	$(GRADLE) bmv:bridge:optimizedJar \
		bmv:btpblock:optimizedJar \
		bmv:eth2:optimizedJar \
		bmv:bsc2:optimizedJar

build-xcall-java:
	@ echo ">>> Build xCall javascore" ; \
	cd $(JAVASCORE_PATH) ; \
	$(GRADLE) xcall:optimizedJar

build-dapp-java:
	@ echo ">>> Build DApp sample javascore" ; \
	cd $(JAVASCORE_PATH) ; \
	$(GRADLE) dapp-sample:optimizedJar

build-all: compile build-bmc-java build-bmv-java build-xcall-java build-dapp-java

eth-deploy-bmc:
	@ echo ">>> Deploy ETH BMC contracts" ; \
	srcNetworkPath=$(srcNetworkPath) $(HARDHAT) run scripts/eth/deploy/bmc.ts

eth-deploy-bmv:
	@ echo ">>> Deploy ETH BMC contracts" ; \
	srcNetworkPath=$(srcNetworkPath) \
	dstNetworkPath=$(dstNetworkPath) \
	networkTypeId=$(networkTypeId) \
	networkId=$(networkId) \
	$(HARDHAT) run scripts/eth/deploy/bmv.ts

eth-deploy-xcall:
	@ echo ">>> Deploy ETH XCALL contracts" ; \
	srcNetworkPath=$(srcNetworkPath) $(HARDHAT) run scripts/eth/deploy/xcall.ts

eth-deploy-dapp:
	@ echo ">>> Deploy ETH DAPP contracts" ; \
	srcNetworkPath=$(srcNetworkPath) $(HARDHAT) run scripts/eth/deploy/dapp.ts

eth2-bmv-init:
	@ echo ">>> Generate initial data of Java BMV for Ethereum 2.0" ; \
	mkdir $(PWD)/bmvinit ; \
	cd $(PWD)/bmvinit ; \
	GOPATH=$(PWD)/bmvinit \
	go install github.com/icon-project/btp2-eth2@latest ; \
	cd ./pkg/mod/github.com/icon-project/btp2-eth2*/cmd/bmvinit ;\
	go run main.go gen --url $(ETH2_BEACON_NODE_ENDPOINT) --output $(BMV_INIT_DATA_PATH);\
	chmod -R 755 $(PWD)/bmvinit ; \
	rm -rf $(PWD)/bmvinit

eth-update-bmc:
	@ echo ">>> Update ETH BMC contracts" ; \
	srcNetworkPath=$(srcNetworkPath) $(HARDHAT) run scripts/eth/update/bmc.ts

eth-update-bmv:
	@ echo ">>> Update ETH BMV contracts" ; \
 	srcNetworkPath=$(srcNetworkPath) \
 	dstNetworkPath=$(dstNetworkPath) \
 	networkTypeId=$(networkTypeId) \
 	networkId=$(networkId) \
 	height=$(height) \
	$(HARDHAT) run scripts/eth/update/bmv.ts

eth-update-xcall:
	@ echo ">>> Update ETH XCALL contracts" ; \
	srcNetworkPath=$(srcNetworkPath) $(HARDHAT) run scripts/eth/update/xcall.ts

eth-update-dapp:
	@ echo ">>> Update ETH DAPP contracts" ; \
	srcNetworkPath=$(srcNetworkPath) $(HARDHAT) run scripts/eth/update/dapp.ts

eth-manager-reward:
	@ echo ">>> ETH ${method}Reward  " ; \
 	srcNetworkPath=$(srcNetworkPath) \
 	dstNetworkPath=$(dstNetworkPath) \
 	address=$(address) \
 	method=$(method) \
	$(HARDHAT) run scripts/eth/manager/reward.ts


eth-manager-link:
	@ echo ">>> ETH ${method}Link  " ; \
 	srcNetworkPath=$(srcNetworkPath) \
 	dstNetworkPath=$(dstNetworkPath) \
 	method=$(method) \
	$(HARDHAT) run scripts/eth/manager/link.ts

eth-manager-mode:
	@ echo ">>> ETH ${method}Mode  " ; \
 	srcNetworkPath=$(srcNetworkPath) \
 	method=$(method) \
 	signerIndex=$(signerIndex) \
	$(HARDHAT) run scripts/eth/manager/mode.ts

eth-manager-getStatus:
	@ echo ">>> ETH getStatus  " ; \
 	srcNetworkPath=$(srcNetworkPath) \
 	dstNetworkPath=$(dstNetworkPath) \
	$(HARDHAT) run scripts/eth/manager/status.ts

eth-manager-owner:
	@ echo ">>> ETH ${method}Owner  " ; \
 	srcNetworkPath=$(srcNetworkPath) \
 	method=$(method) \
 	address=$(address) \
 	signerIndex=$(signerIndex) \
	$(HARDHAT) run scripts/eth/manager/owner.ts

eth-manager-service:
	@ echo ">>> ETH ${method}service  " ; \
 	srcNetworkPath=$(srcNetworkPath) \
 	method=$(method) \
 	service=$(service) \
 	address=$(address) \
	$(HARDHAT) run scripts/eth/manager/service.ts

eth-manager-verifier:
	@ echo ">>> ETH ${method}Verifier  " ; \
 	srcNetworkPath=$(srcNetworkPath) \
 	dstNetworkPath=$(dstNetworkPath) \
 	method=$(method) \
	$(HARDHAT) run scripts/eth/manager/verifier.ts

#ICON
icon-deploy-bmc:
	@ echo ">>> Deploy ICON BMC contracts" ; \
	srcNetworkPath=$(srcNetworkPath) $(HARDHAT) run scripts/icon/deploy/bmc.ts

icon-deploy-bmv:
	@ echo ">>> Deploy ICON BMV contracts" ; \
	srcNetworkPath=$(srcNetworkPath) \
	dstNetworkPath=$(dstNetworkPath) \
	networkId=$(networkId) \
	$(HARDHAT) run scripts/icon/deploy/bmv.ts

icon-deploy-xcall:
	@ echo ">>> Deploy ICON XCALL contracts" ; \
	srcNetworkPath=$(srcNetworkPath) $(HARDHAT) run scripts/icon/deploy/xcall.ts

icon-deploy-dapp:
	@ echo ">>> Deploy ICON DAPP contracts" ; \
	srcNetworkPath=$(srcNetworkPath) $(HARDHAT) run scripts/icon/deploy/dapp.ts

icon-update-bmc:
	@ echo ">>> Update ICON BMC contracts" ; \
	srcNetworkPath=$(srcNetworkPath) $(HARDHAT) run scripts/icon/update/bmc.ts

icon-update-bmv:
	@ echo ">>> Update ICON BMV contracts" ; \
	srcNetworkPath=$(srcNetworkPath) \
    dstNetworkPath=$(dstNetworkPath) \
    $(HARDHAT) run scripts/icon/update/bmv.ts

icon-update-xcall:
	@ echo ">>> Update ICON XCALL contracts" ; \
	srcNetworkPath=$(srcNetworkPath) $(HARDHAT) run scripts/icon/update/xcall.ts

icon-update-dapp:
	@ echo ">>> Update ICON DAPP contracts" ; \
	srcNetworkPath=$(srcNetworkPath) $(HARDHAT) run scripts/icon/update/dapp.ts

icon-test:
	@ echo ">>> icon test" ; \
 	echo test \
 	echo $(url)

icon-btp-block:
	@ echo ">>> Generate first btp block header" ; \
 	output=$(output) \
 	url=$(url) \
 	networkTypeId=$(networkTypeId) \
 	networkId=$(networkId) \
 	rxSeq=$(rxSeq) \
 	height=$(height) \
	cd ..; \
	make all; \
	./bin/btpblock gen --url $(url) --output $(output) --networkTypeId $(networkTypeId) --networkId $(networkId) --rxSeq $(rxSeq) --height $(height)


icon-manager-reward:
	@ echo ">>> ICON ${method}Reward  " ; \
 	srcNetworkPath=$(srcNetworkPath) \
 	dstNetworkPath=$(dstNetworkPath) \
 	address=$(address) \
 	method=$(method) \
	$(HARDHAT) run scripts/icon/manager/reward.ts


icon-manager-link:
	@ echo ">>> ICON ${method}Link  " ; \
 	srcNetworkPath=$(srcNetworkPath) \
 	dstNetworkPath=$(dstNetworkPath) \
 	networkId=$(networkId) \
 	method=$(method) \
	$(HARDHAT) run scripts/icon/manager/link.ts

icon-manager-mode:
	@ echo ">>> ICON ${method}Mode  " ; \
 	srcNetworkPath=$(srcNetworkPath) \
 	method=$(method) \
	$(HARDHAT) run scripts/icon/manager/mode.ts

icon-manager-getStatus:
	@ echo ">>> ICON getStatus  " ; \
 	srcNetworkPath=$(srcNetworkPath) \
 	dstNetworkPath=$(dstNetworkPath) \
	$(HARDHAT) run scripts/icon/manager/status.ts

icon-manager-service:
	@ echo ">>> ICON ${method}service  " ; \
 	srcNetworkPath=$(srcNetworkPath) \
 	service=$(service) \
 	address=$(address) \
 	method=$(method) \
	$(HARDHAT) run scripts/icon/manager/service.ts

icon-manager-verifier:
	@ echo ">>> ICON ${method}Verifier  " ; \
 	srcNetworkPath=$(srcNetworkPath) \
 	dstNetworkPath=$(dstNetworkPath) \
 	method=$(method) \
	$(HARDHAT) run scripts/icon/manager/verifier.ts

#xCall Multi
xcall-multi-deploy:
	@ echo ">>> xcall multi deploy" ; \
	srcNetworkPath=$(srcNetworkPath) jarPath=$(jarPath) $(HARDHAT) run scripts/icon/deploy/xcall_multi.ts


xcall-multi-dapp-deploy:
	@ echo ">>> xcall multi dapp deploy" ; \
	srcNetworkPath=$(srcNetworkPath) jarPath=$(jarPath) $(HARDHAT) run scripts/icon/deploy/xcall_multi_dapp.ts


xcall-multi-set-connection:
	@ echo ">>> xcall multi dapp deploy" ; \
	srcNetworkPath=$(srcNetworkPath) dstNetworkPath=$(dstNetworkPath) $(HARD