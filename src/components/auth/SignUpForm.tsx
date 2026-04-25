"use client";

import { useState } from "react";
import { IconInput } from "../ui/IconInput";

type RegisterResponse= {
  success: boolean;
  message: string;
  user?: {
    id: string;
    fullname: string;
    email: string;
  };
};

export function SignUpForm() {
  const [form, setForm] = useState({
    fullName: "",
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

    try{
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data: RegisterResponse = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed. Please try again.");
        return;
      }

      setSuccess(data.message || "Account created successfully! You can now log in.");
      setForm({
        fullName: "",
        email: "",
        password: "",
      });
    }
    catch (err) {
      setError("Something went wrong. Please try again later.");
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
        <p className="text-sm text-red-600 font-medium">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-green-600 font-medium">
          {success}
        </p>
      )}
      <button
        type="submit"
        className="w-full py-4 px-8 signature-gradient text-white rounded-full font-bold font-headline text-lg shadow-lg shadow-[#3525cd]/20 active:scale-95 transition-all duration-300 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Creating Account..." : "Begin Session"}
      </button>
    </form>
  );
}