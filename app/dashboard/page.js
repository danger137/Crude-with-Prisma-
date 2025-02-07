"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TodoApp from "../todo/page";
import "./dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/Login");
        return;
      }

      try {
        const res = await fetch("/api/verify-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (data.success) {
          setUser(data.user);
        } else {
          handleLogout(); // ✅ Invalid token to logout
        }
      } catch (error) {
        handleLogout();
      }
    };

    verifyUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout"); // ✅ Call logout API to remove cookie
      localStorage.removeItem("token"); // ✅ Remove from localStorage
      router.push("/Login"); // ✅ Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg text-center">
      <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name}!</h1>
      <p className="text-gray-600 mt-2">Your email: {user.email}</p>

      <div className="mt-4">
        <TodoApp />
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 mt-4"
      >
        Logout
      </button>
    </div>
  );
}
