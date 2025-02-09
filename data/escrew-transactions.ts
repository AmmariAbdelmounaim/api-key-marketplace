"server only";

import { createClient } from "@/utils/supabase/server";
import { EscrowStatus } from "@/utils/types";

export const createEscrowTransaction = async (
  buyerWallet: string,
  sellerWallet: string,
  carrierWallet: string,
  shipmentId: number,
  amount: number,
  status: EscrowStatus,
  escrowAddress: string
) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("escrow_transactions")
      .insert({
        buyer_wallet: buyerWallet,
        seller_wallet: sellerWallet,
        carrier_wallet: carrierWallet,
        fob_shipment_id: shipmentId,
        amount,
        status,
        escrow_address: escrowAddress,
      })
      .select()
      .single();

    if (error) {
      const errorMessage = `Failed to create escrow transaction: ${
        error?.message || "Unknown error"
      }`;
      console.error(
        "Supabase error in createEscrowTransaction:",
        errorMessage,
        error
      );
      throw new Error(errorMessage, { cause: error });
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in createEscrowTransaction:", err);
    throw err;
  }
};

export const getEscrowTransactionsByBuyerWallet = async (
  buyerWallet: string
) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("escrow_transactions")
      .select(
        `*,fob_shipments(*)`
      )
      .eq("buyer_wallet", buyerWallet);

    if (error) {
      const errorMessage = `Failed to get escrow transactions by buyer wallet: ${
        error?.message || "Unknown error"
      }`;
      console.error(
        "Supabase error in getEscrowTransactionsByBuyerWallet:",
        errorMessage,
        error
      );
      throw new Error(errorMessage, { cause: error });
    }

    return data;
  } catch (err) {
    console.error(
      "Unexpected error in getEscrowTransactionsByBuyerWallet:",
      err
    );
    throw err;
  }
};

export const getEscrowTransactionsBySellerWallet = async (
  sellerWallet: string
) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("escrow_transactions")
      .select("*, fob_shipments(*)")
      .eq("seller_wallet", sellerWallet);

    if (error) {
      const errorMessage = `Failed to get escrow transactions by seller wallet: ${
        error?.message || "Unknown error"
      }`;
      console.error(
        "Supabase error in getEscrowTransactionsBySellerWallet:",
        errorMessage,
        error
      );
      throw new Error(errorMessage, { cause: error });
    }

    return data;
  } catch (err) {
    console.error(
      "Unexpected error in getEscrowTransactionsBySellerWallet:",
      err
    );
    throw err;
  }
};

export const updateEscrowTransactionStatus = async (
  transactionId: number,
  status: EscrowStatus
) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("escrow_transactions")
      .update({ status })
      .eq("id", transactionId);

    if (error) {
      const errorMessage = `Failed to update escrow transaction status: ${
        error?.message || "Unknown error"
      }`;
      console.error(
        "Supabase error in updateEscrowTransactionStatus:",
        errorMessage,
        error
      );
      throw new Error(errorMessage, { cause: error });
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in updateEscrowTransactionStatus:", err);
    throw err;
  }
};

export const getEscrowTransactionsByCarrierWallet = async (
  carrierWallet: string
) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("escrow_transactions")
      .select("*, fob_shipments(*)")
      .eq("carrier_wallet", carrierWallet);

    if (error) {
      const errorMessage = `Failed to get escrow transactions by carrier wallet: ${
        error?.message || "Unknown error"
      }`;
      console.error(
        "Supabase error in getEscrowTransactionsByCarrierWallet:",
        errorMessage,
        error
      );
      throw new Error(errorMessage, { cause: error });
    }

    return data;
  } catch (err) {
    console.error(
      "Unexpected error in getEscrowTransactionsByCarrierWallet:",
      err
    );
    throw err;
  }
};
