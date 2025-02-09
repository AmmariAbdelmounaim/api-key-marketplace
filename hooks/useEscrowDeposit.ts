"use client";
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast'; // Assuming this is your toast import
import { useRouter } from 'next/navigation';
import { factoryAbi, factoryAddress } from '@/utils/constants';
import { createEscrowTransactionAction } from '@/actionts';

export function useEscrowDeposit() {
  const { toast } = useToast();
  const router = useRouter();

  const createDeposit = async (
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
    }
  ) => {
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();


      // Create contract instance
      const factoryContract = new ethers.Contract(
        factoryAddress,
        factoryAbi,
        signer
      );

      // Convert price to Wei
      const depositAmount = ethers.parseEther(apiKey.price!.toString()!);

      // Create escrow with deposit
      const tx = await factoryContract.createEscrow(
        apiKey.seller?.wallet_address!,
        {
          value: depositAmount,
        }
      );

      toast({
        title: "Transaction Sent",
        description: "Waiting for confirmation...",
      });

      // Wait for transaction to be mined
      const receipt = await tx.wait();

      // More specific event finding
      const event = receipt.logs.find((log: any) => {
        try {
          return log.eventName === "EscrowCreated";
        } catch {
          return false;
        }
      });

      if (event) {
        try {
          // Get the escrow address from the event
          const escrowAddress = event.args.escrowAddress;
          await createEscrowTransactionAction(
            await signer.getAddress(),
            apiKey.seller?.wallet_address!,
            apiKey.id,
            apiKey.price!,
            "PENDING",
            escrowAddress
          );
          toast({
            title: "Escrow Created",
            description: `Escrow contract deployed at ${escrowAddress}`,
          });
          
          // Redirect to buyer dashboard
          router.push("/buyer-dashboard");
        } catch (error: any) {
          console.error(error);
          toast({
            title: "Error",
            description: "Something went wrong",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return { createDeposit };
} 