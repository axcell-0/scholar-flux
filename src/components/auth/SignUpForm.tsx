"use client";

import { useState } from "react";
import { IconInput } from "../ui/IconInput";
import { useToast } from "@/components/ui/ToastProvider";
import { useRouter } from "next/navigation";

type RegisterResponse = {
  success: boolean;
  message: string;
  user?: {
    id: string;
    fullname: string;
    email: string;
  };
};

type SignUpFormProps = {
  onSignupSuccess?: () => void;
};

export function SignUpForm({ onSignupSuccess }: SignUpFormProps) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");

  const { showToast } = useToast();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess("");

    // simple client-side check
    if (!form.fullName || !form.email || !form.password) {
      const message = "Please fill in name, email, and password.";
      setError(message);
      showToast(message, "error");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          // department / level if needed
        }),
      });

      const data: RegisterResponse = await res.json();

      if (!res.ok || !data.success) {
        const message =
          data?.message ||
          (res.status === 409
            ? "This email is already registered."
            : "We couldn’t create your account.");
        setError(message);
        showToast(message, "error");
        return;
      }

      setSuccess("Account created successfully.");
      showToast("Account created. You can now log in.");

      // Clear password, keep email
      setForm((prev) => ({ ...prev, password: "" }));

      // Switch to login tab instead of redirecting
      onSignupSuccess?.();
    } catch (err) {
      console.error(err);
      const message = "Something went wrong. Please try again.";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <IconInput
        label="Full Name"
        name="fullName"
        placeholder="Julian Alexander"
        icon="person"
        value={form.fullName}
        onChange={handleChange}
      />

      <IconInput
        label="Email Address"
        type="email"
        name="email"
        placeholder="julian@scholarflux.edu"
        icon="mail"
        value={form.email}
        onChange={handleChange}
      />

      <IconInput
        label="Secure Password"
        type="password"
        name="password"
        placeholder="••••••••"
        icon="lock"
        value={form.password}
        onChange={handleChange}
      />

      {error && (
        <p className="text-sm text-error font-medium">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-on-secondary font-medium">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-8 signature-gradient text-white rounded-full font-bold font-headline text-lg shadow-lg shadow-primary/20 active:scale-95 transition-all duration-300 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Creating Account..." : "Begin Session"}
      </button>
    </form>
  );
}