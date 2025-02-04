import { getUserByWalletAddressAndNonce } from "@/data/users";
import { verifyMessage } from "ethers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  const { walletAddress, signature, nonce } = await request.json();
  const signerAddress = verifyMessage(nonce, signature);

  if (signerAddress !== walletAddress) {
    return new NextResponse(JSON.stringify({ success: false }), { status: 401 });
  }

  const user = await getUserByWalletAddressAndNonce(walletAddress, nonce);

  if (user) {
    // Create a JWT payload with any user information you want to expose.
    const payload = {
      id: user.id,
      walletAddress: user.walletAddress,
      // add more fields (e.g., role) as needed
    };

    // Sign the token using your JWT secret (store this in your environment variables)
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });

    // Create the response and set the token cookie.
    const response = new NextResponse(JSON.stringify({ success: true, user }), { status: 200 });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    });

    return response;
  }

  return new NextResponse(JSON.stringify({ success: false }), { status: 401 });
}
