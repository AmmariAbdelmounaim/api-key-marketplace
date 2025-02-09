"use server";

import { revalidatePath } from "next/cache";
import { createEscrowTransaction, updateEscrowTransactionStatus } from "./data/escrew-transactions";

export async function createEscrowTransactionAction(
  buyerWallet: string,
  sellerWallet: string,
  apiKeyId: number,
  amount: number,
  status: string,
  escrowAddress: string
) {
  const transaction = await createEscrowTransaction(
    buyerWallet,
    sellerWallet,
    apiKeyId,
    amount,
    status,
    escrowAddress
  );
  return transaction;
}

export async function updateEscrowTransactionStatusAction(
  transactionId: number,
  status: string
) {
  const transaction = await updateEscrowTransactionStatus(transactionId, status);
  revalidatePath('/seller-dashboard', 'page')
  revalidatePath('/buyer-dashboard', 'page')
  return transaction;
}
