import SellerDashboard from "@/components/seller-dashboard";
import { getSession } from "@/lib/get-session";
import { getEscrowTransactionsBySellerWallet } from "@/data/escrew-transactions";
export default async function SellerDashboardPage() {
  const session = await getSession();
  const escrowTransactions = await getEscrowTransactionsBySellerWallet(
    session?.walletAddress!
  );
  return <SellerDashboard escrowTransactions={escrowTransactions} />;
}
