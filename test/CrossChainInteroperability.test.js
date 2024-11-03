const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrossChainInteroperability", function () {
  let crossChainContract;
  let owner;
  let user;
  let chainlinkRouter;
  let linkToken;
  let mockJobId;
  let mockFee;

  beforeEach(async function () {
    // Get signers
    [owner, user, chainlinkRouter] = await ethers.getSigners();

    // Deploy mock LINK token
    const MockLinkToken = await ethers.getContractFactory("MockLinkToken");
    linkToken = await MockLinkToken.deploy();
    await linkToken.waitForDeployment();

    // Deploy CrossChainInteroperability contract
    const CrossChainInteroperability = await ethers.getContractFactory("CrossChainInteroperability");
    crossChainContract = await CrossChainInteroperability.deploy(
      chainlinkRouter.address,
      linkToken.address
    );
    await crossChainContract.deployed();

    // Set mock values
    mockJobId = "0x8ced832954544a3c98543c94a51d6a8d";
    mockFee = ethers.parseEther("0.1"); // 0.1 LINK
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

    it("Should allow owner to set Job ID", async function () {
      const newJobId = "0x1234567890abcdef1234567890abcdef";
      await crossChainContract.setJobId(newJobId);
      expect(await crossChainContract.jobId()).to.equal(newJobId);
    });

    it("Should allow owner to set fee", async function () {
      const newFee = ethers.utils.parseEther("0.2");
      await crossChainContract.setFee(newFee);
      expect(await crossChainContract.fee()).to.equal(newFee);
    });

    it("Should prevent non-owner from setting CCIP router", async function () {
      await expect(
        crossChainContract.connect(user).setCCIPRouter(user.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Identity Verification", function () {
    const tokenId = 1;
    const did = "did:example:123456789abcdefghi";
    const destinationChain = "ethereum";

    beforeEach(async function () {
      // Fund contract with LINK tokens
      await linkToken.transfer(crossChainContract.address, ethers.parseEther("1.0"));
    });

    it("Should emit event when requesting verification", async function () {
      await expect(
        crossChainContract.requestIdentityVerification(tokenId, did, destinationChain)
      )
        .to.emit(crossChainContract, "CrossChainVerificationRequested")
        .withArgs(tokenId, owner.address, did, destinationChain);
    });

    describe("Mock Fulfillment", function () {
      beforeEach(async function () {
        await crossChainContract.setMockFulfillment(true);
      });

      it("Should allow mock fulfillment when enabled", async function () {
        const requestId = ethers.formatBytes32String("testRequestId");
        const verificationResult = 1; // Verified

        await crossChainContract.mockFulfillVerification(requestId, verificationResult);
        expect(await crossChainContract.verifiedTokenStatus(tokenId)).to.equal(true);
      });

      it("Should emit event on mock fulfillment", async function () {
        const requestId = ethers.formatBytes32String("testRequestId");
        const verificationResult = 1;

        await expect(
          crossChainContract.mockFulfillVerification(requestId, verificationResult)
        )
          .to.emit(crossChainContract, "CrossChainVerificationReceived")
          .withArgs(requestId, verificationResult);
      });

      it("Should not allow mock fulfillment when disabled", async function () {
        await crossChainContract.setMockFulfillment(false);
        const requestId = ethers.formatBytes32String("testRequestId");
        
        await expect(
          crossChainContract.mockFulfillVerification(requestId, 1)
        ).to.be.revertedWith("Mock fulfillment is disabled");
      });
    });
  });

  describe("LINK Token Management", function () {
    beforeEach(async function () {
      // Fund contract with LINK tokens
      await linkToken.transfer(crossChainContract.address, ethers.parseEther("1.0"));
    });

    it("Should allow owner to withdraw LINK tokens", async function () {
      const initialBalance = await linkToken.balanceOf(owner.address);
      await crossChainContract.withdrawLink();
      const finalBalance = await linkToken.balanceOf(owner.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should prevent non-owner from withdrawing LINK tokens", async function () {
      await expect(
        crossChainContract.connect(user).withdrawLink()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});