// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CrossChainInteroperability is ChainlinkClient, Ownable {
    using Chainlink for Chainlink.Request;

    address public chainlinkRouter;
    bytes32 private jobId;
    uint256 private fee;

    mapping(bytes32 => uint256) public requestedTokenId;
    mapping(uint256 => bool) public verifiedTokenStatus; // Tracks verification status by token ID
    uint256 public response;

    // For testing purposes
    bool public mockFulfillmentEnabled = false;

    // Events
    event CrossChainVerificationRequested(
        uint256 indexed tokenId,
        address indexed requester,
        string did,
        string destinationChain
    );
    event CrossChainVerificationReceived(bytes32 indexed requestId, uint256 indexed identityData);

    constructor(address _chainlinkRouter, address _linkToken) {
        _setChainlinkToken(_linkToken);
        chainlinkRouter = _chainlinkRouter;
        jobId = "8ced832954544a3c98543c94a51d6a8d"; // Example Job ID (update with real Job ID)
        fee = 0.1 * 10 ** 18; // 0.1 LINK (adjust as needed)
    }

    /**
     * @notice Request cross-chain identity verification
     * @param tokenId ID of the token for which identity verification is requested
     * @param did Decentralized identifier for the identity
     * @param destinationChain Target chain for verification request
     */
    function requestIdentityVerification(uint256 tokenId, string memory did, string memory destinationChain) public {
        if (mockFulfillmentEnabled) {
            emit CrossChainVerificationRequested(tokenId, msg.sender, did, destinationChain);
        } else {
            Chainlink.Request memory req = _buildChainlinkRequest(jobId, address(this), this.fulfillVerification.selector);
            req._add("did", did); // Add DID for identity verification
            req._add("destinationChain", destinationChain); // Specify destination chain
            bytes32 requestId = _sendChainlinkRequestTo(chainlinkRouter, req, fee);

            requestedTokenId[requestId] = tokenId;
            emit CrossChainVerificationRequested(tokenId, msg.sender, did, destinationChain);
        }
    }

    /**
     * @notice Fulfill the Chainlink request with identity data from the oracle
     * @param _requestId ID of the request being fulfilled
     * @param _identityData Data confirming the verification result (1 = Verified, 0 = Not Verified)
     */
    function fulfillVerification(bytes32 _requestId, uint256 _identityData) public recordChainlinkFulfillment(_requestId) {
        uint256 tokenId = requestedTokenId[_requestId];
        verifiedTokenStatus[tokenId] = (_identityData == 1); // Mark token ID as verified if identityData == 1
        emit CrossChainVerificationReceived(_requestId, _identityData);
    }

    /**
     * @notice Mock function to fulfill verification for testing purposes
     * @param _requestId ID of the request being fulfilled
     * @param _identityData Mock data for testing verification result
     */
    function mockFulfillVerification(bytes32 _requestId, uint256 _identityData) external {
        require(mockFulfillmentEnabled, "Mock fulfillment is disabled");
        uint256 tokenId = requestedTokenId[_requestId];
        verifiedTokenStatus[tokenId] = (_identityData == 1);
        emit CrossChainVerificationReceived(_requestId, _identityData);
    }

    /**
     * @notice Set Chainlink Router address for cross-chain communication
     * @param _chainlinkRouter Address of the Chainlink router
     */
    function setCCIPRouter(address _chainlinkRouter) external onlyOwner {
        chainlinkRouter = _chainlinkRouter;
    }

    /**
     * @notice Set Job ID for Chainlink requests
     * @param _jobId Chainlink job ID to be set
     */
    function setJobId(bytes32 _jobId) external onlyOwner {
        jobId = _jobId;
    }

    /**
     * @notice Set the LINK token fee for requests
     * @param _fee Amount of LINK token to be used for the request fee
     */
    function setFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }

    /**
     * @notice Enable or disable mock fulfillment for testing
     * @param enabled Boolean to enable or disable mock fulfillment
     */
    function setMockFulfillment(bool enabled) external onlyOwner {
        mockFulfillmentEnabled = enabled;
    }

    /**
     * @notice Withdraw LINK tokens from the contract
     */
    function withdrawLink() external onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(_chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
    }
}
