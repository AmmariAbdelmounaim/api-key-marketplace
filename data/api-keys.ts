"server only";

import { createClient } from "@/utils/supabase/server";

export async function getApiKeys() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("api_keys").select("*");

    if (error) {
      const errorMessage = `Failed to get api keys: ${
        error?.message || "Unknown error"
      }`;
      console.error("Supabase error in getApiKeys:", errorMessage, error);
      // Throwing error with the original error as its cause.
      throw new Error(errorMessage, { cause: error });
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in getApiKeys:", err);
    throw err;
  }
}

export async function getApiKeyById(id: number) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("api_keys")
      .select("*,seller:seller_id(wallet_address)")
      .eq("id", id)
      .single();

    if (error) {
      const errorMessage = `Failed to get api key: ${
        error?.message || "Unknown error"
      }`;
      console.error("Supabase error in getApiKey:", errorMessage, error);
      throw new Error(errorMessage, { cause: error });
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in getApiKey:", err);
    throw err;
  }
}
