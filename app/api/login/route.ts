import { getUserByWalletAddressAndNonce } from "@/data/users";
import { verifyMessage } from "ethers";

export async function POST(request: Request) {
  const { walletAddress, signature,nonce } = await request.json();
  const signerAddress = verifyMessage(nonce, signature);
  if(signerAddress !== walletAddress) {
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  }
  const user = await getUserByWalletAddressAndNonce(walletAddress,nonce);
  if (user) {
    return new Response(JSON.stringify({ success: true ,user}), { status: 200 });
  }
  return new Response(JSON.stringify({ success: false }), { status: 401 });
}
