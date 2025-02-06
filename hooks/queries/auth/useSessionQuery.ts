import { useQuery } from '@tanstack/react-query';

export type SessionResponse = {
  session: any | null; // Adjust this type with your session data shape.
};

export function useSessionQuery() {
  return useQuery<SessionResponse, Error>({
    queryKey: ['session'],
    queryFn: async () => {
      const response = await fetch('/api/session');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error fetching session: ${errorText}`);
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes, adjust as needed.
  });
} 