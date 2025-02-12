import { ethers } from "hardhat";

async function main() {
  // Provided addresses
  const sellerAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const buyerAddress  = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  
  const provider = ethers.provider;

  // Replace with your actual deployed escrow contract address
  const escrowAddress = "0x427f7c59ED72bCf26DfFc634FEF3034e00922DD8"; // update this address

  // Query and display live balances
  const buyerBalance = await provider.getBalance(buyerAddress);
  const sellerBalance = await provider.getBalance(sellerAddress);
  const escrowBalance = await provider.getBalance(escrowAddress);

  console.log("Buyer Balance:", ethers.formatEther(buyerBalance), "ETH");
  console.log("Seller Balance:", ethers.formatEther(sellerBalance), "ETH");
  console.log("Escrow Contract Balance:", ethers.formatEther(escrowBalance), "ETH");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});