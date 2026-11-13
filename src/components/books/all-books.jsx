import { io } from "next/cache";

import { NewArrivalsGrid } from "@/components/home/new-arrivals-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllBooks } from "@/lib/books";

export async function AllBooks() {
  await io();

  const { books, source } = await getAllBooks();

  return (
    <div>
      {source === "demo" ? (
        <p className="text-xs text-muted-foreground">
          Showing sample books. Connect MongoDB to load live books.
        </p>
      ) : null}

      {source === "error" ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          We could not load the book list right now. Please try again.
        </p>
      ) : null}

      <NewArrivalsGrid books={books} />
    </div>
  );
}

export function AllBooksSkeleton() {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl ring-1 ring-foreground/10"
        >
          <Skeleton className="aspect-[3/4] w-full rounded-none" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
