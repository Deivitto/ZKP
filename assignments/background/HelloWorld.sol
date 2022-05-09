// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.7;

contract HelloWorld {
    //number to retrieve in the HelloWorld test
    uint256 number;

    // function that returns the stored number
    function storeNumber(uint256 _number) public {
        number = _number;
    }

    // returns the number stored
    // @return uint256 number stored
    function retrieveNumber() public view returns (uint256){
        return number;
    }
}
