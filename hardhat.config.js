require("@nomicfoundation/hardhat-ethers");
require('@nomicfoundation/hardhat-toolbox');
require("dotenv").config();

const { RPC_URL, PRIVATE_KEY } = process.env

module.exports = {
  solidity: "0.8.1",
  networks: {
    IntersectTestnet: {
      url: process.env.AVALANCHE_URL,
      chainId: 1612,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};