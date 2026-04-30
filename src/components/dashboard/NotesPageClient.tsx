"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { NewNoteModal } from "./NewNoteModal";
import { Trash2 } from "lucide-react";

type Note = {
  _id: string;
  title: string;
  course?: string;
  content: string;
  pinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export function NotesPageClient() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  //New: selected note + AI summary state
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/notes", { credentials: "include" });
        const data = await res.json();
        if (!res.ok || !data.success) {
          showToast(data?.message || "Failed to load notes.", "error");
          return;
        }
        setNotes(data.notes);
        // pick first note as selected by default
        if (data.notes.length>0) {
          setSelectedNote(data.notes[0]);
        }
      } catch (err) {
        console.error(err);
        showToast("Failed to load notes.", "error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [showToast]);

  const handleNoteCreated = (note: Note) => {
    setNotes((prev) => [note, ...prev]);
    setSelectedNote(note); // show the new note immediately
  };

  const handleNoteUpdated = (note: Note) => {
    setNotes((prev) =>
      prev.map((n) => (n._id === note._id ? note : n))
    );
    setSelectedNote((prev) => (prev && prev._id === note._id ? note : prev));
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm("Delete this note?")) return;

    try {
      const res = await fetch("/api/notes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data?.message || "Failed to delete note.", "error");
        return;
      }

      showToast("Note deleted.");
      setNotes((prev) => prev.filter((n) => n._id !== id));

      setSelectedNote((prev) => {
        if (!prev || prev._id !==id) return prev;
        const remaining = notes.filter((n) => n._id !== id);
        return remaining[0] ?? null;
      })
    } catch (err) {
      console.error(err);
      showToast("Something went wrong. Please try again.", "error");
    }
  };

  const handleSummarize = async () => {
    if (!selectedNote) return;

    setSummaryLoading(true);
    setSummaryError(null);
    setSummary(null);
    
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ content: selectedNote.content}),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to summarize note.");
      }

      const data = await res.json();
      setSummary(data.summary);
    } catch (err: any) {
      console.error(err);
      setSummaryError(err.message || "Something went wrong.");
      showToast("AI summary failed. Please try again.", "error");
    } finally {
      setSummaryLoading(false);
    }
  }

 return (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-headline text-on-surface">
        Your notes
      </h2>
      <button
        onClick={() => setOpenModal(true)}
        className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-on-primary shadow-sm hover:bg-primary/90"
      >
        <span className="material-symbols-outlined text-base mr-1">
          add
        </span>
        New note
      </button>
    </div>

    {loading ? (
      <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-6 text-sm text-on-surface-variant">
        Loading notes...
      </div>
    ) : notes.length === 0 ? (
      <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-6 text-center space-y-2">
        <p className="text-sm font-headline text-on-surface">
          No notes yet
        </p>
        <p className="text-xs text-on-surface-variant">
          Use notes to capture quick summaries after a study session so you
          don’t have to reread entire chapters.
        </p>
        <button
          onClick={() => setOpenModal(true)}
          className="mt-2 inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-on-primary hover:bg-primary/90"
        >
          + Add your first note
        </button>
      </div>
    ) : (
      <div className="grid gap-4 lg:grid-cols-[1.4fr,2fr]">
        {/* LEFT: notes list */}
        <div className="space-y-3">
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-3 max-h-[480px] overflow-auto space-y-3">
            {notes.map((note) => {
              const isSelected = selectedNote?._id === note._id;
              return (
                <article
                  key={note._id}
                  onClick={() => {
                    setSelectedNote(note);
                    setSummary(null);
                    setSummaryError(null);
                  }}
                  className={`rounded-xl border p-3 flex flex-col gap-2 cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-outline-variant/30 bg-surface"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-headline text-on-surface">
                        {note.title}
                      </h3>
                      {note.course && (
                        <p className="text-[10px] text-on-surface-variant mt-0.5">
                          {note.course}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingNote(note);
                        }}
                        className="text-[10px] text-on-surface-variant hover:text-primary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note._id);
                        }}
                        className="text-[10px] text-error hover:text-error/80"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-on-surface-variant line-clamp-3 whitespace-pre-line">
                    {note.content}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        {/* RIGHT: selected note + AI summary */}
        <div className="space-y-3">
          {selectedNote ? (
            <>
              <div className="rounded-2xl border border-outline-variant/30 bg-surface p-4 space-y-2 max-h-[260px] overflow-auto">
                <h3 className="text-sm font-headline text-on-surface">
                  {selectedNote.title}
                </h3>
                {selectedNote.course && (
                  <p className="text-[11px] text-on-surface-variant">
                    {selectedNote.course}
                  </p>
                )}
                <p className="text-xs text-on-surface-variant whitespace-pre-wrap mt-2">
                  {selectedNote.content}
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleSummarize}
                  disabled={summaryLoading}
                  className="w-full inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-medium text-on-primary shadow-sm hover:bg-primary/90 disabled:opacity-60"
                >
                  {summaryLoading ? "Summarizing..." : "Summarize with AI"}
                </button>

                {summaryError && (
                  <p className="text-[11px] text-error">
                    {summaryError}
                  </p>
                )}

                {summary && (
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3 max-h-[260px] overflow-auto">
                    <h4 className="text-[11px] font-semibold text-primary mb-1">
                      AI Summary
                    </h4>
                    <p className="text-xs text-on-surface whitespace-pre-wrap">
                      {summary}
                    </p>
                  </div>
                )}

                {!summary && !summaryLoading && !summaryError && (
                  <p className="text-[11px] text-on-surface-variant">
                    Select a note from the list and click “Summarize with
                    AI” to generate a quick explanation and key points.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-4 text-xs text-on-surface-variant">
              Select a note on the left to view it and generate a summary.
            </div>
          )}
        </div>
      </div>
    )}

    {openModal && (
      <NewNoteModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreated={handleNoteCreated}
        mode="create"
      />
    )}
    {editingNote && (
      <NewNoteModal
        open={true}
        onClose={() => setEditingNote(null)}
        onCreated={handleNoteCreated}
        initialNote={editingNote}
        mode="edit"
        onUpdated={handleNoteUpdated}
      />
     )
    }
  </div>
 );
}