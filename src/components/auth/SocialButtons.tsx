"use client";

import { useToast } from "@/components/ui/ToastProvider";


export function SocialButtons() {
  const { showToast } = useToast();

  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        onClick={() => showToast("Sign in with Google is coming soon.")}
        className="flex items-center justify-center gap-3 py-3 border border-outline-variant/40 rounded-xl hover:bg-surface-container transition-colors duration-300"
      >
        <img alt="Google" className="w-10 h-10" src="/google.jpg" />
        <span className="text-sm font-bold text-[#232830]">Google</span>
      </button>

      <button
        type="button"
        onClick={() => showToast("Sign in with Apple is coming soon.")}
        className="flex items-center justify-center gap-3 py-3 border border-outline-variant/40 rounded-xl hover:bg-surface-container transition-colors duration-300"
      >
        <img alt="Apple" className="w-10 h-10" src="/apple.png" />
        <span className="text-sm font-bold text-[#232830]">Apple</span>
      </button>
    </div>
  );
}