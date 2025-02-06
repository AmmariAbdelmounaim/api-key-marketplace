import { useMutation } from '@tanstack/react-query';

export function useLogoutMutation() {
  return useMutation<boolean, Error, void>({
    mutationFn: async () => {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error logging out: ${errorText}`);
      }

      return true;
    },
  });
} 