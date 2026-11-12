import { RequireAuth } from "@/components/auth/require-auth";
import { ProfileCard } from "@/components/auth/profile-card";
import { PageShell } from "@/components/layout/page-shell";

export const metadata = {
  title: "My Profile",
};

export default function ProfilePage() {
  return (
    <RequireAuth>
      <PageShell
        title="My Profile"
        description="Your BookNook account details."
      >
        <ProfileCard />
      </PageShell>
    </RequireAuth>
  );
}
