/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpenIcon, LibraryBigIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "cn";

import { useAuth } from "@/components/auth/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginHref } from "@/lib/auth-redirect";
import { getCopyState } from "@/lib/copies";

function BookCover({ book, className }) {
  const [hasError, setHasError] = useState(false);

  if (!book.image || hasError) {
    return (
      <div
        className={cn(
          "flex flex-col justify-between bg-gradient-to-br from-primary/20 via-muted to-accent/40 p-4",
          className
        )}
      >
        <BookOpenIcon className="size-5 text-primary/70" aria-hidden="true" />
        <span className="line-clamp-3 font-heading text-sm leading-tight font-semibold">
          {book.title}
        </span>
      </div>
    );
  }

  return (
    <img
      src={book.image}
      alt={`Cover of ${book.title}`}
      loading="lazy"
      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
      onError={() => setHasError(true)}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}

function BorrowButton({ book, unavailable }) {
  const { user, isLoaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  function handleBorrow() {
    if (!isLoaded || unavailable) return;

    if (!user) {
      router.push(loginHref(pathname));
      return;
    }

    router.push(`/books/${book.id}`);
  }

  return (
    <Button
      type="button"
      className="flex-1"
      variant={unavailable ? "secondary" : "default"}
      onClick={handleBorrow}
      disabled={unavailable}
      aria-disabled={unavailable}
    >
      {unavailable ? "Not Available" : "Borrow"}
    </Button>
  );
}

function BookCard({ book }) {
  const detailsHref = `/books/${book.id}`;
  const { totalCopies, availableCopies, unavailable } = getCopyState(book);

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-2xl pt-0 transition-shadow hover:shadow-md">
      <Link
        href={detailsHref}
        aria-label={`View details for ${book.title}`}
        className="relative block aspect-[3/4] overflow-hidden bg-muted"
      >
        <BookCover
          book={book}
          className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105"
        />
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 bg-background/90 backdrop-blur"
        >
          {book.category}
        </Badge>
        {unavailable ? (
          <Badge
            variant="destructive"
            className="absolute top-3 right-3 shadow-sm"
          >
            Not Available
          </Badge>
        ) : null}
      </Link>

      <CardHeader className="flex-1 gap-1">
        <CardTitle className="line-clamp-2 text-base">
          <Link
            href={detailsHref}
            className="underline-offset-4 hover:underline"
          >
            {book.title}
          </Link>
        </CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">{book.author}</p>
        <p
          className={cn(
            "flex items-center gap-1.5 pt-1 text-xs",
            unavailable ? "text-destructive" : "text-muted-foreground"
          )}
        >
          <LibraryBigIcon className="size-3.5" aria-hidden="true" />
          {unavailable
            ? "All copies are borrowed"
            : `${availableCopies} of ${totalCopies} ${
                totalCopies === 1 ? "copy" : "copies"
              } available`}
        </p>
      </CardHeader>

      <CardFooter className="mt-auto gap-2">
        <Link
          href={detailsHref}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "flex-1 justify-center"
          )}
        >
          View Details
        </Link>
        <BorrowButton book={book} unavailable={unavailable} />
      </CardFooter>
    </Card>
  );
}

export function NewArrivalsGrid({ books }) {
  const reduceMotion = useReducedMotion();

  if (books.length === 0) {
    return (
      <p className="mt-10 rounded-2xl border border-dashed px-6 py-12 text-center text-sm leading-6 text-muted-foreground">
        No books have been added yet. Check back soon.
      </p>
    );
  }

  return (
    <div className="mt-10 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book, index) => (
        <motion.div
          key={book.id}
          className="h-full"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: 0.45,
            delay: reduceMotion ? 0 : Math.min(index * 0.06, 0.3),
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <BookCard book={book} />
        </motion.div>
      ))}
    </div>
  );
}
