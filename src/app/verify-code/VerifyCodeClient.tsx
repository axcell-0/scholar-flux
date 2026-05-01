"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

export default function VerifyCodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const { showToast } = useToast();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Submit triggered with:", { email, code });
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data?.message || "Invalid code.");
        return;
      }

      showToast("Email verified. You can now log in.", "success");
      router.push("/?mode=login&verified=true"); // Redirect to login page with a query param indicating verification success
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-on-surface-variant">
          Missing email. Please start from the signup page.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow max-w-sm w-full space-y-4"
      >
        <h1 className="text-lg font-bold font-headline">
          Check your email
        </h1>
        <p className="text-xs text-on-surface-variant">
          We sent a 6-digit verification code to <span className="font-semibold">{email}</span>.
          Enter it below. The code expires in 10 minutes.
        </p>

        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          className="w-full border rounded-lg px-3 py-2 text-center tracking-[0.45em] text-lg font-semibold"
          placeholder="••••••"
        />

        {error && <p className="text-xs text-error">{error}</p>}

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="w-full py-2 rounded-full bg-primary text-white text-sm font-semibold disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify email"}
        </button>

        <p className="text-[11px] text-on-surface-variant mt-2">
          Didn&apos;t receive a code? Check spam, or go back and sign up again.
        </p>
      </form>
    </main>
  );
}