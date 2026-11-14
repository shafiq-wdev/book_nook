import { Suspense } from "react";
import { notFound } from "next/navigation";
import { io } from "next/cache";

import { RequireAuth } from "@/components/auth/require-auth";
import { BookDetails } from "@/components/books/book-details";
import { Skeleton } from "@/components/ui/skeleton";
import { getBookById } from "@/lib/books";

// The shared Navbar reads the pathname, so this dynamic route waits for the
// request instead of forcing every layout into a streaming boundary.
export const instant = false;

export async function generateMetadata({ params }) {
  const { id } = await params;
  await io();

  const { book } = await getBookById(id);

  return {
    title: book ? book.title : "Book not found",
    description: book?.description
      ? book.description.slice(0, 160)
      : "Book details on BookNook.",
  };
}

export default function BookDetailsPage({ params }) {
  return (
    <Suspense fallback={<BookDetailsSkeleton />}>
      <BookDetailsContent params={params} />
    </Suspense>
  );
}

async function BookDetailsContent({ params }) {
  await io();

  const { id } = await params;
  const { book } = await getBookById(id);

  if (!book) {
    notFound();
  }

  return (
    <RequireAuth>
      <BookDetails book={book} />
    </RequireAuth>
  );
}

function BookDetailsSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <Skeleton className="h-7 w-28" />

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-14">
        <Skeleton className="mx-auto aspect-[3/4] w-full max-w-sm rounded-2xl lg:mx-0 lg:max-w-none" />

        <div className="space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-5 w-48" />
          <div className="grid gap-3 pt-4 sm:grid-cols-3">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
          <Skeleton className="mt-6 h-32 w-full" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-36 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
