"use client";

import { useEffect, useState } from "react";

type Profile = {
    id: string;
    fullName: string;
    email: string;
    department: string;
    level: string;
    createdAt?: string;
};

export function ProfilePageClient() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/api/profile", { credentials: "include" });
                if (!res.ok) throw new Error("Failed to load profile");
                const data = await res.json();
                setProfile(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    if (loading || !profile) {
        return (
            <div className="bg-surface-container-low rounded-2xl border border-outline-variant/30 p-6">
                <p className="text-sm text-on-surface-variant">Loading profile...</p>
            </div>
        );
    }

    const handleChange = (field: keyof Profile, value: string) => {
        setProfile((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setError(null);
        setSaved(false);

        if (!profile.fullName.trim()) {
            setError("Full name is required.");
            return;
        }

        setSaving(true);

        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    fullName: profile.fullName,
                    department: profile.department,
                    level: profile.level,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                setError(data?.error || "Failed to update profile.");
                return;
            }

            const data = await res.json();
            setProfile(data);
            setSaved(true);
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const initial = (profile.fullName || profile.email || "?")[0]?.toUpperCase();

    return (
        <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
            <section className="bg-surface-container-low rounded-2xl border border-outline-variant/30 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-headline">
                        {initial}
                    </div>
                    <div>
                        <h2 className="text-lg font-headline text-on-surface">
                            Account details
                        </h2>
                        <p className="text-xs text-on-surface-variant">
                            Update your name, department, and level.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-on-surface-variant mb-1">
                            Full name
                        </label>
                        <input
                            className={`w-full rounded-xl border bg-surface px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 ${error
                                    ? "border-error/80 focus:ring-error/50"
                                    : "border-outline-variant/40 focus:ring-primary/40"
                                }`}
                            value={profile.fullName}
                            onChange={(e) => handleChange("fullName", e.target.value)}
                        />
                        {error && (
                            <p className="mt-1 text-[11px] text-error">
                                {error}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-on-surface-variant mb-1">
                            Email address
                        </label>
                        <input
                            disabled
                            className="w-full rounded-xl border border-outline-variant/30 bg-surface-container text-sm px-3 py-2 text-on-surface/70"
                            value={profile.email}
                        />
                        <p className="mt-1 text-[11px] text-on-surface-variant">
                            Email changes are disabled for this demo.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-xs font-medium text-on-surface-variant mb-1">
                                Department
                            </label>
                            <input
                                className="w-full rounded-xl border border-outline-variant/40 bg-surface px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                                value={profile.department}
                                onChange={(e) => handleChange("department", e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-on-surface-variant mb-1">
                                Level
                            </label>
                            <input
                                className="w-full rounded-xl border border-outline-variant/40 bg-surface px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                                value={profile.level}
                                onChange={(e) => handleChange("level", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <div className="text-xs text-on-surface-variant h-4">
                            {saved && "Profile updated"}
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-on-primary shadow-sm hover:bg-primary/90 disabled:opacity-60"
                        >
                            {saving ? "Saving..." : "Save changes"}
                        </button>
                    </div>
                </form>
            </section>

            <section className="bg-surface-container-low rounded-2xl border border-outline-variant/30 p-6 md:p-7 space-y-4">
                <h2 className="text-sm font-headline text-on-surface">
                    Profile summary
                </h2>
                <p className="text-sm text-on-surface-variant">
                    Your department and level help personalize your tasks and planner.
                </p>
                {profile.createdAt && (
                    <p className="text-xs text-on-surface-variant">
                        Member since{" "}
                        {new Date(profile.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </p>
                )}
            </section>
        </div>
    );
}