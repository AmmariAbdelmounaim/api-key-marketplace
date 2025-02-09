"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Check, X, Ship } from "lucide-react";
import { useEscrow } from "@/hooks/useEscrow";
import { getEscrowTransactionsByBuyerWallet } from "@/data/escrew-transactions";
import { EscrowStatus } from "@/utils/types";

export default function BuyerDashboard({
  escrowTransactions,
}: {
  escrowTransactions: Awaited<
    ReturnType<typeof getEscrowTransactionsByBuyerWallet>
  >;
}) {
  const { refundBuyer, releasePayment } = useEscrow();

  const handleRefund = async (transactionId: number) => {
    const escrowAddress = escrowTransactions.find(
      (transaction) => transaction.id === transactionId
    )?.escrow_address;
    await refundBuyer(escrowAddress!, transactionId);
  };

  const handleReleasePayment = async (transactionId: number) => {
    const escrowAddress = escrowTransactions.find(
      (transaction) => transaction.id === transactionId
    )?.escrow_address;
    await releasePayment(escrowAddress!, transactionId);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">FOB Shipment Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Shipments</CardTitle>
          <CardDescription>
            Track your FOB shipments and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shipment ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Carrier</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {escrowTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>ORD-{transaction.fob_shipments?.id}</TableCell>
                  <TableCell>{transaction.fob_shipments?.title}</TableCell>
                  <TableCell >{transaction.seller_wallet}</TableCell>
                  <TableCell >{transaction.carrier_wallet}</TableCell>
                  <TableCell>{transaction.amount} ETH</TableCell>
                  <TableCell>{transaction.status}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
                        transaction.status!
                      )}`}
                    >
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {transaction.status === "LoadedOnBoard" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReleasePayment(transaction.id)}
                      >
                        <Check className="mr-2 h-4 w-4" /> Release Payment
                      </Button>
                    ) : transaction.status === "Completed" ? (
                      <Button size="sm" variant="outline" disabled>
                        <Ship className="mr-2 h-4 w-4" /> Delivered
                      </Button>
                    ) : transaction.status === "Refunded" ? (
                      <Button size="sm" variant="outline" disabled>
                        <X className="mr-2 h-4 w-4" /> Refunded
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRefund(transaction.id)}
                      >
                        <X className="mr-2 h-4 w-4" /> Request Refund
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


function getStatusColor(status: EscrowStatus) {
  switch (status) {
    case "Created":
      return "bg-blue-100 text-blue-800";
    case "ExportCleared":
      return "bg-yellow-100 text-yellow-800";
    case "LoadedOnBoard":
      return "bg-purple-100 text-purple-800";
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Refunded":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
