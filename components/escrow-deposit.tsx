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
import { Anchor, Ship, Package, Building2 } from "lucide-react";
import { useEscrow } from "@/hooks/useEscrow";
import { Tables } from "@/database.types";
import { getFobShipmentById } from "@/data/fob-shipments";

export default function EscrowDeposit({
  shipment,
}: {
  shipment: Awaited<ReturnType<typeof getFobShipmentById>>;
}) {
  const { createDeposit } = useEscrow();

  const handleDeposit = async () => {
    await createDeposit(shipment);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        FOB Escrow: Shipment {shipment.id}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipment Details</CardTitle>
            <CardDescription>
              Information about the FOB shipment you're purchasing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  Cargo Title:
                </span>
                <span className="font-medium">{shipment.title}</span>
              </div>

              <div className="flex items-center justify-between border-b pb-2">
                <span className="flex items-center">
                  <Ship className="mr-2 h-4 w-4" />
                  Port of Loading:
                </span>
                <span className="font-medium">{shipment.port_of_loading}</span>
              </div>

              <div className="flex items-center justify-between border-b pb-2">
                <span className="flex items-center">
                  <Building2 className="mr-2 h-4 w-4" />
                  Seller ID:
                </span>
                <span
                  className="font-medium truncate max-w-[200px]"
                  title={shipment.seller_id}
                >
                  {shipment.seller_id}
                </span>
              </div>

              <div className="flex items-center justify-between border-b pb-2">
                <span className="flex items-center">
                  <Ship className="mr-2 h-4 w-4" />
                  Carrier ID:
                </span>
                <span
                  className="font-medium truncate max-w-[200px]"
                  title={shipment.carrier_id}
                >
                  {shipment.carrier_id}
                </span>
              </div>

              <div className="mt-4 p-4 bg-muted rounded-lg">
                <Label className="mb-2 block">Cargo Description:</Label>
                <p className="text-sm">{shipment.cargo_description}</p>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Export Declaration Ref:</span>
                  <span className="font-mono">
                    {shipment.export_declaration_ref}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Bill of Lading Ref:</span>
                  <span className="font-mono">
                    {shipment.bill_of_lading_ref}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle>FOB Payment Escrow</CardTitle>
              <CardDescription>
                Deposit ETH to initiate the FOB escrow process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (ETH)</Label>
                  <Input
                    id="amount"
                    disabled
                    defaultValue={shipment.fob_price?.toString() ?? ""}
                    className="font-mono"
                  />
                  <p className="text-sm text-muted-foreground">
                    This amount will be held in escrow until the FOB conditions
                    are met
                  </p>
                </div>
              </div>
            </CardContent>
          </div>
          <CardFooter>
            <Button onClick={handleDeposit} className="w-full">
              <Anchor className="mr-2 h-4 w-4" /> Initiate FOB Escrow
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
