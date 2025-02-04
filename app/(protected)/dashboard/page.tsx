"use client"; // mark this as a client component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedPage() {
  // Local state for storing user session info
  const [userInfo, setUserInfo] = useState<any>(null);
  const router = useRouter();

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
      const res = await fetch("/api/logout", {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Logout failed");
      }
      const data = await res.json();
      if (data.success) {
        console.log("Logged out successfully");
        // Redirect the user after logout; change '/login' to your desired route
        router.push("/login");
      }
    } catch (error) {
      console.error("Error logging out:", error);
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
