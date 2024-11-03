# IDSafe - Decentralized Identity Verification with Sybil Resistance for Public Goods Funding

# Project Vision

Refugees often lack verifiable documentation to establish their identity, which limits their access to basic services like healthcare, financial support, and housing. IDSafe aims to provide a blockchain-based solution that ensures secure, cross-chain identity verification, enabling refugees to interact with multiple blockchain networks without needing centralized authorities. By utilizing decentralized identifiers and cross-chain protocols, IDSafe creates an inclusive, interoperable identity system.

# Overview

IDSafe is a blockchain-based identity verification system designed for refugees. It uses decentralized identifiers (DIDs) and Chainlink's Cross-Chain Interoperability Protocol (CCIP) to manage identity verification across different blockchains. The system enables access to essential services like healthcare, education, and financial assistance through verified digital credentials.


# Hackathon Requirements Implemented

This section details how IDSafe aligns with specific track requirements and hackathon challenge statements.

**Distribution & Allocation:**

IDSafe utilizes on-chain credentials and attestations for verifiable identities, allowing for transparent distribution in identity verification processes. This ensures equitable access to services tied to verified identities.

**Identity & Sybil Resistance:**

IDSafe includes mechanisms to detect and mitigate Sybil attacks using a decentralized identity management system with DIDs. Each DID is linked to unique attributes and requires verification steps, preventing duplicate or fake identities.

**Impact Evaluation:**

IDSafe integrates Hypercerts to track and certify user impact based on verified credentials. These Hypercerts link to each user’s actions and contributions, allowing for verifiable impact evaluation.

**Certification, Credentials, and Attestations:**

The system issues certificates as NFTs, which serve as attestations of a user's verified identity. These certificates are stored on-chain and provide traceability and trust in each verification outcome.

# Challenge Statements Addressed

**Funding the Commons:**
IDSafe implements Hypercerts as NFTs, providing both identity verification and impact tracking. Verified users receive Hypercerts, which could potentially be used by funders to assess and fund individuals with confirmed impacts, aligning IDSafe with Funding the Commons' objectives.

**Decoland Challenges**
IDSafe addresses various Decoland challenge statements as follows:

- Impact Verification Platform for Social and Economic Measures: By using Hypercerts and verified credentials, IDSafe enables transparent verification and tracking of identities that can validate social and economic impact.

- Blockchain-Based Certification and Attribution for Impact: IDSafe’s credential NFTs provide multi-stakeholder attribution of identity verification.

- Impact Data Marketplace: IDSafe sets a foundation for future integration into a decentralized data marketplace, allowing verified users to own their identity data and potentially monetize it.

**DAOstar - DAOIP-5 Use Case Applications**
IDSafe follows the DAOIP-5 standard for interoperability and aligns its data schema with grant management systems, enhancing compatibility for cross-chain applications.

# Technical Details

# Smart Contracts

**IdentityVerification.sol:** Manages user identity verification processes.
**CrossChainInteroperability.sol:** Facilitates cross-chain verification requests via Chainlink CCIP.
**Hypercert.sol:** Issues NFTs for verified identities, serving as credentials for trust and attribution.

# Sybil Resistance
Each verified identity is anchored to unique DIDs, ensuring no duplicate identities exist. The decentralized reputation system further enhances this by assigning scores based on contributions and interactions.

# Cross-Chain Functionality
IDSafe is designed for interoperability across multiple blockchains using Chainlink’s CCIP to enable cross-chain identity verification.

# Hypercert Implementation
IDSafe issues Hypercerts as NFT credentials to verified identities, which funders can use to validate impacts and assign reputational scores.

# Installation and Setup

Clone the repository and install dependencies:

git clone https://github.com/Hackathonzx/IDSafe-app.git

cd IDSafe-app

npm install

# Deployment

npx hardhat run ignition/modules/deploy.js --network IntesectTestnet

Here are the deployed contract addresses:

CrossChainInteroperability deployed to: 0x167f983269F8c706726c2cf6b4D9335e826A7C58

IdentityVerification deployed to: 0x7a1781E660d323c2824b18a2698Db69650164C9A

Hypercert deployed to: 0xcD275a7E70609843967a219B475D5714Fe5B02c1

ReputationSystem deployed to: 0xFAbc9015456177a12A5209B9c0C6Eb6eD276a0eD

# Testing

npx hardhat test

**Testing Approach**

1. Unit Tests:

Each smart contract function is tested independently to validate individual logic. This includes functions for creating DIDs, verifying identities, issuing Hypercerts, and updating reputation.
Examples include testing the registerDID function to prevent duplicate identifiers and the issueHypercert function to confirm NFT issuance on verification.

2. Integration Tests:

- Cross-contract interactions are tested to verify that identity data flows correctly between components like IdentityVerification.sol and ReputationSystem.sol.

- Cross-chain data transfer and verification are checked by simulating requests that utilize Chainlink’s CCIP, ensuring proper message passing and data integrity.

3. Security and Sybil Resistance Tests:

- Tests simulate attempts to register multiple identities to ensure that Sybil resistance mechanisms prevent duplicate identities.

- The ReputationSystem contract is stress-tested with different scenarios to validate reputation adjustments and protect against manipulation.

4. Event Emission Tests:

Verifies that events such as IdentityVerified, CredentialIssued, and ReputationUpdated are emitted correctly, enabling real-time tracking of important actions.

5. Edge Cases:

Tests include edge cases for invalid or duplicate DIDs, incorrect cross-chain message formats, and invalid NFT issuance attempts to ensure robust error handling.

Running the Tests
To run the tests locally, use the following command in your development environment:

npx hardhat test


# Contributing
We welcome contributions! Please open an issue for bug reports or feature requests, and submit pull requests for code changes.

1. Fork the repository.
2. Create a new branch for your feature (git checkout -b feature-branch).
3. Commit your changes (git commit -m 'Add new feature').
4. Push to the branch (git push origin feature-branch).
5. Open a pull request.

# License
This project is licensed under the MIT License - see the LICENSE file for details.
