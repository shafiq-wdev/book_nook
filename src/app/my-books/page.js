import { RequireAuth } from "@/components/auth/require-auth";
import MyBooks from "@/components/books/my-books";
import { PageShell } from "@/components/layout/page-shell";

export const metadata = {
  title: "My Books",
  description: "Manage the books you have added to BookNook.",
};

export default function MyBooksPage() {
  return (
    <RequireAuth>
      <PageShell
        title="My Books"
        description="Manage the books you have added. Edit their details or remove them from the library."
      >
        <MyBooks />
      </PageShell>
    </RequireAuth>
  );
}