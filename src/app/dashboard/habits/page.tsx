import { HabitsPageClient } from "@/components/dashboard/HabitsPageClient";

export default function HabitsPage() {
  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-xl font-headline font-bold text-on-surface">
            Habits
          </h1>
          <p className="text-xs md:text-sm text-outline">
            Track and maintain the routines that support your study life.
          </p>
        </div>
      </header>

      <HabitsPageClient />
    </div>
  );
}