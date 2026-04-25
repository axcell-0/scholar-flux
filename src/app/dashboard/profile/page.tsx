import { ProfilePageClient } from "@/components/dashboard/ProfilePageClient";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline text-on-surface">
            Profile
          </h1>
          <p className="text-sm text-on-surface-variant">
            Manage your account and study information.
          </p>
        </div>
      </div>

      <ProfilePageClient />
    </div>
  );
}