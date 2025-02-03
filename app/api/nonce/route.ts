import {
  createUser,
  getUserByWalletAddress,
  updateUserNonce,
} from "@/data/users";
import { v4 as uuidv4 } from "uuid";

/**
 * API route for generating and storing/refreshing a nonce.
 * This route first validates the input, then attempts to retrieve,
 * update, or create a user. Any errors from the data layer bubble up,
 * are logged, and a generic error response is returned.
 */
export async function POST(request: Request) {
  try {
    const { walletAddress } = await request.json();

    // Validate input early.
    if (!walletAddress) {
      return new Response(
        JSON.stringify({ error: "walletAddress is required" }),
        { status: 400 }
      );
    }

    const nonce = uuidv4();

    // Try to get the user by wallet address.
    const user = await getUserByWalletAddress(walletAddress);
    if (user.length > 0) {
      // Update nonce if user already exists.
      const updatedUser = await updateUserNonce(walletAddress, nonce);
      return new Response(JSON.stringify({ nonce: updatedUser.nonce }), {
        status: 200,
      });
    } else {
      // Create the user if it doesn't exist.
      const createdUser = await createUser(walletAddress, nonce);
      return new Response(JSON.stringify({ nonce: createdUser.nonce }), {
        status: 200,
      });
    }
  } catch (error: any) {
    console.error("Error in nonce API route:", error);
    // Use error.status if available from lower layers; otherwise default to 500.
    const status = error.status || 500;
    return new Response(
      JSON.stringify({ error: "Failed to process nonce operation" }),
      { status }
    );
  }
}
