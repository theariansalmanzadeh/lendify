/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ethers");
require("ethers");

module.exports = {
  solidity: "0.8.17",
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
    },
    goerli: {
      url: "",
      accounts: [""],
    },
  },
  etherscan: {
    apiKey: "65HPY3B4FJ7KUQRUK3U8Z5Y9B41ESG41XJ",
  },
};
