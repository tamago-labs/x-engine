// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "./IOracle.sol";

contract Oracle is IOracle {

    uint public value;
    address public owner;

    constructor() {
        owner = msg.sender;
        value = 90000;
    }

    function updateValue(uint _newValue) public onlyOwner {
        value = _newValue;
    }

    function getValue() public view override returns (uint) {
        return value;
    }

    modifier onlyOwner() {
        require( msg.sender == owner, "caller is not the owner");
        _;
    }


}