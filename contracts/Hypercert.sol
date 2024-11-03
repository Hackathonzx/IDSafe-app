// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Hypercert is ERC721, Ownable {
    uint256 public currentTokenId;
    mapping(uint256 => uint256) public votingPower;

    event HypercertMinted(address indexed user, uint256 tokenId, uint256 value);

    constructor() ERC721("Hypercert", "HYP") {}

    function mintHypercert(address _to, uint256 _value) public onlyOwner returns (uint256) {
        uint256 tokenId = currentTokenId++;
        _safeMint(_to, tokenId);
        votingPower[tokenId] = _value;
        emit HypercertMinted(_to, tokenId, _value);
        return tokenId;
    }

    function getVotingPower(uint256 _tokenId) public view returns (uint256) {
        return votingPower[_tokenId];
    }
}
