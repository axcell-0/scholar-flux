"use client";

import { useEffect, useState } from "react";
import { NewHabitModal } from "./NewHabitModal";

type HabitSummary = {
  id: string;
  name: string;
  targetFrequency: "daily" | "weekly";
  completedToday: boolean;
  streak: number;
};

export function HabitsPageClient() {
  const [habits, setHabits] = useState<HabitSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/habits");
      const data = await res.json();
      if (res.ok && data.success) {
        setHabits(data.habits || []);
      }
    } catch (error) {
      console.error("Failed to load habits", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const toggleHabit = async (id: string) => {
    try {
      const res = await fetch(`/api/habits/${id}`, {
        method: "PATCH",
      });
      if (res.ok) {
        await loadHabits();
      }
    } catch (error) {
      console.error("Failed to toggle habit", error);
    }
  };

  return (
    <>
      <div className="bg-surface-container-low rounded-2xl p-4 md:p-5 border border-outline-variant/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm md:text-base font-headline font-semibold text-on-surface">
              Your Habits
            </h2>
            <p className="text-xs text-outline">
              Tap a habit to mark today as done and maintain your streak.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 text-xs font-medium text-primary hover:underline underline-offset-4"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            New Habit
          </button>
        </div>

        {loading && (
          <p className="text-xs text-outline">Loading habits...</p>
        )}

        {!loading && habits.length === 0 && (
          <p className="text-xs text-outline">
            You have no habits yet. Click &quot;New Habit&quot; to create one.
          </p>
        )}

        <div className="space-y-3 mt-2">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="flex items-center justify-between gap-3 bg-white/60 rounded-xl px-3 py-3 border border-outline-variant/30"
            >
              <div>
                <p className="text-sm font-semibold text-on-surface">
                  {habit.name}
                </p>
                <p className="text-[11px] text-outline mt-0.5">
                  Streak: {habit.streak} days ·{" "}
                  {habit.targetFrequency === "daily" ? "Daily" : "Weekly"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleHabit(habit.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest ${
                  habit.completedToday
                    ? "bg-secondary/10 text-secondary"
                    : "bg-outline-variant/30 text-outline"
                }`}
              >
                {habit.completedToday ? "Done" : "Mark"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <NewHabitModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={loadHabits}
      />
    </>
  );
}