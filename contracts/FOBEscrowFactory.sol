// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./FOBEscrow.sol";

contract FOBEscrowFactory {
    FOBEscrow[] public escrows;

    event EscrowCreated(
        address escrowAddress,
        address indexed buyer,
        address indexed seller,
        address indexed carrier,
        uint amount
    );

    function createEscrow(address seller, address carrier) external payable {
        require(msg.sender != seller, "Buyer and seller cannot be the same address");
        require(msg.sender != carrier, "Buyer and carrier cannot be the same address");
        require(seller != carrier, "Seller and carrier cannot be the same address");
        
        FOBEscrow escrow = new FOBEscrow{value: msg.value}(seller, msg.sender, carrier);
        escrows.push(escrow);
        emit EscrowCreated(address(escrow), msg.sender, seller, carrier, msg.value);
    }
} 