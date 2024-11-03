const { ethers } = require("hardhat");
const { expect } = require("chai");

let didRegistry, user;

describe("DIDRegistry Contract", function () {
    beforeEach(async function () {
        const DIDRegistry = await ethers.getContractFactory("DIDRegistry");
        didRegistry = await DIDRegistry.deploy();
        await didRegistry.waitForDeployment(); // Wait for deployment

        [deployer, user] = await ethers.getSigners(); // Get signers, including user
    });

    it('should register a new DID', async function () {
        await didRegistry.connect(user).registerDID('did:example:123');
        const did = await didRegistry.getDID(0);

        expect(did.owner).to.equal(user.address);
        expect(did.didURI).to.equal('did:example:123');
    });

    it('should emit an event on DID registration', async function () {
        await expect(didRegistry.connect(user).registerDID('did:example:123'))
            .to.emit(didRegistry, 'DIDRegistered')
            .withArgs(user.address, 0, 'did:example:123');
    });

    // it('should fail if DID already registered', async function () {
    //     await didRegistry.connect(user).registerDID('did:example:123');
    //     await expect(didRegistry.connect(user).registerDID('did:example:123'))
    //         .to.be.revertedWith('DID already registered');
    // });

    it('should retrieve a DID', async function () {
        await didRegistry.connect(user).registerDID('did:example:123');
        const did = await didRegistry.getDID(0);

        expect(did.didURI).to.equal('did:example:123');
    });

    it('should fail if DID is not found', async function () {
        await expect(didRegistry.getDID(999)).to.be.revertedWith('DID not found');
    });
});
