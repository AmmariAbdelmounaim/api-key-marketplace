import CarrierDashboard from "@/components/carrier-dashboard";
import { getSession } from "@/lib/get-session";
import { getEscrowTransactionsByCarrierWallet } from "@/data/escrew-transactions";

export default async function CarrierDashboardPage() {
  const session = await getSession();
  const escrowTransactions = await getEscrowTransactionsByCarrierWallet(
    session?.walletAddress!
  );
  return <CarrierDashboard escrowTransactions={escrowTransactions} />;
}
