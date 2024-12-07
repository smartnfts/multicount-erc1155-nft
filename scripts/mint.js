const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [owner] = await ethers.getSigners();
  const config = JSON.parse(fs.readFileSync("./nft-config.json", "utf8"));
  const contractAddress = config.contractAddress;

  const NFTContract = await ethers.getContractAt("CustomNFTCollection", contractAddress);

  for (const mint of config.mints) {
    await NFTContract.mint(
      mint.to, 
      mint.tokenId, 
      mint.amount, 
      { value: ethers.parseEther((config.mintPrice * mint.amount).toString()) }
    );
    console.log(`Minted ${mint.amount} of token ${mint.tokenId} to ${mint.to}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
