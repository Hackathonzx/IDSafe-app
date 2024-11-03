const { ethers } = require("hardhat");
const { expect } = require("chai");

const chainlinkCCIPRouterAddress = "0xF694E193200268f9a4868e4Aa017A0118C9a8177";
const linkTokenAddress = "0x514910771AF9Ca656af840dff83E8264EcF986CA";

describe("VerificationOracle", function () {
  let verificationOracle;
  let owner;
  let user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const VerificationOracle = await ethers.getContractFactory("VerificationOracle");
    verificationOracle = await VerificationOracle.deploy(chainlinkCCIPRouterAddress, linkTokenAddress);
    await verificationOracle.waitForDeployment();

    // Enable mock fulfillment for testing
    await verificationOracle.setMockFulfillment(true);
  });

  it("Should set the Chainlink CCIP Router", async function () {
    const newRouterAddress = "0x1234567890123456789012345678901234567890";
    await verificationOracle.setCcipRouter(newRouterAddress);
    expect(await verificationOracle.ccipRouter()).to.equal(newRouterAddress);
  });

  it("Should request cross-chain identity verification", async function () {
    await expect(verificationOracle.requestCrossChainIdentityVerification(0, "did:example:123", "Avalanche"))
      .to.emit(verificationOracle, "CrossChainVerificationRequest")
      .withArgs(0, owner.address, "Avalanche");
  });

  it("Should fulfill a cross-chain verification request", async function () {
    const requestId = ethers.keccak256(ethers.toUtf8Bytes("requestId"));
    const identityData = 12345;

    await expect(verificationOracle.mockFulfill(requestId, identityData))
      .to.emit(verificationOracle, "RequestFulfilled")
      .withArgs(requestId, identityData);

    expect(await verificationOracle.response()).to.equal(identityData);
  });
});