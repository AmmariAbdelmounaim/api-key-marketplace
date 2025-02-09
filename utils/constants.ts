export const factoryAbi = [
  {
    inputs: [{ internalType: "address", name: "seller", type: "address" }],
    name: "createEscrow",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "escrowAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "EscrowCreated",
    type: "event",
  },
];

// ABI for the APIKeyEscrow contract
export const escrowAbi = [
  "function buyer() public view returns (address)",
  "function seller() public view returns (address)",
  "function amount() public view returns (uint256)",
  "function isDelivered() public view returns (bool)",
  "function confirmDelivery() public",
  "function releasePayment() public",
  "function refundBuyer() public"
];

export const factoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";