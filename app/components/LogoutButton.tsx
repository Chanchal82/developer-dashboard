
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Could not log out");
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setError("Logout failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={loading}
        onClick={handleLogout}
        className="rounded bg-gray-700 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Logging out..." : "Logout"}
      </button>

      {error && <p role="alert" className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
