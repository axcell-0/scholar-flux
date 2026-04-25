// app/dashboard/tasks/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { dbConnect } from "@/lib/mongodb";
import { verifyAuthToken } from "@/lib/auth";
import Task from "@/models/Task";
import { TasksPageClient } from "@/components/dashboard/TasksPageClient";

export default async function TasksPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/");

  const payload = verifyAuthToken(token);
  if (!payload) redirect("/");

  await dbConnect();

  const tasksRaw = await Task.find({
    userId: payload.userId,
  })
    .sort({ dueDate: 1, createdAt: -1 })
    .lean();

  const tasks = tasksRaw.map((t: any) => ({
    id: t._id.toString(),
    title: t.title,
    course: t.course,
    status: t.status as "pending" | "in-progress" | "completed",
    priority: (t.priority || "medium") as "low" | "medium" | "high",
    dueDate: t.dueDate ? new Date(t.dueDate).toISOString() : null,
  }));

  return (
    <div className="space-y-4 w-full">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-xl font-headline font-bold text-on-surface">
            Planner
          </h1>
          <p className="text-xs md:text-sm text-outline">
            See and manage all your tasks and assignments.
          </p>
        </div>
      </header>

      <TasksPageClient tasks={tasks} />
    </div>
  );
}