// This module uses Hardhat Ignition to deploy the APIKeyEscrowFactory contract.
// The factory allows you to dynamically create individual APIKeyEscrow instances 
// with different seller addresses and deposit amounts at runtime without deploying
// a new contract each time.

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const APIKeyEscrowFactoryModule = buildModule("APIKeyEscrowFactoryModule", (m) => {
  // Deploy the APIKeyEscrowFactory contract.
  // Make sure you have a corresponding factory contract in your contracts folder.
  const factory = m.contract("APIKeyEscrowFactory");

  return { factory };
});

export default APIKeyEscrowFactoryModule; 