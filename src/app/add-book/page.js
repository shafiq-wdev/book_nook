import { BookPlusIcon } from "lucide-react";

import { RequireAuth } from "@/components/auth/require-auth";
import { EmptyState } from "@/components/layout/empty-state";
import { PageShell } from "@/components/layout/page-shell";

export const metadata = {
  title: "Add Book",
};

export default function AddBookPage() {
  return (
    <RequireAuth>
      <PageShell
        title="Add Book"
        description="Share a book from your shelf with the BookNook community."
      >
        <EmptyState
          icon={BookPlusIcon}
          title="Book details coming soon"
          description="The add-book form will live here. For now, this private route is ready for the next step."
        />
      </PageShell>
    </RequireAuth>
  );
}
