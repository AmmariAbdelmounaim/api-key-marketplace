"use server";

import { createEscrowTransaction } from "./data/escrew-transactions";

export async function createEscrowTransactionAction(
  buyerWallet: string,
  sellerWallet: string,
  apiKeyId: number,
  amount: number,
  status: string,
  escrowAddress: string
) {
  return createEscrowTransaction(
    buyerWallet,
    sellerWallet,
    apiKeyId,
    amount,
    status,
    escrowAddress
  );
}
