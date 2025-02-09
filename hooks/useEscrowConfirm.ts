"use client";
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { updateEscrowTransactionStatusAction } from '@/actionts';
import { escrowAbi } from '@/utils/constants';

export function useEscrowConfirm() {
  const { toast } = useToast();
  const router = useRouter();

  const confirmDelivery = async (escrowAddress: string, transactionId: number) => {
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
      const tx = await escrowContract.confirmDelivery();

      toast({
        title: "Confirming Delivery",
        description: "Please wait for the transaction to be confirmed...",
      });

      // Wait for transaction to be mined
      await tx.wait();

      // Call releasePayment
      const releaseTx = await escrowContract.releasePayment();
      await releaseTx.wait();

      // Update transaction status in database
      await updateEscrowTransactionStatusAction(transactionId, "COMPLETED");

      toast({
        title: "Delivery Confirmed",
        description: "The payment has been released to the seller",
      });

      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to confirm delivery",
        variant: "destructive",
      });
    }
  };

  return { confirmDelivery };
}