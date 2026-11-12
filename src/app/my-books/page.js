import { BookMarkedIcon } from "lucide-react";

import { RequireAuth } from "@/components/auth/require-auth";
import { EmptyState } from "@/components/layout/empty-state";
import { PageShell } from "@/components/layout/page-shell";

export const metadata = {
  title: "My Books",
};

export default function MyBooksPage() {
  return (
    <RequireAuth>
      <PageShell
        title="My Books"
        description="The books you have added to BookNook and their availability."
      >
        <EmptyState
          icon={BookMarkedIcon}
          title="No books yet"
          description="Once you add a book, you will see it here with its lending status."
        />
      </PageShell>
    </RequireAuth>
  );
}
