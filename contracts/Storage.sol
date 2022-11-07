// SPDX-License-Identifier: MIT
pragma solidity =0.8.17;

contract Storage {
    address private _x = address(0xFF);
    uint256 private _y = 0xDEAD;
    uint64 private _z = 0xBEEF;

    struct a {
        address var1;
        address [] var2;
    }

    mapping(uint256 => a) private _a;
    
    function set(uint256 key, address var1_, address [] memory var2_) external {
        _a[key].var1 = var1_;
        _a[key].var2 = var2_;
    }
}