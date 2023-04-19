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
      url: "https://goerli.infura.io/v3/3a252697a2194109b8fa47e46e439ac0",
      accounts: [
        "54868b038d58932b0da3b3f1ec6a854d013910a9418cd8f8b11ffafe99bc8db7",
      ],
    },
  },
  etherscan: {
    apiKey: "65HPY3B4FJ7KUQRUK3U8Z5Y9B41ESG41XJ",
  },
};
