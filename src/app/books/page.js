import { Suspense } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

import {
  AllBooks,
  AllBooksSkeleton,
} from "@/components/books/all-books";
import { PageShell } from "@/components/layout/page-shell";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "All Books",
};

export default function AllBooksPage() {
  return (
    <PageShell
      title="All Books"
      description="Browse every book shared by the BookNook community."
      actions={
        <Link href="/add-book" className={buttonVariants()}>
          <PlusIcon aria-hidden="true" />
          Add a book
        </Link>
      }
    >
      <Suspense fallback={<AllBooksSkeleton />}>
        <AllBooks />
      </Suspense>
    </PageShell>
  );
}
