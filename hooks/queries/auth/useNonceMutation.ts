import { useMutation } from '@tanstack/react-query';

export function useNonceMutation() {
  return useMutation<string, Error, string>({
    mutationFn: async (walletAddress: string) => {
      const response = await fetch('/api/nonce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error fetching nonce: ${errorText}`);
      }
      const data = await response.json();
      if (!data.nonce) {
        throw new Error('Nonce not returned');
      }
      return data.nonce;
    },
  });
} 