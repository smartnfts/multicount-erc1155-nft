require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

const { RPC_URL, PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.28',
    settings: {
      evmVersion: 'london',
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "energiTestnet",
  networks: {
    hardhat: {
      blockGasLimit: 10000000,
    },
    energiMainnet: {
      chainId: 39797,
      url: String(RPC_URL || "https://nodeapi.energi.network"),
      gas: 30000000,
      gasPrice: 20000000000, // 20 GWei
      accounts: [`0x${PRIVATE_KEY}`],
    },
    energiTestnet: {
      chainId: 49797,
      url: String(RPC_URL || "https://nodeapi.test.energi.network"),
      gas: 30000000,
      gasPrice: 20000000000, // 20 GWei
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: {
      energiTestnet: 'xxxxx-no-api-key-needed-xxxxx',
      energiMainnet: 'xxxxx-no-api-key-needed-xxxxx'
    },
    customChains: [
      {
        network: "energiMainnet",
        chainId: 39797,
        urls: {
          apiURL: "https://explorer.energi.network/api",
          browserURL: "https://explorer.energi.network"
        },
      },
      {
        network: "energiTestnet",
        chainId: 49797,
        urls: {
          apiURL: "https://explorer.test.energi.network/api",
          browserURL: "https://explorer.test.energi.network"
        },
      },
    ]
  },
  sourcify: {
    enabled: true // Enable Sourcify verification
  }
};
