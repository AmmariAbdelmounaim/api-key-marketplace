"use client";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { DollarSign } from "lucide-react";
import { useEscrowDeposit } from "@/hooks/useEscrowDeposit";

export default function EscrowDeposit({
  apiKey,
}: {
  apiKey: {
    created_at: string;
    description: string | null;
    id: number;
    key: string | null;
    price: number | null;
    seller_id: string | null;
    title: string | null;
    seller: {
      wallet_address: string | null;
    } | null;
  };
}) {
  const { createDeposit } = useEscrowDeposit();

  const handleDeposit = async () => {
    await createDeposit(apiKey);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Escrow: API Key {apiKey.id}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API Key Details</CardTitle>
            <CardDescription>
              Information about the API key you're purchasing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>API Key ID:</span>
                <span>{apiKey.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Price:</span>
                <span>{apiKey?.price} ETH</span>
              </div>
              <div className="flex justify-between">
                <span>Seller:</span>
                <span>{apiKey?.seller?.wallet_address}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Deposit ETH</CardTitle>
            <CardDescription>
              Deposit ETH to start the escrow process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (ETH)</Label>
                <Input id="amount" disabled defaultValue={apiKey?.price!} />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleDeposit} className="w-full">
              <DollarSign className="mr-2 h-4 w-4" /> Deposit ETH
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
