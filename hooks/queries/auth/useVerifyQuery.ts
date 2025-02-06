import { useQuery } from '@tanstack/react-query';

export type VerifyResponse = {
  success?: boolean;
  decoded?: any;
  error?: string;
};

export function useVerifyQuery() {
  return useQuery<VerifyResponse, Error>({
    queryKey: ['verify'],
    queryFn: async () => {
      const response = await fetch('/api/verify');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error verifying token: ${errorText}`);
      }
      return response.json();
    },
  });
} 