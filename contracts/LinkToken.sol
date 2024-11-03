// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LinkToken is ERC20 {
    constructor() ERC20("Mock LINK", "mLINK") {
        _mint(msg.sender, 1000 * 10 ** decimals()); // Mint 1000 tokens to the deployer
    }
}
