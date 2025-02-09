"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Check, X } from "lucide-react";
import { Tables } from "@/database.types";
import { useEscrowConfirm } from "@/hooks/useEscrowConfirm";
import { useEscrowRefund } from "@/hooks/useEscrowRefund";

export default function BuyerDashboard({ escrowTransactions }: { escrowTransactions: Tables<"escrow_transactions">[] }) {
    const { confirmDelivery } = useEscrowConfirm();
    const { refund } = useEscrowRefund();
    const handleConfirmDelivery = async (transactionId: number) => {
      const escrowAddress = escrowTransactions.find(transaction => transaction.id === transactionId)?.escrow_address;
      await confirmDelivery(escrowAddress!, transactionId);
    }

    const handleRefund = async (transactionId: number) => {
      const escrowAddress = escrowTransactions.find(transaction => transaction.id === transactionId)?.escrow_address;
      await refund(escrowAddress!, transactionId);
    }

    return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Buyer Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Purchases</CardTitle>
          <CardDescription>
            API keys you've bought and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {escrowTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>ORD-{transaction.id}</TableCell>
                  <TableCell>API-{transaction.api_key_id}</TableCell>
                  <TableCell>{transaction.seller_wallet}</TableCell>
                  <TableCell>{transaction.amount} ETH</TableCell>
                  <TableCell>{transaction.status}</TableCell>
                  <TableCell>
                    {transaction.status === "DELIVERED" ? (
                      <Button size="sm" variant="outline" onClick={() => handleConfirmDelivery(transaction.id)}>
                        <Check className="mr-2 h-4 w-4" /> Confirm
                      </Button>
                    ) : transaction.status === "COMPLETED" ? (
                      <Button size="sm" variant="outline">
                        <Check className="mr-2 h-4 w-4" /> Completed
                      </Button>
                    ) : transaction.status === "REFUNDED" ? (
                      <Button size="sm" variant="outline">
                        <X className="mr-2 h-4 w-4" /> Refunded
                      </Button>
                    ) : (
                      <Button size="sm" variant="destructive" onClick={() => handleRefund(transaction.id)}>
                        <X className="mr-2 h-4 w-4" /> Refund
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
