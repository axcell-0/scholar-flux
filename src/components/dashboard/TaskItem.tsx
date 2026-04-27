"use client";

type TaskItemProps = {
  task: {
    _id: string;
    title: string;
    course: string;
    status: "pending" | "in-progress" | "completed";
    priority?: "low" | "medium" | "high";
    dueDate?: string;
  };
};

export function TaskItem({ task }: TaskItemProps) {
  const handleMarkDone = async () => {
    try {
      const response = await fetch(`/api/tasks/${task._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "completed" }),
      });

      if (!response.ok) {
        console.error("Failed to update task");
        return;
      }

      // simplest option for now: full reload
      window.location.reload();
    } catch (error) {
      console.error("Error marking task done:", error);
    }
  };

  const dueDateText = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No date";

  return (
    <div className="flex items-start justify-between gap-3 bg-white/60 rounded-xl px-3 py-3 border border-outline-variant/30">
      <div className="flex-1">
        <p className="text-sm font-semibold text-on-surface">
          {task.title}
        </p>
        <p className="text-[11px] font-medium text-outline mt-0.5">
          {task.course} · Due {dueDateText}
        </p>
        <p className="text-[11px] text-outline mt-1">
          Status: {task.status}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest ${
            task.priority === "high"
              ? "bg-error/10 text-error"
              : task.priority === "medium"
              ? "bg-secondary/10 text-secondary"
              : "bg-outline-variant/40 text-outline"
          }`}
        >
          {task.priority?.toUpperCase() ?? "MEDIUM"}
        </span>

        {task.status !== "completed" && (
          <button
            type="button"
            onClick={handleMarkDone}
            className="text-[11px] font-medium text-primary hover:underline underline-offset-4"
          >
            Mark done
          </button>
        )}
        
      </div>
    </div>
  );
}