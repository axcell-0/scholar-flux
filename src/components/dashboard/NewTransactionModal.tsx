"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

type NewTransactionModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export function NewTransactionModal({ open, onClose, onCreated }: NewTransactionModalProps) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
    date: new Date().toISOString().slice(0, 10),
    note: "",
  });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { showToast } = useToast(); // ✅ get showToast from context

  if (!open) return null;

    const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.amount || !form.category || !form.date) {
      setError("Please fill in amount, category, and date.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...form,
            amount: parseFloat(form.amount),
        }),
      });

        const data = await res.json();

        if (!res.ok || !data.success) {
          showToast(data?.message || "Failed to create transaction.", "error");
        setError(data.message || "Failed to create transaction.");
        return;
      }
        showToast("Transaction created successfully!", "success");

        setForm({
      title: "",
      amount: "",
      type: "expense",
      category: "",
      date: new Date().toISOString().slice(0, 10),
      note: "",
    });
        onClose();
        onCreated();
  } catch (err) {
      console.error(err);
        showToast("An error occurred while creating the transaction.", "error");
    setError("An error occurred while creating the transaction.");
     } finally {
        setLoading(false);
     }
    };

      return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-surface rounded-2xl shadow-xl border border-outline-variant/40 p-5 md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base md:text-lg font-headline font-semibold text-on-surface">
              New Transaction
            </h2>
            <p className="text-xs text-outline">
              Add an income or expense for your budget.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant/40"
          >
            <span className="material-symbols-outlined text-on-surface text-base">
              close
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-outline uppercase tracking-widest">
                Amount
              </label>
              <input
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                placeholder="e.g. 3000"
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl py-2.5 px-3 text-sm text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-outline uppercase tracking-widest">
                Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl py-2.5 px-3 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-outline uppercase tracking-widest">
              Category
            </label>
            <input
              name="category"
              type="text"
              value={form.category}
              onChange={handleChange}
              placeholder="Food, Transport, Books..."
              className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl py-2.5 px-3 text-sm text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-outline uppercase tracking-widest">
              Date
            </label>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl py-2.5 px-3 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-outline uppercase tracking-widest">
              Note (optional)
            </label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Short description, e.g. 'Taxi to campus'"
              className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 text-sm text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
              rows={3}
            />
          </div>

          {error && (
            <p className="text-xs text-error font-medium">{error}</p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-medium text-outline hover:text-on-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 rounded-full signature-gradient text-white text-xs font-bold font-headline shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
