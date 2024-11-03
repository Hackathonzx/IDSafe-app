const { ethers } = require("hardhat");
const { expect } = require("chai");

let credentialNFT, deployer, user;

describe("CredentialNFT Contract", function () {
    beforeEach(async function () {
        [deployer, user] = await ethers.getSigners(); // Get deployer and user signers

        const CredentialNFT = await ethers.getContractFactory("CredentialNFT");
        credentialNFT = await CredentialNFT.deploy(); // Correct deployment
    });

    it('should issue a credential and store metadata', async function () {
        await credentialNFT.issueCredentialWithMetadata(user.address, 'metadata');
        expect(await credentialNFT.ownerOf(0)).to.equal(user.address);
        expect(await credentialNFT.getCredentialMetadata(0)).to.equal('metadata');
    });

    it('should emit an event when credential is issued', async function () {
        await expect(credentialNFT.issueCredentialWithMetadata(user.address, 'metadata'))
            .to.emit(credentialNFT, 'CredentialIssued')
            .withArgs(user.address, 0);
    });

    it('should emit a cross-chain verification event', async function () {
        await credentialNFT.issueCredentialWithMetadata(user.address, 'metadata');
        await expect(credentialNFT.emitCrossChainVerificationEvent(0, 'Avalanche'))
            .to.emit(credentialNFT, 'IdentityVerifiedCrossChain')
            .withArgs(user.address, 0, 'Avalanche');
    });

    it('should burn a credential', async function () {
        await credentialNFT.issueCredentialWithMetadata(user.address, 'metadata');
        await credentialNFT.connect(user).burnCredential(0);
        await expect(credentialNFT.ownerOf(0)).to.be.revertedWith('ERC721: invalid token ID');
    });

    it('should fail to burn if not the owner', async function () {
        await credentialNFT.issueCredentialWithMetadata(user.address, 'metadata');
        await expect(credentialNFT.burnCredential(0)).to.be.revertedWith('Not the credential owner');
    });
});
