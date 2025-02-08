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
import { useToast } from "@/hooks/use-toast";
import { Key, LogOut, ShoppingCart } from "lucide-react";
import { useSessionQuery } from "@/hooks/queries/auth/useSessionQuery";
import { useLogoutMutation } from "@/hooks/queries/auth/useLogoutMutation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tables } from "@/database.types";
interface StoreClientProps {
  apiKeys: Tables<"api_keys">[];
}

export default function StoreClient({ apiKeys }: StoreClientProps) {
  const { toast } = useToast();
  const { data, isLoading } = useSessionQuery();
  const { mutateAsync: logout } = useLogoutMutation();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();

      toast({
        title: "Logout successful",
        description: "You have been logged out",
      });

      router.push("/");
    } catch (error: any) {
      toast({
        title: "Logout Error",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">API Key Marketplace</h1>
        </div>
        {data?.session && (
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/buyer-dashboard">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>

            <Button
              disabled={data?.session && isLoading}
              onClick={handleLogout}
              variant="outline"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apiKeys.map((apiKey) => (
          <Card key={apiKey.id}>
            <CardHeader>
              <CardTitle>{apiKey.title}</CardTitle>
              <CardDescription>{apiKey.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Price: {apiKey.price} ETH</p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => router.push(`/escrow/${apiKey.id}`)}
                className="w-full"
              >
                <Key className="mr-2 h-4 w-4" /> Buy API Key
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
