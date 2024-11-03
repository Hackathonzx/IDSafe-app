const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrossChainInteroperability", function () {
  let crossChainContract;
  let owner;
  let user;
  let chainlinkRouter;
  let linkToken;
  let jobId;
  let fee;

  beforeEach(async function () {
    // Get signers
    [owner, user, chainlinkRouter] = await ethers.getSigners();

    // Deploy mock LINK token
    const LinkToken = await ethers.getContractFactory("LinkToken");
    linkToken = await LinkToken.deploy();
    await linkToken.waitForDeployment();

    // Deploy CrossChainInteroperability contract
    const CrossChainInteroperability = await ethers.getContractFactory("CrossChainInteroperability");
    crossChainContract = await CrossChainInteroperability.deploy(
      chainlinkRouter.address,
      linkToken.address
    );
    await crossChainContract.deployed();

    // Set initial values
    jobId = ethers.utils.formatBytes32String("8ced832954544a3c98543c94a51d6a8d");
    fee = ethers.utils.parseEther("0.1");
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await crossChainContract.owner()).to.equal(owner.address);
    });

    it("Should set the correct Chainlink router", async function () {
      expect(await crossChainContract.chainlinkRouter()).to.equal(chainlinkRouter.address);
    });
  });

  describe("Configuration", function () {
    it("Should allow owner to set CCIP router", async function () {
      const newRouter = user.address;
      await crossChainContract.setCCIPRouter(newRouter);
      expect(await crossChainContract.chainlinkRouter()).to.equal(newRouter);
    });

    it("Should not allow non-owner to set CCIP router", async function () {
      await expect(
        crossChainContract.connect(user).setCCIPRouter(user.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow owner to set job ID", async function () {
      const newJobId = ethers.utils.formatBytes32String("newJobId");
      await crossChainContract.setJobId(newJobId);
      expect(await crossChainContract.jobId()).to.not.equal(jobId);
    });

    it("Should allow owner to set fee", async function () {
      const newFee = ethers.utils.parseEther("0.2");
      await crossChainContract.setFee(newFee);
      expect(await crossChainContract.fee()).to.equal(newFee);
    });
  });

  describe("Identity Verification", function () {
    it("Should emit event when requesting verification", async function () {
      const tokenId = 1;
      const did = "did:example:123";
      const destinationChain = "ethereum";

      await expect(
        crossChainContract.requestIdentityVerification(tokenId, did, destinationChain)
      )
        .to.emit(crossChainContract, "CrossChainVerificationRequested")
        .withArgs(tokenId, owner.address, did, destinationChain);
    });

    it("Should handle mock verification fulfillment when enabled", async function () {
      // Enable mock fulfillment
      await crossChainContract.setMockFulfillment(true);

      const tokenId = 1;
      const requestId = ethers.utils.formatBytes32String("requestId");
      const identityData = 1; // Verified

      await crossChainContract.mockFulfillVerification(requestId, identityData);
      expect(await crossChainContract.verifiedTokenStatus(tokenId)).to.equal(false);
    });

    it("Should not allow mock fulfillment when disabled", async function () {
      const requestId = ethers.utils.formatBytes32String("requestId");
      const identityData = 1;

      await expect(
        crossChainContract.mockFulfillVerification(requestId, identityData)
      ).to.be.revertedWith("Mock fulfillment is disabled");
    });
  });

  describe("LINK Token Management", function () {
    beforeEach(async function () {
      // Transfer some LINK tokens to the contract
      await linkToken.transfer(crossChainContract.address, ethers.utils.parseEther("1.0"));
    });

    it("Should allow owner to withdraw LINK tokens", async function () {
      const initialBalance = await linkToken.balanceOf(owner.address);
      await crossChainContract.withdrawLink();
      const finalBalance = await linkToken.balanceOf(owner.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should not allow non-owner to withdraw LINK tokens", async function () {
      await expect(
        crossChainContract.connect(user).withdrawLink()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});