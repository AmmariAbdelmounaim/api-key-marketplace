"server only";

import { createClient } from "@/utils/supabase/server";

/**
 * Retrieves a user by their wallet address.
 * Throws an error with details if the request fails.
 */
export const getUserByWalletAddress = async (walletAddress: string) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("walletAddress", walletAddress)
      .limit(1);

    if (error) {
      const errorMessage = `Failed to get user by wallet address: ${
        error?.message || "Unknown error"
      }`;
      console.error(
        "Supabase error in getUserByWalletAddress:",
        errorMessage,
        error
      );
      // Throwing error with the original error as its cause.
      throw new Error(errorMessage, { cause: error });
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in getUserByWalletAddress:", err);
    throw err;
  }
};

/**
 * Creates a new user with the provided wallet address and nonce.
 * Throws an error with details if insertion fails.
 */
export const createUser = async (walletAddress: string, nonce: string) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users")
      .insert({ walletAddress, nonce })
      .select()
      .single();

    if (error) {
      const errorMessage = `Failed to create user: ${error?.message || "Unknown error"}`;
      console.error("Supabase error in createUser:", errorMessage, error);
      throw new Error(errorMessage, { cause: error });
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in createUser:", err);
    throw err;
  }
};

/**
 * Updates the nonce for an existing user.
 * Throws an error with details if the update fails.
 */
export const updateUserNonce = async (walletAddress: string, nonce: string) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users")
      .update({ nonce })
      .eq("walletAddress", walletAddress)
      .select()
      .single();
    if (error) {
      const errorMessage = `Failed to update user nonce: ${error?.message || "Unknown error"}`;
      console.error("Supabase error in updateUserNonce:", errorMessage, error);
      throw new Error(errorMessage, { cause: error });
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in updateUserNonce:", err);
    throw err;
  }
};

export const getUserByWalletAddressAndNonce = async (
  walletAddress: string,
  nonce: string
) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("walletAddress", walletAddress)
      .eq("nonce", nonce)
      .single(); // Using single() for consistency when expecting one record.

    if (error) {
      const errorMessage = `Failed to get user by wallet address and nonce: ${error?.message || "Unknown error"}`;
      console.error(
        "Supabase error in getUserByWalletAddressAndNonce:",
        errorMessage,
        error
      );
      throw new Error(errorMessage, { cause: error });
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in getUserByWalletAddressAndNonce:", err);
    throw err;
  }
};
