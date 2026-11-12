import { BookOpenCheckIcon } from "lucide-react";

import { RequireAuth } from "@/components/auth/require-auth";
import { EmptyState } from "@/components/layout/empty-state";
import { PageShell } from "@/components/layout/page-shell";

export const metadata = {
  title: "My Borrows",
};

export default function MyBorrowsPage() {
  return (
    <RequireAuth>
      <PageShell
        title="My Borrows"
        description="Books you are currently borrowing and their due dates."
      >
        <EmptyState
          icon={BookOpenCheckIcon}
          title="Nothing borrowed right now"
          description="When you borrow a book, it will show up here with its return date."
        />
      </PageShell>
    </RequireAuth>
  );
}
