"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/auth/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data?.message || "Failed to send reset link.");
        return;
      }

      const msg =
        data.message ||
        "If this email exists, a reset link has been sent. Please check your inbox.";
      setMessage(msg);
      showToast(msg, "success");

      // Optionally send them back to login after a delay
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur p-6 rounded-3xl shadow max-w-sm w-full space-y-4"
      >
        <h1 className="text-lg font-bold font-headline text-[#080b13]">
          Reset your password
        </h1>
        <p className="text-xs text-[#33313f]">
          Enter the email you used for Scholar Flux. We will send you a reset link.
        </p>

        <input
          type="email"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="text-xs text-error">{error}</p>}
        {message && <p className="text-xs text-on-secondary">{message}</p>}

        <button
          type="submit"
          disabled={loading || !email}
          className="w-full py-2 rounded-full bg-primary text-white text-sm font-semibold disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>
    </main>
  );
}