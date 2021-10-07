// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Token is ERC1155 {
   using Counters for Counters.Counter;
   mapping(uint256 => uint256) public itemPrices;

  address public minter;
  event MinterChanged(address indexed from, address to);
  uint256 public constant GOLD = 0;
  uint256 public constant SILVER = 1;
  uint256 public constant THORS_HAMMER = 2;
  uint256 public constant SWORD = 3;
  uint256 public constant SHIELD = 4;

  constructor() public ERC1155("https://game.example/api/item/{id}.json") {
    minter = msg.sender;
    _mint(msg.sender, GOLD, 10**18, "");
    _mint(msg.sender, SILVER, 10**27, "");
    _mint(msg.sender, THORS_HAMMER, 1, "");
    _mint(msg.sender, SWORD, 10**9, "");
    _mint(msg.sender, SHIELD, 10**9, "");
  }

  
  function passMinterRole(address Market) public returns(bool) {
    require(msg.sender == minter, "Error, only owner can change pass minter role");
    minter = Market;
    emit MinterChanged(msg.sender, Market);
    return true;
  }

}