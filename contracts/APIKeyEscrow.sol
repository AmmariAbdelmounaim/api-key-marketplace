// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract APIKeyEscrow {
    address public buyer;
    address public seller;
    uint public amount;
    bool public isDelivered;
    
    constructor(address _seller) payable {
        buyer = msg.sender;
        seller = _seller;
        amount = msg.value; // Buyer deposits funds
    }

    function confirmDelivery() public {
        require(msg.sender == buyer, "Only buyer can confirm");
        isDelivered = true;
    }

    function releasePayment() public {
        require(isDelivered, "API key must be confirmed as received");
        payable(seller).transfer(amount);
    }

    function refundBuyer() public {
        require(!isDelivered, "API key already confirmed");
        payable(buyer).transfer(amount);
    }
}
