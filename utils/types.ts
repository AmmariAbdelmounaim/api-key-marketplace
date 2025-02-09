export type Session = {
  id: string;
  walletAddress: string;
  role: string;
};

export type EscrowStatus = "Created" | "ExportCleared" | "LoadedOnBoard" | "Completed" | "Refunded"