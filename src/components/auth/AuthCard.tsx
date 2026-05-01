"use client";

import { useState, useEffect } from "react";
import { AuthTabs } from "./AuthTabs";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";
import { SocialButtons } from "./SocialButtons";
import { useSearchParams } from "next/navigation";

type SignUpFormProps = {
  onSignupSuccess?: () => void;
};

export function AuthCard({ onSignupSuccess }: SignUpFormProps) {
  const [activeTab, setActiveTab] = useState<"signup" | "login">("signup");
  const searchParams = useSearchParams();

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "login") {
      setActiveTab("login");
    }
  }, [searchParams]);

  return (
    <section className="w-full max-w-120">
      <div className="bg-white/70 backdrop-blur-2xl p-8 md:p-12 rounded-4xl shadow-[0_40px_80px_-20px_rgba(11,28,48,0.1)] border border-white/50">
        <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mb-8">
          <h2 className="text-2xl font-bold font-headline text-[#080b13]">
            {activeTab === "signup" ? "Create an account" : "Welcome back"}
          </h2>
          <p className="text-sm text-[#33313f] mt-1 font-medium">
            {activeTab === "signup"
              ? "Enter your details to begin your journey."
              : "Log in to continue your focused journey."}
          </p>
        </div>

      {activeTab === "signup" ? (
          <SignUpForm onSignupSuccess={() => setActiveTab("login")} />
        ) : (
          <LoginForm />
        )}

        <div className="relative my-10 flex items-center">
          <div className="grow border-t border-outline-variant/30" />
          <span className="shrink mx-4 text-[10px] font-bold text-outline uppercase tracking-widest">
            social join
          </span>
          <div className="grow border-t border-outline-variant/30" />
        </div>

        <SocialButtons />

        <p className="text-center mt-10 text-xs text-outline font-medium">
          By continuing, you agree to the{" "}
          <a className="text-primary hover:underline underline-offset-4" href="#">
            Terms of Sanctuary
          </a>{" "}
          and{" "}
          <a className="text-primary hover:underline underline-offset-4" href="#">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </section>
  );
}