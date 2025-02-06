"use client"; // mark this as a client component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/hooks/queries/auth/useLogoutMutation";
import { useToast } from "@/hooks/use-toast";

export default function ProtectedPage() {
  // Local state for storing user session info
  const [userInfo, setUserInfo] = useState<any>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { mutateAsync: logout } = useLogoutMutation();

  useEffect(() => {
    // Fetch the session info on component mount
    fetch("/api/session")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized or session expired");
        }
        return res.json();
      })
      .then((data) => {
        console.log("User Info from session:", data.session);
        setUserInfo(data.session);
      })
      .catch((error) => {
        console.error("Error fetching session:", error);
      });
  }, []);

  // Handle logout by calling the logout API route
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been disconnected from your wallet",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        title: "Error logging out",
        description: error.message || "An error occurred while logging out",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h1>Protected Page</h1>
      {userInfo ? (
        <>
          <div>
            <h2>User Details:</h2>
            <pre>{JSON.stringify(userInfo, null, 2)}</pre>
          </div>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Loading session info... or you may not be logged in.</p>
      )}
    </div>
  );
}
