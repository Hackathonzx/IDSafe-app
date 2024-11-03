// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@chainlink/contracts/src/v0.8/interfaces/ChainlinkRequestInterface.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IdentityVerification is ChainlinkClient, Ownable {
    using Chainlink for Chainlink.Request;

    mapping(address => bool) public isVerified;
    mapping(bytes32 => address) private requesters;

    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    event VerificationRequested(address indexed user, bytes32 requestId);
    event VerificationCompleted(address indexed user, bool verified);

    constructor(address _oracle, string memory _jobId, uint256 _fee, address _linkToken) {
        _setChainlinkToken(_linkToken);
        oracle = _oracle;
        jobId = stringToBytes32(_jobId);
        fee = _fee;
    }

    function requestVerification() public returns (bytes32 requestId) {
        Chainlink.Request memory request = _buildChainlinkRequest(jobId, address(this), this.fulfillVerification.selector);
        request._add("user", toAsciiString(msg.sender));
        requestId = _sendChainlinkRequestTo(oracle, request, fee);
        requesters[requestId] = msg.sender;
        emit VerificationRequested(msg.sender, requestId);
    }

    function fulfillVerification(bytes32 _requestId, bool _verified) public recordChainlinkFulfillment(_requestId) {
        address user = requesters[_requestId];
        isVerified[user] = _verified;
        emit VerificationCompleted(user, _verified);
    }

    function stringToBytes32(string memory source) internal pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }

    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);            
        }
        return string(s);
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }
}
