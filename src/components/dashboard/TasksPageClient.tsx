"use client";

import { useMemo, useState } from "react";
import { TaskModal } from "@/components/dashboard/TaskModal";

type Task = {
    id: string;
    title: string;
    course: string;
    status: "pending" | "in-progress" | "completed";
    priority: "low" | "medium" | "high";
    dueDate: string | null;
};

type Props = {
    tasks: Task[];
};

function isTaskUrgent(dueDate: string | null, hoursWindow = 24) {
    if (!dueDate) return false;

    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    // urgent if due in the next 'hoursWindow' hours but still in the future
    return diffHours > 0 && diffHours <= hoursWindow;
}

export function TasksPageClient({ tasks }: Props) {
    const [filter, setFilter] = useState<
        "today" | "upcoming" | "completed"
    >("today");
    const [modalOpen, setModalOpen] = useState(false);

    const todayKey = new Date().toISOString().slice(0, 10);

    const filteredTasks = useMemo(() => {
        if (filter === "completed") {
            return tasks.filter((t) => t.status === "completed");
        }

        if (filter === "today") {
            return tasks.filter((t) => {
                if (!t.dueDate) return false;
                const dateKey = new Date(t.dueDate).toISOString().slice(0, 10);
                return dateKey === todayKey && t.status !== "completed";
            });
        }

        // upcoming
        return tasks.filter((t) => {
            if (!t.dueDate) return false;
            const date = new Date(t.dueDate);
            const today = new Date(todayKey);
            return date > today && t.status !== "completed";
        });
    }, [tasks, filter, todayKey]);

    const featured =
        filteredTasks.find((t) => t.status === "in-progress") ||
        filteredTasks[0] ||
        null;

    const others = featured
        ? filteredTasks.filter((t) => t.id !== featured.id)
        : filteredTasks;

    return (
        <>
            {/* Hero / Add Task */}
            <section className="mb-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <span className="font-label text-outline uppercase tracking-widest text-[10px] font-bold mb-2 block">
                            Your Academic Pulse
                        </span>
                        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-[0.9]">
                            Study <br />{" "}
                            <span className="text-primary-container">Planner.</span>
                        </h1>
                    </div>
                    <button
                        type="button"
                        onClick={() => setModalOpen(true)}
                        className="bg-linear-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-full font-headline font-bold text-lg shadow-lg shadow-indigo-200/50 flex items-center gap-2 active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Add Task
                    </button>
                </div>
            </section>

            {/* Filters */}
            <nav className="flex gap-3 mb-6 overflow-x-auto no-scrollbar pb-2">
                <button
                    type="button"
                    onClick={() => setFilter("today")}
                    className={`px-6 py-2.5 rounded-full font-label font-semibold text-sm whitespace-nowrap ${filter === "today"
                        ? "bg-primary text-white shadow-md"
                        : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                        }`}
                >
                    Today
                </button>
                <button
                    type="button"
                    onClick={() => setFilter("upcoming")}
                    className={`px-6 py-2.5 rounded-full font-label font-semibold text-sm whitespace-nowrap ${filter === "upcoming"
                        ? "bg-primary text-white shadow-md"
                        : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                        }`}
                >
                    Upcoming
                </button>
                <button
                    type="button"
                    onClick={() => setFilter("completed")}
                    className={`px-6 py-2.5 rounded-full font-label font-semibold text-sm whitespace-nowrap ${filter === "completed"
                        ? "bg-primary text-white shadow-md"
                        : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                        }`}
                >
                    Completed
                </button>
            </nav>

            {/* Tasks Grid (simplified from your layout) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Featured task */}
                {featured && (
                    <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-6 md:p-8 editorial-shadow relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label font-bold text-[10px] uppercase tracking-wider">
                                    {featured.status === "in-progress"
                                        ? "In Progress"
                                        : featured.status === "pending"
                                            ? "To-do"
                                            : "Completed"}
                                </span>
                                {isTaskUrgent(featured.dueDate, 24) && featured.status !== "completed" && (
                                    <span className="bg-error/10 text-error px-3 py-1 rounded-full font-label font-bold text-[10px] uppercase tracking-wider">
                                        Urgent
                                    </span>
                                )}
                            </div>
                            <span className="font-label text-outline text-xs">
                                {featured.dueDate
                                    ? `Due ${new Date(
                                        featured.dueDate
                                    ).toLocaleString()}`
                                    : "No deadline"}
                            </span>
                        </div>
                        <h3 className="font-headline text-2xl md:text-3xl font-bold text-on-surface mb-1">
                            {featured.title}
                        </h3>
                        <p className="font-body text-on-surface-variant text-sm md:text-base mb-6 max-w-md">
                            {featured.course}
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                                <div className="w-[65%] h-full bg-linear-to-r from-primary to-primary-container rounded-full"></div>
                            </div>
                            <span className="font-label font-bold text-primary text-sm">
                                65%
                            </span>
                        </div>
                    </div>
                )}

                {/* Small card for another task (if available) */}
                {others[0] && (
                    <div className="md:col-span-4 bg-surface-container-low rounded-xl p-6 flex flex-col justify-between border-l-4 border-primary">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-label text-primary font-bold text-[10px] uppercase tracking-wider">
                                    {others[0].status === "completed" ? "Done" : "To-do"}
                                </span>
                                {isTaskUrgent(others[0].dueDate, 24) && others[0].status !== "completed" && (
                                    <span className="bg-error/10 text-error px-2 py-0.5 rounded-full font-label font-bold text-[9px] uppercase tracking-wider">
                                        Urgent
                                    </span>
                                )}
                            </div>
                            <h4 className="font-headline text-xl font-bold text-on-surface">
                                {others[0].title}
                            </h4>
                            <p className="font-body text-sm text-on-surface-variant mt-1">
                                {others[0].course}
                            </p>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                            <span className="text-xs font-label text-outline">
                                {others[0].dueDate
                                    ? new Date(others[0].dueDate).toLocaleDateString()
                                    : "No date"}
                            </span>
                            <span className="material-symbols-outlined text-outline">
                                more_horiz
                            </span>
                        </div>
                    </div>
                )}

                {/* List-style rows for the rest */}
                {others.slice(1).map((task) => (
                    <div
                        key={task.id}
                        className={`md:col-span-12 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group transition-colors cursor-pointer ${task.status === "completed"
                            ? "bg-surface-container-lowest/50 opacity-80"
                            : "bg-surface-container-lowest hover:bg-surface-container-low"
                            }`}
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                                <span className="material-symbols-outlined">terminal</span>
                            </div>
                            <div>
                                <h4
                                    className={`font-headline text-lg font-bold text-on-surface ${task.status === "completed" ? "line-through" : ""
                                        }`}
                                >
                                    {task.title}
                                </h4>
                                <p className="font-body text-sm text-on-surface-variant">
                                    {task.course}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-8 px-2">
                            <div className="hidden lg:block text-right">
                                <span className="block font-label font-bold text-xs uppercase text-outline mb-1">
                                    Status
                                </span>
                                <div className="flex items-center gap-1 justify-end">
                                    <span className="text-sm font-semibold text-on-surface">
                                        {task.status}
                                    </span>
                                    {isTaskUrgent(task.dueDate, 24) && task.status !== "completed" && (
                                        <span className="bg-error/10 text-error px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                                            Urgent
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block font-label font-bold text-xs uppercase text-outline mb-1">
                                    Deadline
                                </span>
                                <span className="text-sm font-semibold text-on-surface">
                                    {task.dueDate
                                        ? new Date(
                                            task.dueDate
                                        ).toLocaleDateString()
                                        : "No date"}
                                </span>
                            </div>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container group-hover:bg-primary group-hover:text-white transition-all">
                                <span className="material-symbols-outlined text-sm">
                                    chevron_right
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty state if no tasks in this filter */}
                {filteredTasks.length === 0 && (
                    <div className="md:col-span-12 bg-primary-container rounded-xl p-6 text-on-primary-container flex flex-col justify-center items-center text-center">
                        <span className="material-symbols-outlined text-4xl mb-3">
                            auto_awesome
                        </span>
                        <h4 className="font-headline text-xl font-bold">
                            Nothing here yet
                        </h4>
                        <p className="font-body text-sm opacity-90 mt-2">
                            Change the filter or add a new task to start planning.
                        </p>
                    </div>
                )}
            </div>

            {/* New Task modal (reuses your existing TaskModal) */}
            <TaskModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </>
    );
}