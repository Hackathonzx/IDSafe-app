const { expect } = require("chai");
const { ethers } = require("hardhat");
require('dotenv').config();

describe("IdentityVerification", function () {
    let identityVerification, owner, user;
  
    beforeEach(async function () {
      [owner, user] = await ethers.getSigners();
      const IdentityVerification = await ethers.getContractFactory("IdentityVerification");
      identityVerification = await IdentityVerification.deploy(
        oracle, jobId, ethers.parseUnits("0.1", "ether"), linkToken);
      await identityVerification.waitForDeployment();
    });
  
    it("Should emit VerificationRequested event on request", async function () {
      const tx = await identityVerification.connect(user).requestVerification("DID:123", "DocumentHash");
      await expect(tx)
        .to.emit(identityVerification, "VerificationRequested")
        .withArgs(user.address, "DID:123", "DocumentHash");
    });  

  it("Should emit VerificationFulfilled event on fulfillment", async function () {
    await identityVerification.requestVerification("DID:123", "DocumentHash");
    const tx = await identityVerification.fulfillVerification("0x123", "DID:123");
    await expect(tx)
      .to.emit(identityVerification, "VerificationFulfilled")
      .withArgs("0x123", "DID:123");
  });

  it("Should revert if non-owner tries to call fulfillVerification", async function () {
    await expect(
      identityVerification.connect(user).fulfillVerification("0x123", "DID:123")
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
