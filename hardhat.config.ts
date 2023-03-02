import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-deploy";
import "hardhat-contract-sizer";
import "solidity-docgen";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.14",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.5.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  namedAccounts: {
    deployer: 0
  },
  networks: {
    hardhat: {
      mining: {
        auto: true,
        interval: [2500, 3000],
        mempool: {
          order: "fifo"
        }
      }
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_KEY}`,
      chainId: 5,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY1}`],
    },
    bscTestnet: {
      url: process.env.BSC_TESTNET_URL,
      chainId: 97,
      gas: 2100000,
      gasPrice: 12000000000,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY1}`]
    },
    bscMainnet: {
      url: `https://bsc-dataseed.binance.org/`,
      chainId: 56,
      gas: 2100000,
      gasPrice: 5500000000,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY1}`],
    },
  },
  etherscan: {
    apiKey: {
      bscTestnet: "QA91H8CYJHDEWTZDV7CQGI2I7YQBCQZ4K1",
      bsc: "W6M4YY17TYS7HKQKA89QUTP5NGVAA4EKXS",
      goerli: "SZ64QT2TDYZ1UXNFST97U6NHJBV4K7835N",
    }
  },
  gasReporter: {
    token: "ETH",
    enabled: true,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    showTimeSpent: true,
    noColors: true,
  },
  docgen: {
    outputDir: "docs",
    pages: () => "api.md"
  }
};

export default config;