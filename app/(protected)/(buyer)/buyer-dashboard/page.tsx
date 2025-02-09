import { getSession } from "@/lib/get-session";
import { getEscrowTransactionsByBuyerWallet } from "@/data/escrew-transactions";
import BuyerDashboard from "@/components/buyer-dashboard";

export default async function BuyerDashboardPage() {
  const session = await getSession();
  const escrowTransactions = await getEscrowTransactionsByBuyerWallet(
    session?.walletAddress!
  );
  return (
    <BuyerDashboard escrowTransactions={escrowTransactions} />
  );
}
