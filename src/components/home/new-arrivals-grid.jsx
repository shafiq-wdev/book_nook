/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpenIcon } from "lucide-react";
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
import { toast } from "@/components/ui/toast";
import { loginHref } from "@/lib/auth-redirect";

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
      onError={() => setHasError(true)}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}

function BorrowButton({ book }) {
  const { user, isLoaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  function handleBorrow() {
    if (!isLoaded) return;

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
      onClick={handleBorrow}
      disabled={!isLoaded}
    >
      Borrow
    </Button>
  );
}

function BookCard({ book }) {
  const detailsHref = `/books/${book.id}`;

  return (
    <Card className="group flex flex-col overflow-hidden pt-0">
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
      </Link>
      <CardHeader className="gap-1">
        <CardTitle className="line-clamp-2 text-base">
          <Link
            href={detailsHref}
            className="underline-offset-4 hover:underline"
          >
            {book.title}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{book.author}</p>
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
        <BorrowButton book={book} />
      </CardFooter>
    </Card>
  );
}

export function NewArrivalsGrid({ books }) {
  if (books.length === 0) {
    return (
      <p className="mt-8 rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        No books have been added yet. Check back soon.
      </p>
    );
  }

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
