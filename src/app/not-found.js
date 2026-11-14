import Link from "next/link";
import { BookOpenIcon, HomeIcon, LibraryIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist on BookNook.",
};

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-muted/70 via-muted/20 to-transparent"
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:py-28">
        <div className="relative">
          <div className="flex size-24 items-center justify-center rounded-3xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <BookOpenIcon className="size-11" aria-hidden="true" />
          </div>
          <Badge
            variant="outline"
            className="absolute -top-2 -right-3 bg-background"
          >
            404
          </Badge>
        </div>

        <h1 className="mt-8 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          This page wandered off the shelf
        </h1>
        <p className="mt-3 max-w-xl leading-7 text-muted-foreground">
          We could not find the page you were looking for. It may have been
          moved, deleted, or it never existed.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className={buttonVariants()}>
            <HomeIcon aria-hidden="true" />
            Back to Home
          </Link>
          <Link
            href="/books"
            className={buttonVariants({ variant: "outline" })}
          >
            <LibraryIcon aria-hidden="true" />
            Browse all books
          </Link>
        </div>
      </div>
    </section>
  );
}