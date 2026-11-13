import Link from "next/link";
import { io } from "next/cache";
import { ArrowRightIcon } from "lucide-react";

import { NewArrivalsGrid } from "@/components/home/new-arrivals-grid";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getLatestBooks } from "@/lib/books";

export async function NewArrivals() {
  await io();

  const { books, source } = await getLatestBooks(6);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-primary">Fresh on the shelves</p>
        <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          New Arrivals
        </h2>
        <p className="mt-2 text-muted-foreground">
          The latest books added by readers in the BookNook community.
        </p>
        {source === "demo" ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Showing sample arrivals. Connect MongoDB to load live books.
          </p>
        ) : null}
      </div>

      <NewArrivalsGrid books={books} />

      <div className="mt-10 flex justify-center">
        <Link
          href="/books"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          See All Books
          <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export function NewArrivalsSkeleton() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>

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
    </section>
  );
}
