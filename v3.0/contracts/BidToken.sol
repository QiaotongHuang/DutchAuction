// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BidToken is ERC20 {

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
    // Mint 10000 tokens to msg.sender
    // Similar to how
    // 1 dollar = 100 cents
    // 1 token = 1 * (10 ** decimals)
    _mint(msg.sender, 10000 * 10 ** uint(decimals()));
    }
}