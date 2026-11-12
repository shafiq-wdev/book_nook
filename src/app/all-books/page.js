import Link from "next/link";
import { LibraryBigIcon } from "lucide-react";

import { EmptyState } from "@/components/layout/empty-state";
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
    >
      <EmptyState
        icon={LibraryBigIcon}
        title="The shelves are being stocked"
        description="Book listings will appear here once readers start adding titles to the library."
        action={
          <Link href="/add-book" className={buttonVariants()}>
            Add the first book
          </Link>
        }
      />
    </PageShell>
  );
}
