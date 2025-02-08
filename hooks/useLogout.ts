import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useLogoutMutation } from './queries/auth/useLogoutMutation';

export function useLogout() {
  const { toast } = useToast();
  const router = useRouter();
  const { mutateAsync: logout } = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout();

      toast({
        title: "Logout successful",
        description: "You have been logged out",
      });

      router.push("/");
    } catch (error: any) {
      toast({
        title: "Logout Error",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  return { handleLogout };
} 