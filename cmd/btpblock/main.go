/*
 * Copyright 2023 ICON Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package main

import (
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"os"
	"path"
	"strconv"
	"strings"

	"github.com/gorilla/websocket"
	"github.com/icon-project/btp2/chain/icon/client"
	"github.com/icon-project/btp2/common/cli"
	"github.com/icon-project/btp2/common/codec"
	"github.com/icon-project/btp2/common/log"
	"github.com/spf13/cobra"
)

const DefaultProgressInterval = 100

var (
	version = "unknown"
	build   = "unknown"
)

type BTPNetworkTypeInfo struct {
	NetworkTypeID    client.HexInt   `json:"networkTypeID"`
	NetworkTypeName  string          `json:"networkTypeName"`
	NextProofContext string          `json:"nextProofContext"`
	OpenNetworkIDs   []client.HexInt `json:"openNetworkIDs"`
}

type btpUpdateParam struct {
	FirstBlockHeader string `json:"first_block_header"`
	MessageSn        int64  `json:"message_sn"`
	MessageCount     int64  `json:"message_count"`
}

func main() {
	rootCmd, rootVc := cli.NewCommand(nil, nil, "btp2 util", "Generate first btp block header")
	cli.SetEnvKeyReplacer(rootVc, strings.NewReplacer(".", "_"))
	rootCmd.AddCommand(&cobra.Command{
		Use:   "version",
		Short: "Print version",
		Args:  cobra.NoArgs,
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Println("version", version, build)
		},
	})

	genCMD := &cobra.Command{
		Use:   "gen",
		Short: "Generate first btp block header",
		PreRunE: func(cmd *cobra.Command, args []string) error {
			return nil
		},
		RunE: func(cmd *cobra.Command, args []string) error {
			outFilePath, err := cmd.Flags().GetString("output")
			if err != nil {
				return err
			}

			url, err := cmd.Flags().GetString("url")
			if err != nil {
				return err
			}

			networkTypeId, err := cmd.Flags().GetString("networkTypeId")
			if err != nil {
				return err
			}

			networkId, err := cmd.Flags().GetString("networkId")
			if err != nil {
				return err
			}

			height, err := cmd.Flags().GetInt64("height")
			if err != nil {
				return err
			}

			rxSeq, err := cmd.Flags().GetInt64("rxSeq")
			if err != nil {
				return err
			}
			l := log.WithFields(log.Fields{log.FieldKeyChain: "firstBlock"})
			client := client.NewClient(url, l)

			nextProofContext, err := getNextProofContext(client, networkTypeId)
			if err != nil {
				return err
			}

			btpBlock, err := findLastBTPBlock(client, height, networkId, rxSeq, l)
			if err != nil {
				return err
			}

			headerB64, header, err := mergeBtpHeader(nextProofContext, btpBlock)
			if err != nil {
				return err
			}

			fmt.Println("BTP block header : ", header)
			fmt.Println("Save data to", outFilePath)
			if err := os.MkdirAll(path.Dir(outFilePath), 0700); err != nil {
				return err
			}
			if err := os.WriteFile(outFilePath, []byte(headerB64), 0644); err != nil {
				return err
			}

			param := &btpUpdateParam{
				FirstBlockHeader: headerB64,
				MessageSn:        header.UpdateNumber >> 1,
				MessageCount:     header.MessageCount,
			}

			if err = cli.JsonPrettySaveFile(outFilePath, 0644, param); err != nil {
				return err
			}

			return nil
		},
	}
	genCMD.Flags().String("output", "./first_btp_block.json", "Output file name")
	genCMD.Flags().String("url", "http://localhost:9080", "ICON Endpoint")
	genCMD.Flags().Int64("height", 10, "latest block height")
	genCMD.Flags().Int64("rxSeq", 1, "BTP2 RxSeq")
	genCMD.Flags().String("networkTypeId", "0x1", "BTP2 Network Type ID")
	genCMD.Flags().String("networkId", "0x1", "BTP2 Network ID")

	rootCmd.AddCommand(genCMD)

	rootCmd.SilenceUsage = true
	if err := rootCmd.Execute(); err != nil {
		fmt.Printf("%+v", err)
		os.Exit(1)
	}

}

func mergeBtpHeader(nextProofContext []byte, b64Header string) (string, *client.BTPBlockHeader, error) {
	header, err := base64.StdEncoding.DecodeString(b64Header)
	if err != nil {
		return "", nil, err
	}

	bh := &client.BTPBlockHeader{}
	if _, err := codec.RLP.UnmarshalFromBytes(header, bh); err != nil {
		return "", nil, err
	}

	fmt.Println("bh MainHeight : ", bh.MainHeight)
	fmt.Println("bh NextProofContextHash : ", hex.EncodeToString(bh.NextProofContextHash))
	fmt.Println("bh networkId : ", bh.NetworkID)
	fmt.Println("bh UpdateNumber : ", bh.UpdateNumber)
	fmt.Println("bh PrevNetworkSectionHash : " + hex.EncodeToString(bh.PrevNetworkSectionHash))
	fmt.Println("bh MessageCount : ", bh.MessageCount)
	fmt.Println("bh MessagesRoot : " + hex.EncodeToString(bh.MessagesRoot))
	fmt.Println("bh NextProofContext : " + hex.EncodeToString(bh.NextProofContext))

	bh.NextProofContext = nextProofContext

	addHeader, err := codec.RLP.MarshalToBytes(bh)
	if err != nil {
		return "", nil, err
	}

	return base64.StdEncoding.EncodeToString(addHeader), bh, nil
}

func getNextProofContext(c *client.Client, networkTypeId string) ([]byte, error) {
	p := &client.BTPNetworkInfoParam{Id: client.HexInt(networkTypeId)}
	result := &BTPNetworkTypeInfo{}
	if _, err := c.Do("btp_getNetworkTypeInfo", p, &result); err != nil {
		return nil, err
	}

	fmt.Println("NextProofContext : " + result.NextProofContext)
	nextProofContext, err := base64.StdEncoding.DecodeString(result.NextProofContext)
	if err != nil {
		return nil, err
	}

	return nextProofContext, nil
}

func findLastBTPBlock(c *client.Client, latestHeight int64, networkId string, rxSeq int64, l log.Logger) (string, error) {
	for {
		latestHeight = latestHeight - DefaultProgressInterval
		if latestHeight < 0 {
			latestHeight = 1
		}
		fmt.Println("Latest height : " + strconv.FormatInt(latestHeight, 10))
		header, _ := monitoring(c, latestHeight, networkId, rxSeq, l)
		if header != "" {
			return header, nil
		}
	}

	return "", nil
}

func monitoring(c *client.Client, height int64, networkId string, rxSeq int64, l log.Logger) (string, error) {
	var header string

	req := &client.BTPRequest{
		Height:           client.NewHexInt(height),
		NetworkID:        client.HexInt(networkId),
		ProofFlag:        client.NewHexInt(0),
		ProgressInterval: client.NewHexInt(int64(DefaultProgressInterval)),
	}

	onErr := func(conn *websocket.Conn, err error) {
		c.CloseMonitor(conn)
	}
	onConn := func(conn *websocket.Conn) {
		l.Debugf("ReceiveLoop monitorBTP2Block height:%d networkId:%d connected %s",
			height, networkId, conn.LocalAddr().String())
	}

	err := c.MonitorBTP(req, func(conn *websocket.Conn, v *client.BTPNotification) error {
		if v.Progress.Value != 0 {
			fmt.Println(v.Progress.Value)
			if v.Progress.Value >= height+DefaultProgressInterval {
				fmt.Println("startHeight : ", strconv.FormatInt(height, 10)+", endHeight : "+strconv.FormatInt(v.Progress.Value, 10))
				return fmt.Errorf("end")
			}
			return nil
		}

		bh := &client.BTPBlockHeader{}
		h, err := base64.StdEncoding.DecodeString(v.Header)
		if err != nil {
			return err
		}
		if _, err = codec.RLP.UnmarshalFromBytes(h, bh); err != nil {
			return err
		}

		if len(bh.NextProofContext) == 0 && (bh.UpdateNumber>>1) < rxSeq {
			header = v.Header
		} else {
			fmt.Println(bh.UpdateNumber)
		}

		return nil
	}, onConn, onErr)

	return header, err
}
