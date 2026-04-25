"use client";

import { useState } from "react";
import { IconInput } from "../ui/IconInput";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";

type LoginResponse = {
  success: boolean;
  message: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
    department: string;
    level?: string;
  };
};

export function LoginForm() {
  const router = useRouter();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    // basic client validation
    if (!form.email || !form.password) {
      const message = "Please enter both email and password.";
      setError(message);
      showToast(message, "error");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data: LoginResponse = await response.json();

      if (response.status === 401 || !data.success) {
        const message = data?.message || "Email or password is incorrect.";
        setError(message);
        showToast(message, "error");
        return;
      }

      if (!response.ok) {
        const message = "We couldn’t log you in. Please try again.";
        setError(message);
        showToast(message, "error");
        return;
      }

      const message = data.message || "Login successful.";
      setSuccess(message);
      showToast("Welcome back to Scholar Flux.");

      setForm({
        email: "",
        password: "",
      });

      setTimeout(() => {
        router.refresh();
        router.push("/dashboard");
      }, 500);
    } catch (error) {
      console.error(error);
      const message =
        "An error occurred during login. Please check your connection and try again.";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        label="Password"
        type="password"
        name="password"
        placeholder="••••••••"
        icon="lock"
        value={form.password}
        onChange={handleChange}
      />

      {error && (
        <p className="text-error text-sm font-medium">
          {error}
        </p>
      )}

      {success && (
        <p className="text-on-secondary text-sm font-medium">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-8 signature-gradient text-white rounded-full font-bold font-headline text-lg shadow-lg shadow-primary/20 active:scale-95 transition-all duration-300 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}