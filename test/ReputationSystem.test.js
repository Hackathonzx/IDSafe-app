const { expect } = require("chai");
const { ethers } = require("hardhat");
require('dotenv').config();

describe("ReputationSystem", function () {
    let reputationSystem, owner, user;
  
    beforeEach(async function () {
      [owner, user] = await ethers.getSigners();
      const ReputationSystem = await ethers.getContractFactory("ReputationSystem");
      reputationSystem = await ReputationSystem.deploy();
    });
  
    it("Should increase reputation for a user", async function () {
      await reputationSystem.increaseReputation(user.address, 10);
      expect(await reputationSystem.getReputation(user.address)).to.equal(10);
    });
  
    it("Should decrease reputation for a user", async function () {
      await reputationSystem.increaseReputation(user.address, 20);
      await reputationSystem.decreaseReputation(user.address, 5);
      expect(await reputationSystem.getReputation(user.address)).to.equal(15);
    });
  
    it("Should revert if trying to decrease reputation below zero", async function () {
      await reputationSystem.increaseReputation(user.address, 3);
      await expect(
        reputationSystem.decreaseReputation(user.address, 5)
      ).to.be.revertedWith("Reputation cannot be negative");
    });
  });
  