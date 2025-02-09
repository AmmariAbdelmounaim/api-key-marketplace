"server only";

import { createClient } from "@/utils/supabase/server";

export async function getFobShipments() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("fob_shipments").select("*");

    if (error) {
      const errorMessage = `Failed to get fob shipments: ${
        error?.message || "Unknown error"
      }`;
      console.error("Supabase error in getFobShipments:", errorMessage, error);
      // Throwing error with the original error as its cause.
      throw new Error(errorMessage, { cause: error });
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in getFobShipments:", err);
    throw err;
  }
}

export async function getFobShipmentById(id: number) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("fob_shipments")
      .select(
        "*,seller:seller_id(wallet_address),carrier:carrier_id(wallet_address)"
      )
      .eq("id", id)
      .single();

    if (error) {
      const errorMessage = `Failed to get fob shipment: ${
        error?.message || "Unknown error"
      }`;
      console.error(
        "Supabase error in getFobShipmentById:",
        errorMessage,
        error
      );
      throw new Error(errorMessage, { cause: error });
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in getFobShipmentById:", err);
    throw err;
  }
}
