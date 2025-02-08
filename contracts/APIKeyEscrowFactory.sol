// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./APIKeyEscrow.sol";

contract APIKeyEscrowFactory {
    APIKeyEscrow[] public escrows;

    event EscrowCreated(address escrowAddress, address indexed buyer, address seller, uint amount);

    function createEscrow(address seller) external payable {
        require(msg.sender != seller, "Buyer and seller cannot be the same address");
        APIKeyEscrow escrow = new APIKeyEscrow{value: msg.value}(seller, msg.sender);
        escrows.push(escrow);
        emit EscrowCreated(address(escrow), msg.sender, seller, msg.value);
    }
} 