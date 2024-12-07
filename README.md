# Multicount ERC-1155 NFT

This guide is meant to deploy multicount erc-1155 NFTs on the Energi blockchain.

We are using the following NFT collection on the Polygon chain to test:
- Collection URL: https://magiceden.us/collections/polygon/0x4559de7f3ddc5e357f9d75f0a8eff93daa44a369
- Name: Egypt Gold
- Max Supply: 25
- baseURL: ipfs://bafybeihbaby5kielosv3pignycb5tk4u6cgduhxpu45fdzmu7nesyoo5ce/

## 1. Set-up Developement Environment

```
npm install
```

## 2. Create Secrets

Enter the private key of the account you want to use in `ACCOUNT_PRIVATE_KEY`in the `.env` file.

```
ACCOUNT_PRIVATE_KEY=your_private_key
```

## 3. Request Test NRG

Go to [https://faucet.energi.network](https://faucet.energi.network) and paste your wallet address (**NOT THE PRIVATE KEY!**). Use the same address you got the private key for in step 2 above.

## 4. Smart Contract 

### 4.1. Compile Code

Go to "Tools" and click on "Shell". It will open a new Linux Shell window. **Do not use the existing Shell tab**.

On the Shell windows type:

```bash
npx hardhat compile
```

```text title="Response"
Compiled 20 Solidity files successfully (evm target: london).
```


## 4. Deploy Smart Contract

On the Replit "Shell" window, run the following command:

```bash
npx hardhat run scripts/deploy.js --network energiTestnet
```

```text title="Response"
Contract deployed to address: 0x38Bf6D6A154CB20e2Ba7d9EaE1FE084fC6dDf507 on energiTestnet
Transaction hash: 0x7c326953d0ecf0986bcc39ff216f3db4c95ab595f7f8f3147189026648a765f8
```

Go to [Energi Block Explorer](https://explorer.test.energi.network) and lookup the new contract address. Make sure it is commited to the blockchain.

```text title="Hint"
Search and replace all the contract address in this document so you can copy and paste the commands in this document. Double click on the contract address in the document and then press `Ctrl+s` (on Windows) or `Option+s` (On Mac) to access the search/replace box. Pick "Replace All".
```

## 5. Verify Contract

Check your account on Block Explorer. Wait until the contract in step 4 is committed on the Energi chain.

Once the contract is committed, run the following command to verify the contract:

```bash
npx hardhat verify 0x38Bf6D6A154CB20e2Ba7d9EaE1FE084fC6dDf507 --network energiTestnet
```

```text title="Response"
Nothing to compile
Successfully submitted source code for contract
contracts/Bloonz_Arise.sol:Bloonz_Arise at 0x38Bf6D6A154CB20e2Ba7d9EaE1FE084fC6dDf507
for verification on the block explorer. Waiting for verification result...

Successfully verified contract Bloonz_Arise on Etherscan.
https://explorer.test.energi.network/address/0x38Bf6D6A154CB20e2Ba7d9EaE1FE084fC6dDf507#code
```

Click on the URL to validate the smart contract was verified.


## 6. Upload images to IPFS

On your computer, save all your NFTs into a folder called `images`.

Log into [Filebase](https://filebase.com/) and "Create Bucket".

Click on the bucket to open it.

On the top right, pick "Upload" and then "Folder". Select the `images` folder.

Once all the images are uploaded, it will give you a CID (Content IDentifier). Copy the CID of the `images` folder.

In this document we are using this image CID: `QmdFtU4UfgZLM9JuSwg3k1oaj4MqrcrknRQ533tfR9gtmv`


## 7. Add Metadata about the NFTs

### 7.1. Update JSON file for Metadata

In `metadata/`, create the number of images you have in your collection. In this example, we have 10 NFTs. Create 10 files without any extension: `1`, `2`, `3`, ..., `10`. Update the `image` URL with the image CID from step 7. The URL format is `ipfs://<CID of Image from section 7.2 above>/<filename of image>`.

Download all the metadata files to a folder called `metadata` on your local computer.


### 7.2. Upload `metadata` to IPFS

Go back to the same bucket on `Filebase` and upload the `metadata` folder. It will generate a CID (in this example, the metadata CID is `QmeDX6FN42fhxZygJYJu2bqhKvheWm6fmBHgcJ5JrRgV4D`).


### 7.3. Set Base Token URI to Contract

Set your `NFT_CONTRACT_ADDRESS` and then run the `set-base-token-uri` command.

```text title="Command Syntax"
# Set a variable called NFT_CONTRACT_ADDRESS
export NFT_CONTRACT_ADDRESS=<NFT Contract Address from Step 5>
# Set base token uri
npx hardhat set-base-token-uri --base-url "ipfs://<CID of metadata from step 8.2>
```

```bash
export NFT_CONTRACT_ADDRESS=0x38Bf6D6A154CB20e2Ba7d9EaE1FE084fC6dDf507
npx hardhat set-base-token-uri --base-url "ipfs://bafybeidcac2iysqxwvffxkyececnqai7rl2byxt5ge3hamk2zllwnghzk4/" --network energiTestnet
```

```text title="Response"
Transaction Hash on energiTestnet: 0xf4e4e92332818fc45317f4ef515b590fb824a44ce7ff479aa454bafde3ca745b
```

```text title="Note"
The base-url can be updated in the future. It is important you not change the image link.
```


## 8. Mint NFTs

### 8.1. Mint a Single NFT

On the Replit Shell, run the following command. Use the same address as before or a new address. You must have enough NRG token on the account to pay for minting cost and gas fees. 

```bash
node scripts/transfer.js 0xd66Ee1691Ffe9F7d476Afc5d90C38e41cB44DC3E 0xd66Ee1691Ffe9F7d476Afc5d90C38e41cB44DC3E "1" "10" "0x"
```

```text title="Response"
Transaction Hashon energiTestnet: 0x2d30b270baaddf3ea60a263933057cce87582fc51c00cb4c3d4519aeb675f4da
```


### 8.2. Mint Multiple NFTs (Optional)

You can mint multiple NFTs at one time. Run the following command to mint to the address of your choosing. Make sure you have sufficient NRG to may for all the minting and gas fees on the address

```bash
# Set the NFT Contract Address
export NFT_CONTRACT_ADDRESS=0x38Bf6D6A154CB20e2Ba7d9EaE1FE084fC6dDf507

# Set Mint Account
export NFT_MINT_ACCOUNT=0xd66Ee1691Ffe9F7d476Afc5d90C38e41cB44DC3E

# Total number of NFTs to mint minus any NFTs you have already minted
TOTALMINT=9

################################
# DO NOT CHANGE ANYTHING BELOW #
################################
#
# Set Counter
COUNT=1

# Loop through and mint the NFTs
while [ ${COUNT} -le ${TOTALMINT} ]
do 
	npx hardhat mint --address ${NFT_MINT_ACCOUNT}
	((COUNT++))
	sleep 5
done
```

```text title="Response"
Transaction Hash energiTestnet: 0xe6e28bc6cce7a41367849086c6bd11682deb8e92e962eb0d6605a3aafc924c5d
Transaction Hash energiTestnet: 0x0445886b8bd1a246c4d18a1608d720a3b5d7ec981b10f6ef562186e41d5fce9d
Transaction Hash energiTestnet: 0xf88030a68d4782b31a6e089456ef35568a547d416ead9a874aaf930664285600
Transaction Hash energiTestnet: 0x740ef4e5b8fcd3604256f9180d7525a177c1971052a9c9b1d54996eedf3ae170
Transaction Hash energiTestnet: 0x81d67efb2564972805ae9648bdfc852ef5ff8e43cf1d734c25e639df6aa7e5b4
Transaction Hash energiTestnet: 0x19390e7caf5958773eed5f1ae1b038018776d3033de0599c9ae9a69e87062fb3
Transaction Hash energiTestnet: 0x65963ac544aa2d214f4044ec3b3b0205002fdff1563ed7f12ece89f256fbc231
Transaction Hash energiTestnet: 0x2211fecd526f06af4d665b551d44effb17dc705c9a44beba6abe3be9013b23fe
Transaction Hash energiTestnet: 0x863f4bdc2146ce449944e83875c0fc56114a4f6a98f187af45aeb65f8718e26f
```


### 8.3. Verify TokenURL

Go to the "Read Contract" tab on your contract details page:

```text title="Read Contract (Replace with your contract address)"
https://explorer.test.energi.network/address/0x38Bf6D6A154CB20e2Ba7d9EaE1FE084fC6dDf507/read-contract
```

Scroll down to `tokenURL` query "1". If the metadata was in proper formatted and accepted, it will return the URL to the metadata.

```text title="Reponse"
[ tokenURI method Response ]

[

(string) : ipfs://QmeDX6FN42fhxZygJYJu2bqhKvheWm6fmBHgcJ5JrRgV4D/1

]
```


## 10. Check and Withdraw Funds - WIP

### 10.1. Check Funds

_WIP_

### 10.2. Withdraw Funds
Go to the smart contract and click "Write Contract".

Connect to your web3 wallet and enter the amount you would like to withdraw from the contract.
