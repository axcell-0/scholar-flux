"use client";

import { useState } from "react";
import { TaskItem } from "./TaskItem";
import { TaskModal } from "./TaskModal";

type TasksPanelProps = {
  tasks: {
    _id: string;
    title: string;
    course: string;
    status: "pending" | "in-progress" | "completed";
    priority?: "low" | "medium" | "high";
    dueDate?: string;
  }[];
};

export function TasksPanel({ tasks }: TasksPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="bg-[#eff4ff] rounded-2xl p-4 md:p-5 border border-[#c7c4d8]/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm md:text-base font-headline font-semibold text-[#eaf1ff]">
              Today&apos;s Planner
            </h2>
            <p className="text-xs text-[#777587]">
              Keep track of upcoming study sessions and assignments.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="hidden md:inline-flex items-center gap-2 text-xs font-medium text-[#3525cd] hover:underline underline-offset-4"
          >
            <span className="material-symbols-outlined text-sm">
              add_circle
            </span>
            New Task
          </button>
        </div>

        <div className="space-y-3">
          {tasks.length === 0 && (
            <p className="text-xs text-[#777587]">
              You have no tasks yet. Start by adding one.
            </p>
          )}

          {tasks.map((task) => (
            <TaskItem key={task._id} task={task} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="mt-3 w-full md:hidden flex items-center justify-center gap-2 text-xs font-medium text-[#3525cd] border border-[#c7c4d8]/40 rounded-full py-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Task
        </button>
      </div>

      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}