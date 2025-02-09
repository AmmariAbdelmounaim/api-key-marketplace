"use client";
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { updateEscrowTransactionStatusAction, createEscrowTransactionAction } from '@/actionts';
import { fobFactoryAddress, fobFactoryAbi, fobEscrowAbi } from '@/utils/constants';
import { getFobShipmentById } from '@/data/fob-shipments';

export function useEscrow() {
  const { toast } = useToast();
  const router = useRouter();

  const createDeposit = async (
    shipment: Awaited<ReturnType<typeof getFobShipmentById>>
  ) => {
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      console.log(signer.getAddress());
      const factoryContract = new ethers.Contract(
        fobFactoryAddress,
        fobFactoryAbi,
        signer
      );

      const depositAmount = ethers.parseEther(shipment.fob_price!.toString()!);
      const tx = await factoryContract.createEscrow(
        // @ts-ignore
        shipment.seller!.wallet_address!,
        // @ts-ignore
        shipment.carrier!.wallet_address!,
        {
          value: depositAmount,
        }
      );

      toast({
        title: "Transaction Sent",
        description: "Waiting for confirmation...",
      });

      const receipt = await tx.wait();
      const event = receipt.logs.find((log: any) => {
        try {
          return log.eventName === "EscrowCreated";
        } catch {
          return false;
        }
      });

      if (event) {
        const escrowAddress = event.args.escrowAddress;
        await createEscrowTransactionAction(
          await signer.getAddress(),
          // @ts-ignore
          shipment.seller?.wallet_address!,
          // @ts-ignore
          shipment.carrier?.wallet_address!,
          shipment.id,
          shipment.fob_price!,
          "Created",
          escrowAddress
        );
        
        toast({
          title: "FOB Escrow Created",
          description: `Escrow contract deployed at ${escrowAddress}`,
        });
        
        router.push("/store");
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create FOB escrow contract",
        variant: "destructive",
      });
    }
  };

  // after the deposit is created, the seller can confirm the export clearance
  const confirmExportClearance = async (escrowAddress: string, transactionId: number) => {
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const escrowContract = new ethers.Contract(
        escrowAddress,
        fobEscrowAbi,
        signer
      );

      // Generate a random hash for the export declaration
      // In a real application, this should be the actual hash of the export declaration document
      const timestamp = Date.now().toString();
      const declarationHash = ethers.keccak256(ethers.toUtf8Bytes(timestamp));
      
      // Ensure the hash is passed as a bytes32 value
      const tx = await escrowContract.confirmExportClearance(declarationHash);

      toast({
        title: "Confirming Export Clearance",
        description: "Please wait for the transaction to be confirmed...",
      });

      await tx.wait();
      await updateEscrowTransactionStatusAction(transactionId, "ExportCleared");
      
      toast({
        title: "Export Clearance Confirmed",
        description: "The export clearance has been confirmed on the blockchain",
      });

    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to confirm export clearance",
        variant: "destructive",
      });
    }
  };

  const confirmLoadedOnBoard = async (escrowAddress: string, transactionId: number) => {
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const escrowContract = new ethers.Contract(
        escrowAddress,
        fobEscrowAbi,
        signer
      );

      // Generate a random hash for the bill of lading
      // In a real application, this should be the actual hash of the bill of lading document
      const timestamp = Date.now().toString();
      const billOfLadingHash = ethers.keccak256(ethers.toUtf8Bytes(timestamp));
      
      const tx = await escrowContract.confirmLoadedOnBoard(billOfLadingHash);

      toast({
        title: "Confirming Cargo Loading",
        description: "Please wait for the transaction to be confirmed...",
      });

      await tx.wait();
      await updateEscrowTransactionStatusAction(transactionId, "LoadedOnBoard");
      
      toast({
        title: "Cargo Loading Confirmed",
        description: "The cargo loading has been confirmed on the blockchain",
      });

    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to confirm cargo loading",
        variant: "destructive",
      });
    }
  };

  const releasePayment = async (escrowAddress: string, transactionId: number) => {
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const escrowContract = new ethers.Contract(
        escrowAddress,
        fobEscrowAbi,
        signer
      );

      const tx = await escrowContract.releasePayment();

      toast({
        title: "Releasing Payment",
        description: "Please wait for the transaction to be confirmed...",
      });

      await tx.wait();
      await updateEscrowTransactionStatusAction(transactionId, "Completed");
      
      toast({
        title: "Payment Released",
        description: "The payment has been released to the seller",
      });

    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to release payment",
        variant: "destructive",
      });
    }
  };
  
  const refundBuyer = async (escrowAddress: string, transactionId: number) => {
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const escrowContract = new ethers.Contract(
        escrowAddress,
        fobEscrowAbi,
        signer
      );

      const tx = await escrowContract.refundBuyer();

      toast({
        title: "Processing Refund",
        description: "Please wait for the transaction to be confirmed...",
      });

      await tx.wait();
      await updateEscrowTransactionStatusAction(transactionId, "Refunded");
      
      toast({
        title: "Refund Completed",
        description: "The funds have been refunded to the buyer",
      });

    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to process refund",
        variant: "destructive",
      });
    }
  };


  return { createDeposit, confirmExportClearance, confirmLoadedOnBoard, releasePayment, refundBuyer };
} 