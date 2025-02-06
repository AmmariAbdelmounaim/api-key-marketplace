import { ethers } from "hardhat";

async function main() {
  // Grab the contract factory for your APIKeyEscrowFactory contract.
  const factory = await ethers.getContractFactory("APIKeyEscrowFactory");
  
  // Deploy the factory contract.
  const deployedFactory = await factory.deploy();
  await deployedFactory.waitForDeployment();
  
  console.log("APIKeyEscrowFactory deployed to:", await deployedFactory.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});