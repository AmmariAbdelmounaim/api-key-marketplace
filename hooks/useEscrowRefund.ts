"use client";
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { updateEscrowTransactionStatusAction } from '@/actionts';
import { escrowAbi } from '@/utils/constants';

export function useEscrowRefund() {
  const { toast } = useToast();
  const router = useRouter();

  const refund = async (escrowAddress: string, transactionId: number) => {
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      // Create contract instance
      const escrowContract = new ethers.Contract(
        escrowAddress,
        escrowAbi,
        signer
      );

      // Call confirmDelivery
      const tx = await escrowContract.refundBuyer();

      toast({
        title: "Refunding",
        description: "Please wait for the transaction to be confirmed...",
      });

      // Wait for transaction to be mined
      await tx.wait();

      // Update transaction status in database
      await updateEscrowTransactionStatusAction(transactionId, "REFUNDED");

      toast({
        title: "Refunded",
        description: "The payment has been refunded to the buyer",
      });

      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to refund",
        variant: "destructive",
      });
    }
  };

  return { refund };
}