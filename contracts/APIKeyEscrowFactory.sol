// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./APIKeyEscrow.sol";

contract APIKeyEscrowFactory {
    APIKeyEscrow[] public escrows;

    event EscrowCreated(address escrowAddress, address indexed buyer, address seller, uint amount);

    function createEscrow(address seller) external payable {
        APIKeyEscrow escrow = new APIKeyEscrow{value: msg.value}(seller);
        escrows.push(escrow);
        emit EscrowCreated(address(escrow), msg.sender, seller, msg.value);
    }
} 