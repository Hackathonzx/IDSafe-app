const { expect } = require("chai");
const { ethers } = require("hardhat");
require('dotenv').config();

describe("Hypercert", function () {
  let hypercert, owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    const Hypercert = await ethers.getContractFactory("Hypercert");
    hypercert = await Hypercert.deploy();
    await hypercert.waitForDeployment();
  });

  it("Should mint an NFT credential on mintHypercert", async function () {
    const tx = await hypercert.connect(user).mintHypercert(user.address, "DID:123", "CredentialURI");
    await expect(tx)
      .to.emit(hypercert, "Transfer")
      .withArgs(ethers.constants.AddressZero, user.address, 1);
    expect(await hypercert.ownerOf(1)).to.equal(user.address);
  });

  it("Should return correct voting power based on DID", async function () {
    await hypercert.mintHypercert(user.address, "DID:123", "CredentialURI");
    expect(await hypercert.getVotingPower("DID:123")).to.equal(1);
  });

  it("Should revert when non-owner tries to set a credential URI", async function () {
    await expect(
      hypercert.connect(user)._setCredentialURI(1, "UpdatedURI")
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
