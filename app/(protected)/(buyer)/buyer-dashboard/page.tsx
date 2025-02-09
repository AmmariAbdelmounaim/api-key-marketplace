import { getSession } from "@/lib/get-session";
import { getEscrowTransactionsByBuyerWallet } from "@/data/escrew-transactions";
import BuyerDashboard from "@/components/buyer-dashboard";

export default async function BuyerDashboardPage() {
  const session = await getSession();
  console.log("session: ", session);
  const escrowTransactions = await getEscrowTransactionsByBuyerWallet(
    session?.walletAddress!
  );
  return (
    <BuyerDashboard escrowTransactions={escrowTransactions} />
  );
}
