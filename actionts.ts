"use server";

import { revalidatePath } from "next/cache";
import { createEscrowTransaction, updateEscrowTransactionStatus } from "./data/escrew-transactions";
import { EscrowStatus } from "./utils/types";

export async function createEscrowTransactionAction(
  buyerWallet: string,
  sellerWallet: string,
  carrierWallet: string,
  shipmentId: number,
  amount: number,
  status: EscrowStatus,
  escrowAddress: string
) {
  const transaction = await createEscrowTransaction(
    buyerWallet,
    sellerWallet,
    carrierWallet,
    shipmentId,
    amount,
    status,
    escrowAddress
  );
  return transaction;
}

export async function updateEscrowTransactionStatusAction(
  transactionId: number,
  status: EscrowStatus
) {
  const transaction = await updateEscrowTransactionStatus(transactionId, status);
  revalidatePath('/seller-dashboard', 'page')
  revalidatePath('/buyer-dashboard', 'page')
  return transaction;
}
