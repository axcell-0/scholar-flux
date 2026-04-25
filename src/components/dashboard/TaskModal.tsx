"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

type TaskModalProps = {
  open: boolean;
  onClose: () => void;
};

export function TaskModal({ open, onClose }: TaskModalProps) {
  const [form, setForm] = useState({
    title: "",
    course: "",
    dueDate: "",
    priority: "medium",
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

    if (!form.title || !form.course || !form.dueDate) {
      setError("Please fill in title, course, and due date.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // keep cookies in production
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        showToast(data?.message || "Failed to create task.", "error");
        setError(data?.message || "Failed to create task.");
        return;
      }

      // ✅ success path
      showToast("Task added to your planner.");
      onClose();
      // Ideally refetch tasks instead of full reload, but for now:
      window.location.reload();
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
            <h2 className="text-base md:text-lg font-headline font-semibold text-text-inverse-on-surface">
              New Task
            </h2>
            <p className="text-xs text-outline">
              Add a study task or assignment to your planner.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-outline-variant/40"
          >
            <span className="material-symbols-outlined text-outline text-base">
              close
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-outline uppercase tracking-widest">
              Title
            </label>
            <input
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Revise chapter 3..."
              className="w-full border border-outline-variant/40 rounded-xl py-2.5 px-3 text-sm text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-outline uppercase tracking-widest">
              Course
            </label>
            <input
              name="course"
              type="text"
              value={form.course}
              onChange={handleChange}
              placeholder="CSC 305 – Database Systems"
              className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl py-2.5 px-3 text-sm text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-outline uppercase tracking-widest">
                Due date
              </label>
              <input
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl py-2.5 px-3 text-sm text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-outline uppercase tracking-widest">
                Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl py-2.5 px-3 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="text-xs text-error font-medium">{error}</p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-medium text-on-surface hover:text-outline/60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 rounded-full signature-gradient text-white text-xs font-bold font-headline shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Save Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}