import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAuthToken } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/");
  }

  const payload = verifyAuthToken(token!);

  if (!payload) {
    redirect("/");
  }

  // NEW: load department + level from Mongo
  await dbConnect();
  const user = await User.findById(payload.userId).select(
    "department level"
  );

  return (
    <DashboardShell
      fullName={payload.fullName}
      email={payload.email}
      department={user?.department || ""}
      level={user?.level || ""}
    >
      {children}
    </DashboardShell>
  );
}