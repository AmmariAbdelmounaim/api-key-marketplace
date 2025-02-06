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
import { useNonceMutation } from "@/hooks/queries/auth/useNonceMutation";
import { useLoginMutation } from "@/hooks/queries/auth/useLoginMutation";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const { toast } = useToast();
  const { mutateAsync: getNonce } = useNonceMutation();
  const { mutateAsync: login } = useLoginMutation();
  const router = useRouter();
  const handleConnectWallet = async () => {
    if (!(window as any).ethereum) {
      toast({
        title: "MetaMask not installed",
        description: "Please install MetaMask to continue",
        variant: "destructive",
      });
      return;
    }

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      // Get a nonce from the server:
      const nonce = await getNonce(walletAddress);

      // Sign the nonce:
      const signature = await signer.signMessage(nonce);

      // Log in:
      const loginData = await login({ walletAddress, signature, nonce });
      if (loginData.success) {
        toast({
          title: "Login successful",
          description: "You have been logged in",
        });
        if(loginData?.user?.role === "BUYER") {
            router.push("/store");
        } else {
            router.push("/dashboard");
        }
      }
      
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: "An error occurred during authentication",
        variant: "destructive",
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
