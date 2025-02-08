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
import { Tables } from "@/database.types";
import { useSessionQuery } from "@/hooks/queries/auth/useSessionQuery";
import { useLogout } from "@/hooks/useLogout";
import { LogOut, Upload } from "lucide-react";

export default function SellerDashboard({ escrowTransactions }: { escrowTransactions: Tables<"escrow_transactions">[] }) {
  const { isLoading } = useSessionQuery();
  const { handleLogout } = useLogout();

  const handleLogoutClick = async () => {
    await handleLogout();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>
        <Button variant="outline" disabled={isLoading} onClick={handleLogoutClick}>
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
                <TableHead>API Key</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {escrowTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>API-{transaction.api_key_id}</TableCell>
                  <TableCell>{transaction.buyer_wallet}</TableCell>
                  <TableCell>{transaction.amount} ETH</TableCell>
                  <TableCell>
                    <Button size="sm">
                      <Upload className="mr-2 h-4 w-4" /> Upload Key
                    </Button>
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
