const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Get the network from Hardhat config
  const network = await ethers.provider.getNetwork();
  console.log(`Deploying to network with chainId: ${network.chainId}`);

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Read configuration
  const configPath = path.join(__dirname, "nft-config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

  // Get contract factory
  const NFTContract = await ethers.getContractFactory("CustomNFTCollection");
  
  // Deploy contract directly without proxy
  const nftContract = await NFTContract.deploy();
  await nftContract.waitForDeployment();

  // Get deployed contract address
  const contractAddress = await nftContract.getAddress();
  console.log("NFT Contract deployed to:", contractAddress);

  // Initialize the contract
  await nftContract.initialize(
    config.name, 
    config.baseURI, 
    ethers.parseEther(config.mintPrice.toString())
  );

  // Set token supplies
  for (const tokenId in config.tokenSupplies) {
    const supply = config.tokenSupplies[tokenId];
    console.log(`Setting supply for token ${tokenId}: ${supply}`);
    await nftContract.setTokenSupply(parseInt(tokenId), supply);
  }

  // Batch mint entire supply for specific tokens
  for (const tokenId in config.tokenSupplies) {
    const supply = config.tokenSupplies[tokenId];
    console.log(`Minting ${supply} tokens for token ID ${tokenId}`);
    await nftContract.ownerMintBatch(
      deployer.address,
      parseInt(tokenId),
      supply
    );
  }

  // Update config with deployed contract address
  config.contractAddress = contractAddress;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  console.log("Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment error:", error);
    process.exit(1);
  });
