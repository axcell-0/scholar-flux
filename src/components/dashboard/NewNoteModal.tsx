"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

type NewNoteModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (note: any) => void;
  onUpdated?: (note: any) => void;
  initialNote?: any;
  mode?: "create" | "edit";
};

export function NewNoteModal({ open, onClose, onCreated, onUpdated, initialNote, mode = "create" }: NewNoteModalProps) {
  const [form, setForm] = useState({
    title: initialNote?.title ?? "",
    course: initialNote?.course ?? "",
    content: initialNote?.content ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { showToast } = useToast();

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.title || !form.content) {
      setError("Please add a title and some content.");
      setLoading(false);
      return;
    }

    try {
      const method = mode === "create" ? "POST" : "PUT";
      const body = 
      mode === "edit" ? initialNote? { ...form, id: initialNote._id } : form :form;

      const res = await fetch("/api/notes", {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const message = data?.message || "Failed to create note.";
        setError(message);
        showToast(message, "error");
        return;
      }

      if (mode === "edit") {
        showToast("Note updated.");
        onUpdated?.(data.note);
      } else {
        showToast("Note saved.");
        onCreated(data.note);
      }

      onClose();
    } catch (err) {
      console.error(err);
      const message = "Something went wrong. Please try again.";
      setError(message);
      showToast(message, "error");
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
              New note
            </h2>
            <p className="text-xs text-on-surface-variant">
              Capture key ideas right after you study.
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
              Title
            </label>
            <input
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Chapter 3 – Recursion summary"
              className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl py-2.5 px-3 text-sm text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-outline uppercase tracking-widest">
              Course (optional)
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

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-outline uppercase tracking-widest">
              Content
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={10}
              placeholder="Write a short summary in your own words..."
              className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl py-2.5 px-3 text-sm text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
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
              {loading ? "Saving..." : "Save note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}