"use server";

import { revalidatePath } from "next/cache";
import {
  createEscrowTransaction,
  updateEscrowTransactionBillOfLandingHash,
  updateEscrowTransactionExportDeclarationHash,
  updateEscrowTransactionStatus,
} from "./data/escrew-transactions";
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
  const transaction = await updateEscrowTransactionStatus(
    transactionId,
    status
  );
  revalidatePath("/seller-dashboard", "page");
  revalidatePath("/carrier-dashboard", "page");
  revalidatePath("/buyer-dashboard", "page");
  return transaction;
}

export async function updateEscrowTransactionExportDeclarationHashAction(
  transactionId: number,
  exportDeclarationHash: string
) {
  const transaction = await updateEscrowTransactionExportDeclarationHash(
    transactionId,
    exportDeclarationHash
  );
  revalidatePath("/seller-dashboard", "page");
  revalidatePath("/carrier-dashboard", "page");
  revalidatePath("/buyer-dashboard", "page");
  return transaction;
}

export async function updateEscrowTransactionBillOfLandingHashAction(
  transactionId: number,
  billOfLandingHash: string
) {
  const transaction = await updateEscrowTransactionBillOfLandingHash(
    transactionId,
    billOfLandingHash
  );
  revalidatePath("/seller-dashboard", "page");
  revalidatePath("/carrier-dashboard", "page");
revalidatePath("/buyer-dashboard", "page");
  return transaction;
}
