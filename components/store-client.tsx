"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Ship, LogOut, Anchor } from "lucide-react";
import { useSessionQuery } from "@/hooks/queries/auth/useSessionQuery";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tables } from "@/database.types";
import { useLogout } from "@/hooks/useLogout";

interface StoreClientProps {
  shipments: Tables<"fob_shipments">[];
}

export default function StoreClient({ shipments }: StoreClientProps) {
  const { isLoading } = useSessionQuery();
  const { handleLogout } = useLogout();
  const router = useRouter();

  const handleLogoutClick = async () => {
    await handleLogout();
  };

  return (
    <div className="container mx-auto p-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">FOB Shipment Marketplace</h1>
        </div>
        {!isLoading && (
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/buyer-dashboard">
                <Ship className="mr-2 h-4 w-4" />
                My Shipments
              </Link>
            </Button>

            <Button
              disabled={isLoading}
              onClick={handleLogoutClick}
              variant="outline"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shipments.map((shipment) => (
          <Card key={shipment.id}>
            <CardHeader>
              <CardTitle>{shipment.title}</CardTitle>
              <CardDescription>{shipment.cargo_description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm font-medium">
                Port of Loading: {shipment.port_of_loading}
              </p>
              <p className="text-lg font-bold">
                FOB Price: {shipment.fob_price} ETH
              </p>
              <p className="text-xs text-muted-foreground">
                Export Declaration: {shipment.export_declaration_ref}
              </p>
              <p className="text-xs text-muted-foreground">
                Bill of Lading: {shipment.bill_of_lading_ref}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => router.push(`/escrow/${shipment.id}`)}
                className="w-full"
              >
                <Anchor className="mr-2 h-4 w-4" /> Purchase Shipment
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
