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
  };

  const handleNoteUpdated = (note: Note) => {
    setNotes((prev) =>
      prev.map((n) => (n._id === note._id ? note : n))
    );
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
    } catch (err) {
      console.error(err);
      showToast("Something went wrong. Please try again.", "error");
    }
  };

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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {notes.map((note) => (
            <article
              key={note._id}
              className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-4 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-headline text-on-surface">
                    {note.title}
                  </h3>
                  {note.course && (
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      {note.course}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <button
                    onClick={() => setEditingNote(note)}
                    className="text-[11px] text-on-surface-variant hover:text-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="text-[11px] text-error hover:text-error/80"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant line-clamp-4 whitespace-pre-line">
                {note.content}
              </p>
            </article>
          ))}
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
        onClose={ () => setEditingNote(null)}
        onCreated={handleNoteCreated}
        initialNote={editingNote}
        mode="edit"
        onUpdated={handleNoteUpdated}
        />
      )}
    </div>
  );
}