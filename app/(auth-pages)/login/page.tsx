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
import { Wallet } from "lucide-react";
import { ethers } from "ethers";

export default function AuthPage() {
  const { toast } = useToast();

  const handleConnectWallet = async () => {
    if ((!window as any).ethereum) {
      toast({
        title: "MetaMask not installed",
        description: "Please install MetaMask to continue",
        variant: "destructive",
      });
      return;
    }

    const provider = new ethers.BrowserProvider((window as any).ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const walletAddress = await signer.getAddress();

    const response = await fetch("/api/nonce", {
      method: "POST",
      body: JSON.stringify({ walletAddress }),
    });
    const { nonce } = await response.json();
    const signature = await signer.signMessage(nonce);
    const loginResponse = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ walletAddress, signature, nonce }),
    });
    const { success, user } = await loginResponse.json();
    if (success) {
      toast({
        title: "Login successful",
        description: "You have been logged in",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>Connect your wallet to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            Click the button below to connect your MetaMask wallet and sign a
            message to authenticate.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleConnectWallet}>
            <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
