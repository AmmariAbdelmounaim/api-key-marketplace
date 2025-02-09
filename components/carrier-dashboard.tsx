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
import { getEscrowTransactionsByCarrierWallet } from "@/data/escrew-transactions";
import { useSessionQuery } from "@/hooks/queries/auth/useSessionQuery";
import { useEscrow } from "@/hooks/useEscrow";
import { useLogout } from "@/hooks/useLogout";
import { LogOut, Ship, Clock, CheckCircle, ArrowLeftCircle } from "lucide-react";

export default function CarrierDashboard({ 
  escrowTransactions 
}: { 
  escrowTransactions: Awaited<ReturnType<typeof getEscrowTransactionsByCarrierWallet>> 
}) {
  const { isLoading } = useSessionQuery();
  const { handleLogout } = useLogout();
  const { confirmLoadedOnBoard } = useEscrow();

  const handleLogoutClick = async () => {
    await handleLogout();
  };

  const handleConfirmLoading = async (escrowAddress: string, transactionId: number) => {
    await confirmLoadedOnBoard(escrowAddress, transactionId);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6">Carrier Dashboard</h1>
        <Button variant="outline" disabled={isLoading} onClick={handleLogoutClick}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pending Shipments</CardTitle>
          <CardDescription>
            Shipments waiting for loading confirmation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shipment ID</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {escrowTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.buyer_wallet}</TableCell>
                  <TableCell>{transaction.seller_wallet}</TableCell>
                  <TableCell>{transaction.amount} ETH</TableCell>
                  <TableCell>{transaction.status}</TableCell>
                  <TableCell>
                    {transaction.status === "ExportCleared" ? (
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => handleConfirmLoading(transaction?.escrow_address!, transaction.id)}
                      >
                        <Ship className="mr-2 h-4 w-4" /> Confirm Loading
                      </Button>
                    ) : transaction.status === "LoadedOnBoard" ? (
                      <Button size="sm" variant="secondary" disabled>
                        <CheckCircle className="mr-2 h-4 w-4" /> Loading Confirmed
                      </Button>
                    ) : transaction.status === "Completed" ? (
                      <Button size="sm" className="bg-green-500" disabled>
                        <CheckCircle className="mr-2 h-4 w-4" /> Transaction Complete
                      </Button>
                    ) : transaction.status === "Refunded" && (
                      <Button size="sm" variant="destructive" disabled>
                        <ArrowLeftCircle className="mr-2 h-4 w-4" /> Funds Refunded
                      </Button>
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