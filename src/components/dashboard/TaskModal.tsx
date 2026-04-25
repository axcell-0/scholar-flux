"use client";

import { useState } from "react";

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
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to create task.");
        return;
      }

      onClose();
      window.location.reload();
    } catch (err) {
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
        className="w-full max-w-md bg-surface rounded-2xl shadow-xl border border-[#c7c4d8]/40 p-5 md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base md:text-lg font-headline font-semibold text-[#eaf1ff]">
              New Task
            </h2>
            <p className="text-xs text-[#777587]">
              Add a study task or assignment to your planner.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center border border-[#c7c4d8]/40"
          >
            <span className="material-symbols-outlined text-[#eaf1ff] text-base">
              close
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#777587] uppercase tracking-widest">
              Title
            </label>
            <input
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Revise chapter 3..."
              className="w-full bg-[#eff4ff] border border-[#c7c4d8]/40 rounded-xl py-2.5 px-3 text-sm text-[#eaf1ff] placeholder:text-[#777587]/50 focus:ring-2 focus:ring-[#3525cd]/20 focus:[#777587]-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#777587] uppercase tracking-widest">
              Course
            </label>
            <input
              name="course"
              type="text"
              value={form.course}
              onChange={handleChange}
              placeholder="CSC 305 – Database Systems"
              className="w-full bg-[#eff4ff] border border-[#c7c4d8]/40 rounded-xl py-2.5 px-3 text-sm text-[#eaf1ff] placeholder:text-[#777587]/50 focus:ring-2 focus:ring-[#3525cd]/20 focus:[#777587]-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#777587] uppercase tracking-widest">
                Due date
              </label>
              <input
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full bg-[#eff4ff] border border-[#c7c4d8]/40 rounded-xl py-2.5 px-3 text-sm text-[#eaf1ff] placeholder:text-[#777587]/50 focus:ring-2 focus:ring-[#3525cd]/20 focus:[#777587]-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#777587] uppercase tracking-widest">
                Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full bg-[#eff4ff] border border-[#c7c4d8]/40 rounded-xl py-2.5 px-3 text-sm text-[#eaf1ff] focus:ring-2 focus:ring-[#3525cd]/20 focus:[#777587]-none"
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
              className="text-xs font-medium text-[#777587] hover:text-[#eaf1ff]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 rounded-full signature-gradient text-white text-xs font-bold font-headline shadow-lg shadow-[#3525cd]/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Save Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}