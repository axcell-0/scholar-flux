"use client";

import { useEffect, useState } from "react";

type HabitSummary = {
  id: string;
  name: string;
  targetFrequency: "daily" | "weekly";
  completedToday: boolean;
  streak: number;
};

export function HabitsPanel() {
  const [habits, setHabits] = useState<HabitSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHabits = async () => {
    try {
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

  if (loading) {
    return (
      <div className="bg-surface-container-low rounded-2xl p-4 md:p-5 border border-outline-variant/30">
        <p className="text-xs text-outline">Loading habits...</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-low rounded-2xl p-4 md:p-5 border border-outline-variant/30">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm md:text-base font-headline font-semibold text-on-surface">
            Habits Today
          </h2>
          <p className="text-xs text-outline">
            Small actions that protect your focus.
          </p>
        </div>
        {/* Later you can add a modal to create new habits */}
      </div>

      {habits.length === 0 && (
        <p className="text-xs text-outline">
          You have no habits yet. Start by adding one.
        </p>
      )}

      <div className="space-y-3">
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
                Streak: {habit.streak} days
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
  );
}