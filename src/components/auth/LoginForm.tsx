"use client";

import { useState } from "react";
import { IconInput } from "../ui/IconInput";
import { useRouter } from "next/navigation";

type LoginResponse = {
  success : boolean;
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

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
    });

    const data: LoginResponse = await response.json();

    if (!response.ok) {
      setError(data.message || "Login failed.");
      return;
    }

    setSuccess(data.message || "Login successful.");

    console.log("Logged in user:", data.user);

      setForm({
        email: "",
        password: "",
      });
      setTimeout(() => {
        router.refresh();
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      setError("An error occurred during login. Please try again.");
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
        <p className="text-red-600 text-sm font-medium">
          {error}
        </p>
      )}

      {success && (
        <p className="text-green-600 text-sm font-medium">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-8 signature-gradient text-white rounded-full font-bold font-headline text-lg shadow-lg shadow-[#3525cd]/20 active:scale-95 transition-all duration-300 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}