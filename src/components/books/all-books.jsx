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
        <p className="mb-6 text-sm leading-6 text-muted-foreground">
          Showing sample books. Connect MongoDB to load live books.
        </p>
      ) : null}

      {source === "error" ? (
        <p
          role="alert"
          className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm leading-6 text-destructive"
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
    <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="flex h-full flex-col overflow-hidden rounded-2xl ring-1 ring-foreground/10"
        >
          <Skeleton className="aspect-[3/4] w-full rounded-none" />
          <div className="flex-1 space-y-3 p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
