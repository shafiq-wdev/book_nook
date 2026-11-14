import Link from "next/link";
import { io } from "next/cache";
import { ArrowRightIcon } from "lucide-react";

import { NewArrivalsGrid } from "@/components/home/new-arrivals-grid";
import { SectionHeading } from "@/components/layout/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getLatestBooks } from "@/lib/books";

export async function NewArrivals() {
  await io();

  const { books, source } = await getLatestBooks(6);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <SectionHeading
        eyebrow="Fresh on the shelves"
        title="New Arrivals"
        description="The latest books added by readers in the BookNook community."
      />

      {source === "demo" ? (
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Showing sample arrivals. Connect MongoDB to load live books.
        </p>
      ) : null}

      <NewArrivalsGrid books={books} />

      <div className="mt-10 flex justify-center sm:mt-12">
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
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="max-w-2xl space-y-3">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>

      <div className="mt-10 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    </section>
  );
}
