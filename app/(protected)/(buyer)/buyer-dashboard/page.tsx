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
import { Check, X } from "lucide-react";
import { getSession } from "@/lib/get-session";
import { getEscrowTransactionsByBuyerWallet } from "@/data/escrew-transactions";

export default async function BuyerDashboard() {
  const session = await getSession();
  const escrowTransactions = await getEscrowTransactionsByBuyerWallet(
    session?.walletAddress!
  );
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
                    {transaction.status === "PENDING" ? (
                      <Button size="sm" variant="outline">
                        <Check className="mr-2 h-4 w-4" /> Confirm
                      </Button>
                    ) : (
                      <Button size="sm" variant="destructive">
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
