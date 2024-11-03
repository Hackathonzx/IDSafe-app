// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ReputationSystem is Ownable {
    mapping(address => uint256) public reputation;
    
    event ReputationUpdated(address indexed user, uint256 newReputation);
    
    function increaseReputation(address _user, uint256 _points) public onlyOwner {
        reputation[_user] += _points;
        emit ReputationUpdated(_user, reputation[_user]);
    }
    
    function decreaseReputation(address _user, uint256 _points) public onlyOwner {
        require(reputation[_user] >= _points, "Reputation cannot be negative");
        reputation[_user] -= _points;
        emit ReputationUpdated(_user, reputation[_user]);
    }
    
    function getReputation(address _user) public view returns (uint256) {
        return reputation[_user];
    }
}