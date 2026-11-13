import { RequireAuth } from "@/components/auth/require-auth";
import { AddBookForm } from "@/components/books/add-book-form";
import { PageShell } from "@/components/layout/page-shell";

export const metadata = {
  title: "Add Book",
};

export default function AddBookPage() {
  return (
    <RequireAuth>
      <PageShell
        title="Add a New Book"
        description="Share a book with the BookNook community. Your name and email are attached automatically."
      >
        <AddBookForm />
      </PageShell>
    </RequireAuth>
  );
}
