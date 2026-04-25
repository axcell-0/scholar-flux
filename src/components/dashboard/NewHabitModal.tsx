"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

type NewHabitModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export function NewHabitModal({ open, onClose, onCreated }: NewHabitModalProps) {
  const [form, setForm] = useState({
    name: "",
    targetFrequency: "daily",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

    const { showToast } = useToast(); // ✅ get showToast from context

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

    if (!form.name) {
      setError("Please enter a habit name.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast(data?.message || "Failed to create habit.", "error");
        setError(data.message || "Failed to create habit.");
        return;
      }
        showToast("Habit created successfully!", "success");

      setForm({ name: "", targetFrequency: "daily" });
      onClose();
      onCreated();
    } catch (err) {
      console.error(err);
        showToast("Something went wrong. Please try again.", "error");
      setError("Something went wrong. Please try again.");
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
              New Habit
            </h2>
            <p className="text-xs text-outline">
              Create a new routine to track daily or weekly.
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
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-outline uppercase tracking-widest">
              Habit name
            </label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Morning revision, 30 min exercise..."
              className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl py-2.5 px-3 text-sm text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-outline uppercase tracking-widest">
              Frequency
            </label>
            <select
              name="targetFrequency"
              value={form.targetFrequency}
              onChange={handleChange}
              className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl py-2.5 px-3 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
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
              {loading ? "Creating..." : "Save Habit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}