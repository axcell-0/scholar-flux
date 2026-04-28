"use client";

import { useState } from "react";
import { SidebarLink } from "./SidebarLink";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function DashboardShell({
    fullName,
    email,
    children,
    department,
    level,
}: {
    fullName: string;
    email: string;
    children: React.ReactNode;
    department: string;
    level: string;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch("/api/logout", {
                method: "POST",
                credentials: "include",
            }); // clear cookies on the server

            router.push("/"); // redirect to homepage
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    const firstName =
        fullName?.trim().split(" ")[0] || email?.split("@")[0] || "Student";

    return (
        <div className="h-screen bg-surface flex overflow-hidden">
            {/* Desktop sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-surface-container-high border-r border-outline-variant/40 p-6">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-9 h-9 signature-gradient rounded-xl flex items-center justify-center">
                        <span
                            className="material-symbols-outlined text-white text-xl"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                            auto_awesome
                        </span>
                    </div>
                    <div>
                        <p className="font-headline font-bold text-sm text-on-surface">
                            Scholar Flux
                        </p>
                        <p className="text-[11px] text-outline">Student Life Manager</p>
                    </div>
                </div>

                <nav className="space-y-1 text-sm">
                    <p className="text-[11px] font-bold text-outline uppercase tracking-widest mb-2">
                        Overview
                    </p>

                    <SidebarLink
                        href="/dashboard"
                        icon="space_dashboard"
                        label="Dashboard"
                    />

                    <SidebarLink
                        href="/dashboard/tasks"
                        icon="checklist"
                        label="Tasks"
                    />

                    <SidebarLink
                        href="/dashboard/habits"
                        icon="auto_graph"
                        label="Habits"
                    />

                    <SidebarLink
                        href="/dashboard/budget"
                        icon="account_balance_wallet"
                        label="Budget"
                    />

                    <SidebarLink
                        href="/dashboard/profile"
                        icon="account_circle"
                        label="Profile"
                    />
                    <SidebarLink
                        href="/dashboard/notes"
                        icon="sticky_note_2"
                        label="Notes"
                    />
                </nav>

                <div className="mt-auto pt-6 border-t border-outline-variant/30">
                    <p className="text-xs text-outline mb-1">Logged in as</p>
                    <p className="text-sm font-medium text-on-surface">{fullName}</p>
                    <p className="text-xs text-outline">{email}</p>
                </div>
            </aside>

            {/* Mobile overlay sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 flex md:hidden"
                    onClick={() => setSidebarOpen(false)}
                >
                    <div className="w-64 bg-surface-container-high border-r border-outline-variant/40p-6">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 signature-gradient rounded-xl flex items-center justify-center">
                                    <span
                                        className="material-symbols-outlined text-white text-xl"
                                        style={{ fontVariationSettings: "'FILL' 1" }}
                                    >
                                        auto_awesome
                                    </span>
                                </div>
                                <div>
                                    <p className="font-headline font-bold text-on-surface text-sm">
                                        Scholar Flux
                                    </p>
                                    <p className="text-[11px] text-outline">Student Life Manager</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="w-8 h-8 rounded-full bg-surface flex items-center justify-center border border-outline-variant/40"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSidebarOpen(false);
                                }}
                            >
                                <span className="material-symbols-outlined text-inverse-on-surface text-base">
                                    close
                                </span>
                            </button>
                        </div>

                        <nav className="space-y-1 text-sm">
                            <p className="text-[11px] font-bold text-outline uppercase tracking-widest mb-2">
                                Overview
                            </p>

                            <SidebarLink
                                href="/dashboard"
                                icon="space_dashboard"
                                label="Dashboard"
                                onClick={() => setSidebarOpen(false)}
                            />

                            <SidebarLink
                                href="/dashboard/tasks"
                                icon="checklist"
                                label="Tasks"
                                onClick={() => setSidebarOpen(false)}
                            />

                            <SidebarLink
                                href="/dashboard/habits"
                                icon="auto_graph"
                                label="Habits"
                                onClick={() => setSidebarOpen(false)}
                            />

                            <SidebarLink
                                href="/dashboard/budget"
                                icon="account_balance_wallet"
                                label="Budget"
                                onClick={() => setSidebarOpen(false)}
                            />
                            <SidebarLink
                                href="/dashboard/profile"
                                icon="account_circle"
                                label="Profile"
                                onClick={() => setSidebarOpen(false)}
                            />

                            <SidebarLink
                                href="/dashboard/notes"
                                icon="sticky_note_2"
                                label="Notes"
                                onClick={() => setSidebarOpen(false)}
                            />
                        </nav>

                        <div className="mt-10 pt-4 border-t border-outline-variant/30">
                            <p className="text-xs text-outline mb-1">Logged in as</p>
                            <p className="text-sm font-medium text-on-surface">{fullName}</p>
                            <p className="text-xs text-outline">{email}</p>
                        </div>
                    </div>

                    <div className="flex-1 bg-black/30 backdrop-blur-sm" />
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                <header className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-outline-variant/30 bg-surface-container/60 backdrop-blur">
                    <div className="flex items-center gap-3">
                        {/* Mobile menu button */}
                        <button
                            type="button"
                            className="inline-flex md:hidden w-9 h-9 rounded-full bg-surface border border-outline-variant/40 items-center justify-center"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="material-symbols-outlined text-inverse-on-surface text-base">
                                menu
                            </span>
                        </button>

                        <div>
                            <h1 className="text-lg md:text-xl font-headline font-bold text-inverse-on-surface">
                                Daily Overview
                            </h1>
                            <p className="text-xs md:text-sm text-outline">
                                See today&apos;s tasks, habits, and budget at a glance.
                            </p>
                            {(department || level) && (
                                <p className="text-[11px] md:text-xs text-on-surface-variant mt-1">
                                    {department && level
                                        ? `${department} • Level ${level}`
                                        : department
                                            ? department
                                            : `Level ${level}`}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-on-surface">
                                {firstName}
                            </span>
                            <span className="text-[11px] text-outline truncate max-w-35">
                                {email}
                            </span>
                        </div>
                        <button
                            type="button"
                            className="px-3 py-1.5 rounded-full text-sm font-medium bg-error text-on-error hover:bg-error/90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                            onClick={handleLogout}
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </header>

                <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}