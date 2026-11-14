/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  CheckIcon,
  ClockIcon,
  HandHeartIcon,
  MailIcon,
  PenLineIcon,
  SparklesIcon,
  TagIcon,
  UserIcon,
} from "lucide-react";
import { cn } from "cn";

import { useAuth } from "@/components/auth/auth-provider";
import { BookThumbnail } from "@/components/books/book-thumbnail";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { BORROW_PERIOD_LABEL } from "@/lib/borrow-config";
import { borrowsApi } from "@/lib/server-api";

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

function formatDate(value) {
  if (!value) return "Recently";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "Recently";

  return DATE_FORMATTER.format(date);
}

function getInitials(name) {
  return (
    name
      ?.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "BN"
  );
}

function BookCover({ book }) {
  const [hasError, setHasError] = useState(false);

  if (!book.image || hasError) {
    return (
      <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-primary/20 via-muted to-accent/40 p-6">
        <BookOpenIcon className="size-8 text-primary/70" aria-hidden="true" />
        <div>
          <p className="font-heading text-xl leading-tight font-semibold">
            {book.title}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{book.author}</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={book.image}
      alt={`Cover of ${book.title}`}
      onError={() => setHasError(true)}
      className="h-full w-full object-cover"
    />
  );
}

function MetaTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border bg-background/70 p-3.5 backdrop-blur">
      <div className="flex items-center gap-1.5 text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-1.5 truncate text-sm font-medium">{value}</p>
    </div>
  );
}

function ContributorCard({ book, isDemo }) {
  const name = book.userName?.trim() || (isDemo ? "BookNook demo library" : "BookNook reader");
  const email = book.userEmail?.trim() || "";

  return (
    <Card className="border bg-muted/30 ring-0">
      <CardContent className="flex flex-col gap-4 py-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar size="lg">
            <AvatarFallback className="bg-primary font-medium text-primary-foreground">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">
              Added by
            </p>
            <p className="truncate font-heading text-base font-semibold">
              {name}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {email || "Community contributor"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDaysIcon className="size-4" aria-hidden="true" />
          Added {formatDate(book.createdAt)}
        </div>
      </CardContent>
    </Card>
  );
}

function BorrowDialog({ book, user, open, onOpenChange, onBorrowed }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const data = await borrowsApi.create(book.id);

      onBorrowed(data.borrow);
      onOpenChange(false);

      toast.add({
        type: "success",
        title: "Book borrowed!",
        description: `Return “${book.title}” by ${formatDate(
          data.borrow?.dueAt
        )}.`,
        timeout: 6000,
      });
    } catch (apiError) {
      if (apiError?.status === 409 && apiError.data?.borrow) {
        onBorrowed(apiError.data.borrow);
        onOpenChange(false);

        toast.add({
          type: "info",
          title: "Already borrowed",
          description: `“${book.title}” is already on your borrowed list.`,
        });
        return;
      }

      const message =
        apiError?.status === 401
          ? "Your session expired. Please log in again."
          : apiError?.message ||
            "We could not borrow this book. Please try again.";

      setError(message);
      toast.add({
        type: "error",
        title: "Could not borrow this book",
        description: message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Borrow this book</DialogTitle>
          <DialogDescription>
            Confirm your details below. The book will be yours for{" "}
            {BORROW_PERIOD_LABEL}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 rounded-xl border bg-muted/40 p-3">
          <div className="h-16 w-11 shrink-0 overflow-hidden rounded-md bg-muted ring-1 ring-foreground/10">
            <BookThumbnail
              image={book.image}
              title={book.title}
              className="h-full w-full"
            />
          </div>

          <div className="min-w-0">
            <p className="line-clamp-1 font-medium">{book.title}</p>
            <p className="line-clamp-1 text-sm text-muted-foreground">
              {book.author}
            </p>
            <Badge variant="secondary" className="mt-1">
              {book.category}
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="borrow-user-name">User name</FieldLabel>
              <div className="relative">
                <UserIcon
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="borrow-user-name"
                  value={user?.name ?? ""}
                  readOnly
                  className="h-10 bg-muted/40 pl-9"
                />
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="borrow-user-email">Email</FieldLabel>
              <div className="relative">
                <MailIcon
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="borrow-user-email"
                  type="email"
                  value={user?.email ?? ""}
                  readOnly
                  className="h-10 bg-muted/40 pl-9"
                />
              </div>
            </Field>

            <div className="rounded-xl border bg-muted/30 p-3">
              <p className="flex items-center gap-2 text-sm font-medium">
                <CalendarDaysIcon className="size-4" aria-hidden="true" />
                {BORROW_PERIOD_LABEL} loan
              </p>
              <FieldDescription className="mt-1 text-xs">
                Your return date is calculated when you confirm. You can return
                the book anytime from My Borrows.
              </FieldDescription>
            </div>

            {error ? (
              <p
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
              >
                {error}
              </p>
            ) : null}
          </FieldGroup>

          <DialogFooter className="mt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <Spinner />
              ) : (
                <HandHeartIcon aria-hidden="true" />
              )}
              {submitting ? "Borrowing…" : "Confirm Borrow"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function BorrowPanel({ book }) {
  const { user } = useAuth();
  const isDemo = book.id.startsWith("demo-");
  const userEmail = user?.email?.toLowerCase();
  const ownerEmail = book.userEmail?.toLowerCase();
  const isOwner =
    Boolean(user?.id && book.userId && user.id === book.userId) ||
    Boolean(userEmail && ownerEmail && userEmail === ownerEmail);

  const [borrow, setBorrow] = useState(null);
  const [checking, setChecking] = useState(!isDemo);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (isDemo || !user?.id) {
      return undefined;
    }

    const controller = new AbortController();

    async function loadBorrowStatus() {
      try {
        const data = await borrowsApi.forBook(book.id, {
          signal: controller.signal,
        });

        const activeBorrow = Array.isArray(data) ? data[0] : null;

        if (activeBorrow) setBorrow(activeBorrow);
      } catch {
        // Keep the button available when the status check fails.
      } finally {
        if (!controller.signal.aborted) setChecking(false);
      }
    }

    loadBorrowStatus();

    return () => controller.abort();
  }, [book.id, isDemo, user?.id]);

  const borrowed = Boolean(borrow);
  const disabled = checking || borrowed || isOwner || isDemo;

  let message =
    "Borrow this book and enjoy it for a couple of weeks. Your due date is tracked automatically.";

  if (isOwner) {
    message =
      "You added this book to BookNook. You cannot borrow a book from your own shelf.";
  } else if (isDemo) {
    message =
      "This is a sample book from the demo library. Add your own books to start borrowing.";
  } else if (borrowed) {
    message = `You borrowed this book on ${formatDate(
      borrow.borrowedAt
    )}. Please return it by ${formatDate(borrow.dueAt)}.`;
  }

  return (
    <>
      <Card className="relative overflow-hidden border-0 bg-foreground text-background shadow-xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-12 -right-10 size-44 rounded-full bg-background/10 blur-2xl"
        />

        <CardContent className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-background/70 uppercase">
              <HandHeartIcon className="size-4" aria-hidden="true" />
              Borrow this book
            </p>
            <h2 className="font-heading text-2xl font-semibold">
              Take this story home
            </h2>
            <p className="max-w-md text-sm text-background/70">{message}</p>
            {!isOwner && !isDemo && !borrowed ? (
              <p className="flex items-center gap-1.5 text-xs text-background/60">
                <ClockIcon className="size-3.5" aria-hidden="true" />
                {BORROW_PERIOD_LABEL} loan · return date shown instantly
              </p>
            ) : null}
          </div>

          <Button
            type="button"
            size="lg"
            className="h-11 shrink-0 bg-background px-5 text-foreground hover:bg-background/90"
            onClick={() => setDialogOpen(true)}
            disabled={disabled}
          >
            {checking ? (
              <>
                <Spinner />
                Checking availability…
              </>
            ) : borrowed ? (
              <>
                <CheckIcon aria-hidden="true" />
                Borrowed
              </>
            ) : isOwner ? (
              <>
                <CheckIcon aria-hidden="true" />
                In your library
              </>
            ) : isDemo ? (
              "Sample book"
            ) : (
              <>
                <BookOpenIcon aria-hidden="true" />
                Borrow This Book
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {dialogOpen ? (
        <BorrowDialog
          book={book}
          user={user}
          open
          onOpenChange={setDialogOpen}
          onBorrowed={setBorrow}
        />
      ) : null}
    </>
  );
}

export function BookDetails({ book }) {
  const isDemo = book.id.startsWith("demo-");
  const author = book.author?.trim() || "Unknown author";
  const category = book.category?.trim() || "Uncategorized";

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-gradient-to-b from-muted/70 via-muted/20 to-transparent"
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Link
          href="/books"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "-ml-2 gap-1.5 text-muted-foreground"
          )}
        >
          <ArrowLeftIcon aria-hidden="true" />
          All books
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-14">
          <div className="mx-auto w-full max-w-sm lg:sticky lg:top-24 lg:mx-0 lg:max-w-none lg:self-start">
            <div className="relative overflow-hidden rounded-2xl bg-muted shadow-2xl shadow-foreground/10 ring-1 ring-foreground/10">
              <div className="aspect-[3/4]">
                <BookCover book={book} />
              </div>

              <Badge
                variant="secondary"
                className="absolute top-4 left-4 bg-background/90 backdrop-blur"
              >
                {category}
              </Badge>

              {isDemo ? (
                <Badge
                  variant="outline"
                  className="absolute top-4 right-4 border-background/40 bg-background/90 text-foreground backdrop-blur"
                >
                  Sample
                </Badge>
              ) : null}
            </div>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <SparklesIcon className="size-3.5" aria-hidden="true" />
              Shared with the BookNook community
            </p>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{category}</Badge>
              {isDemo ? (
                <Badge variant="outline">Demo library</Badge>
              ) : (
                <Badge variant="outline" className="gap-1.5">
                  <span
                    className="size-1.5 rounded-full bg-emerald-500"
                    aria-hidden="true"
                  />
                  Community shared
                </Badge>
              )}
            </div>

            <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              {book.title}
            </h1>

            <p className="mt-3 flex items-center gap-2 text-lg text-muted-foreground">
              <PenLineIcon className="size-4" aria-hidden="true" />
              by <span className="font-medium text-foreground">{author}</span>
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <MetaTile icon={UserIcon} label="Author" value={author} />
              <MetaTile icon={TagIcon} label="Category" value={category} />
              <MetaTile
                icon={CalendarDaysIcon}
                label="Added"
                value={formatDate(book.createdAt)}
              />
            </div>

            <Separator className="my-8" />

            <div>
              <h2 className="font-heading text-xl font-semibold">
                About this book
              </h2>
              <p className="mt-3 leading-7 whitespace-pre-line text-muted-foreground">
                {book.description ||
                  "No description has been added for this book yet."}
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <ContributorCard book={book} isDemo={isDemo} />
              <BorrowPanel book={book} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
