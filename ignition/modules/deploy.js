const hre = require("hardhat");
require('dotenv').config();

async function main() {

    const ccipRouter = process.env.CCIP_ROUTER_ADDRESS; // Set this in your .env file
    const linkToken = process.env.LINK_TOKEN_ADDRESS; // Set this in your .env file
    const oracle = process.env.ORACLE_ADDRESS;
    const jobId= process.env.JOB_ID;


  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy CrossChainInteroperability
  const CrossChainInteroperability = await hre.ethers.getContractFactory("CrossChainInteroperability");
  const crossChainInteroperability = await CrossChainInteroperability.deploy(ccipRouter, linkToken);
  await crossChainInteroperability.waitForDeployment();
  console.log("CrossChainInteroperability deployed to:", await crossChainInteroperability.getAddress());

  // Deploy IdentityVerification
  const IdentityVerification = await hre.ethers.getContractFactory("IdentityVerification");
  const identityVerification = await IdentityVerification.deploy(oracle, jobId, ethers.parseUnits("0.1", "ether"), linkToken);
  await identityVerification.waitForDeployment();
  console.log("IdentityVerification deployed to:", await identityVerification.getAddress());

  // Deploy Hypercert
  const Hypercert = await hre.ethers.getContractFactory("Hypercert");
  const hypercert = await Hypercert.deploy();
  await hypercert.waitForDeployment();
  console.log("Hypercert deployed to:", await hypercert.getAddress());

  // Deploy ReputationSystem
  const ReputationSystem = await hre.ethers.getContractFactory("ReputationSystem");
  const reputationSystem = await ReputationSystem.deploy();
  await reputationSystem.waitForDeployment();
  console.log("ReputationSystem deployed to:", await reputationSystem.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
