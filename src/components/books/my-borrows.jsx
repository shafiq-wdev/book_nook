"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpenCheckIcon,
  CalendarDaysIcon,
  RefreshCwIcon,
  RotateCcwIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { cn } from "cn";

import { BookThumbnail } from "@/components/books/book-thumbnail";
import { ReturnBorrowDialog } from "@/components/books/return-borrow-dialog";
import { EmptyState } from "@/components/layout/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { daysUntil, formatDate } from "@/lib/format-date";
import { borrowsApi } from "@/lib/server-api";

function DueBadge({ dueAt }) {
  const remaining = daysUntil(dueAt);

  if (remaining === null) {
    return <Badge variant="outline">On loan</Badge>;
  }

  if (remaining < 0) {
    return <Badge variant="destructive">Overdue</Badge>;
  }

  if (remaining <= 3) {
    return (
      <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-400">
        {remaining === 0 ? "Due today" : `Due in ${remaining}d`}
      </Badge>
    );
  }

  return <Badge variant="secondary">On loan</Badge>;
}

export function MyBorrows() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [returningBorrow, setReturningBorrow] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBorrows() {
      setLoading(true);
      setError("");

      try {
        const data = await borrowsApi.list({ signal: controller.signal });
        const nextBorrows = Array.isArray(data)
          ? data
          : Array.isArray(data?.borrows)
            ? data.borrows
            : [];

        setBorrows(nextBorrows);
      } catch (apiError) {
        if (apiError?.name === "AbortError") return;

        setError(
          apiError?.status === 401
            ? "Your session expired. Please log in again."
            : apiError?.message || "Could not load your borrowed books."
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadBorrows();

    return () => controller.abort();
  }, [reloadKey]);

  function reload() {
    setReloadKey((value) => value + 1);
  }

  function handleReturned(borrow) {
    setBorrows((previous) => previous.filter((item) => item.id !== borrow.id));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpenCheckIcon className="size-4" aria-hidden="true" />
          {loading
            ? "Checking your loans…"
            : `${borrows.length} active ${borrows.length === 1 ? "loan" : "loans"}`}
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={reload}
            disabled={loading}
          >
            <RefreshCwIcon
              className={cn(loading && "animate-spin")}
              aria-hidden="true"
            />
            Refresh
          </Button>

          <Link
            href="/books"
            className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
          >
            <BookOpenCheckIcon aria-hidden="true" />
            Browse library
          </Link>
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex min-h-64 flex-col items-center justify-center gap-3 py-12 text-center">
            <Spinner className="size-7" />
            <div>
              <p className="font-medium">Loading your borrowed books</p>
              <p className="text-sm text-muted-foreground">
                Checking your current loans and return dates.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {!loading && error ? (
        <Card>
          <CardContent className="flex min-h-64 flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <TriangleAlertIcon className="size-6" aria-hidden="true" />
            </div>
            <div>
              <p className="font-medium">We could not load your borrows</p>
              <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                {error}
              </p>
            </div>
            <Button type="button" variant="outline" onClick={reload}>
              <RefreshCwIcon aria-hidden="true" />
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {!loading && !error && borrows.length === 0 ? (
        <EmptyState
          icon={BookOpenCheckIcon}
          title="Nothing borrowed right now"
          description="Pick a book from the library, borrow it, and your return date will show up here."
          action={
            <Link href="/books" className={buttonVariants()}>
              Browse the library
            </Link>
          }
        />
      ) : null}

      {!loading && !error && borrows.length > 0 ? (
        <Card className="rounded-2xl py-0">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="pl-4">Book</TableHead>
                  <TableHead>Borrow date</TableHead>
                  <TableHead>Return date</TableHead>
                  <TableHead className="pr-4 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {borrows.map((borrow) => (
                  <TableRow key={borrow.id}>
                    <TableCell className="pl-4">
                      <div className="flex min-w-52 items-center gap-3">
                        <div className="aspect-[3/4] w-10 shrink-0 overflow-hidden rounded-md bg-muted ring-1 ring-foreground/10">
                          <BookThumbnail
                            image={borrow.bookImage}
                            title={borrow.bookTitle}
                            className="h-full w-full"
                          />
                        </div>

                        <div className="min-w-0">
                          <Link
                            href={`/books/${borrow.bookId}`}
                            className="line-clamp-1 font-medium underline-offset-4 hover:underline"
                          >
                            {borrow.bookTitle}
                          </Link>
                          <p className="mt-1">
                            <DueBadge dueAt={borrow.dueAt} />
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <CalendarDaysIcon
                          className="size-3.5"
                          aria-hidden="true"
                        />
                        {formatDate(borrow.borrowedAt)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm font-medium">
                        {formatDate(borrow.dueAt)}
                      </span>
                    </TableCell>

                    <TableCell className="pr-4 text-right">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setReturningBorrow(borrow)}
                      >
                        <RotateCcwIcon aria-hidden="true" />
                        Return book
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}

      {returningBorrow ? (
        <ReturnBorrowDialog
          key={returningBorrow.id}
          borrow={returningBorrow}
          open
          onOpenChange={(open) => {
            if (!open) setReturningBorrow(null);
          }}
          onReturned={handleReturned}
        />
      ) : null}
    </div>
  );
}