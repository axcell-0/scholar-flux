import { NotesPageClient } from "@/components/dashboard/NotesPageClient";

export default function NotesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-surface">
          Study Notes
        </h1>
        <p className="text-sm text-on-surface-variant">
          Capture quick summaries and key points for your courses.
        </p>
      </div>

      <NotesPageClient />
    </div>
  );
}