"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to reset password");
        return;
      }

      setMessage("Password reset successfully!");

      setTimeout(() => {
        router.push("/?mode=login"); // 👈 better than /login (fits your app)
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <p className="p-6">Invalid or missing token.</p>;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow max-w-sm w-full space-y-4"
      >
        <h1 className="text-lg font-bold">Reset password</h1>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />

        {error && <p className="text-xs text-red-500">{error}</p>}
        {message && <p className="text-xs text-green-600">{message}</p>}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full py-2 rounded bg-primary text-white text-sm font-semibold disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>
    </main>
  );
}