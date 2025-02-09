"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getEscrowTransactionsBySellerWallet } from "@/data/escrew-transactions";
import { useSessionQuery } from "@/hooks/queries/auth/useSessionQuery";
import { useEscrow } from "@/hooks/useEscrow";
import { useLogout } from "@/hooks/useLogout";
import {
  LogOut,
  Upload,
  Clock,
  CheckCircle,
  ArrowLeftCircle,
} from "lucide-react";

export default function SellerDashboard({
  escrowTransactions,
}: {
  escrowTransactions: Awaited<
    ReturnType<typeof getEscrowTransactionsBySellerWallet>
  >;
}) {
  const { isLoading } = useSessionQuery();
  const { handleLogout } = useLogout();
  const { confirmExportClearance, releasePayment } = useEscrow();
  const handleLogoutClick = async () => {
    await handleLogout();
  };

  const handleUploadExportClearance = async (
    escrowAddress: string,
    transactionId: number
  ) => {
    await confirmExportClearance(escrowAddress, transactionId);
  };

  const handleReleasePayment = async (
    escrowAddress: string,
    transactionId: number
  ) => {
    await releasePayment(escrowAddress, transactionId);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>
        <Button
          variant="outline"
          disabled={isLoading}
          onClick={handleLogoutClick}
        >
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pending Orders</CardTitle>
          <CardDescription>
            Orders where buyers have deposited funds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Carrier</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {escrowTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.buyer_wallet}</TableCell>
                  <TableCell>{transaction.carrier_wallet}</TableCell>
                  <TableCell>{transaction.amount} ETH</TableCell>
                  <TableCell>
                    {transaction.status === "Created" ? (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() =>
                          handleUploadExportClearance(
                            transaction?.escrow_address!,
                            transaction.id
                          )
                        }
                      >
                        <Upload className="mr-2 h-4 w-4" /> Confirm Export
                        Clearance
                      </Button>
                    ) : transaction.status === "ExportCleared" ? (
                      <Button size="sm" variant="secondary" disabled>
                        <Clock className="mr-2 h-4 w-4" /> Awaiting Confirmation
                      </Button>
                    ) : transaction.status === "LoadedOnBoard" ? (
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() =>
                          handleReleasePayment(
                            transaction?.escrow_address!,
                            transaction.id
                          )
                        }
                      >
                        <CheckCircle className="mr-2 h-4 w-4" /> Release Funds
                      </Button>
                    ) : transaction.status === "Completed" ? (
                      <Button size="sm" className="bg-green-500" disabled>
                        <CheckCircle className="mr-2 h-4 w-4" /> Transaction
                        Complete
                      </Button>
                    ) : (
                      transaction.status === "Refunded" && (
                        <Button size="sm" variant="destructive" disabled>
                          <ArrowLeftCircle className="mr-2 h-4 w-4" /> Funds
                          Refunded
                        </Button>
                      )
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
