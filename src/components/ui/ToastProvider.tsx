"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

type ToastType = "success" | "error";

type ToastState = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let idCounter = 1;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    setToast({ id: idCounter++, message, type });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const bgClass =
    toast?.type === "error"
      ? "bg-error text-on-error"
      : "bg-primary text-on-primary";

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
          <div
            className={`max-w-sm w-full shadow-lg rounded-full ${bgClass} border border-outline-variant/40 px-4 py-2.5 flex items-center gap-2 text-sm`}
          >
            <span className="material-symbols-outlined text-base">
              {toast.type === "error" ? "error" : "check_circle"}
            </span>
            <span className="flex-1">{toast.message}</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}