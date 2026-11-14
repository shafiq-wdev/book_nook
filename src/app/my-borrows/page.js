import { RequireAuth } from "@/components/auth/require-auth";
import { MyBorrows } from "@/components/books/my-borrows";
import { PageShell } from "@/components/layout/page-shell";

export const metadata = {
  title: "My Borrows",
  description: "Books you are currently borrowing and their return dates.",
};

export default function MyBorrowsPage() {
  return (
    <RequireAuth>
      <PageShell
        title="My Borrows"
        description="Books you are currently borrowing, with their return dates and a quick way to return them."
      >
        <MyBorrows />
      </PageShell>
    </RequireAuth>
  );
}