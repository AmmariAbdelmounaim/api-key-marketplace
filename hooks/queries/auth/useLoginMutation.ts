import { useMutation } from '@tanstack/react-query';

export type LoginPayload = {
  walletAddress: string;
  signature: string;
  nonce: string;
};

export type LoginResponse = {
  success: boolean;
  user: any; // Adjust to a stricter type if needed.
};

export function useLoginMutation() {
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: async (payload: LoginPayload) => {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error logging in: ${errorText}`);
      }
      return response.json();
    },
  });
} 