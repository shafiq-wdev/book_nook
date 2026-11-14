"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpenIcon,
  PencilIcon,
  PlusIcon,
  RefreshCwIcon,
  Trash2Icon,
  TriangleAlertIcon,
} from "lucide-react";
import { cn } from "cn";

import { useAuth } from "@/components/auth/auth-provider";
import { BookThumbnail } from "@/components/books/book-thumbnail";
import { DeleteBookDialog } from "@/components/books/delete-book-dialog";
import { EditBookDialog } from "@/components/books/edit-book-dialog";
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
import { formatDate } from "@/lib/format-date";
import { booksApi } from "@/lib/server-api";

export default function MyBooks() {
  const { user } = useAuth();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [editingBook, setEditingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);

  useEffect(() => {
    if (!user?.id) return undefined;

    const controller = new AbortController();

    async function loadBooks() {
      setLoading(true);
      setError("");

      try {
        const data = await booksApi.listMine({ signal: controller.signal });
        const nextBooks = Array.isArray(data)
          ? data
          : Array.isArray(data?.books)
            ? data.books
            : [];

        setBooks(nextBooks);
      } catch (apiError) {
        if (apiError?.name === "AbortError") return;

        setError(
          apiError?.status === 401
            ? "Your session expired. Please log in again."
            : apiError?.message || "Could not load your books."
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadBooks();

    return () => controller.abort();
  }, [reloadKey, user?.id]);

  function reload() {
    setReloadKey((value) => value + 1);
  }

  function handleSaved(updatedBook) {
    if (!updatedBook) {
      reload();
      return;
    }

    setBooks((previous) =>
      previous.map((book) =>
        book.id === updatedBook.id ? updatedBook : book
      )
    );
  }

  function handleDeleted(book) {
    setBooks((previous) => previous.filter((item) => item.id !== book.id));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpenIcon className="size-4" aria-hidden="true" />
          {loading
            ? "Loading your shelf…"
            : `${books.length} ${books.length === 1 ? "book" : "books"} on your shelf`}
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
            href="/add-book"
            className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
          >
            <PlusIcon aria-hidden="true" />
            Add book
          </Link>
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex min-h-64 flex-col items-center justify-center gap-3 py-12 text-center">
            <Spinner className="size-7" />
            <div>
              <p className="font-medium">Loading your books</p>
              <p className="text-sm text-muted-foreground">
                Fetching your shelf from the library.
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
              <p className="font-medium">We could not load your books</p>
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

      {!loading && !error && books.length === 0 ? (
        <EmptyState
          icon={BookOpenIcon}
          title="Your shelf is empty"
          description="Add your first book and it will show up here, ready to edit or remove."
          action={
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link
                href="/add-book"
                className={cn(buttonVariants(), "gap-1.5")}
              >
                <PlusIcon aria-hidden="true" />
                Add your first book
              </Link>
              <Link
                href="/books"
                className={buttonVariants({ variant: "outline" })}
              >
                Browse books
              </Link>
            </div>
          }
        />
      ) : null}

      {!loading && !error && books.length > 0 ? (
        <Card className="rounded-2xl py-0">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="pl-4">Book</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="pr-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="pl-4">
                      <div className="flex min-w-52 items-center gap-3">
                        <div className="aspect-[3/4] w-10 shrink-0 overflow-hidden rounded-md bg-muted ring-1 ring-foreground/10">
                          <BookThumbnail
                            image={book.image}
                            title={book.title}
                            className="h-full w-full"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="line-clamp-1 font-medium">
                            {book.title}
                          </p>
                          <p className="line-clamp-1 text-xs text-muted-foreground">
                            {book.author}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary">{book.category}</Badge>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(book.createdAt)}
                    </TableCell>

                    <TableCell className="pr-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingBook(book)}
                        >
                          <PencilIcon aria-hidden="true" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeletingBook(book)}
                        >
                          <Trash2Icon aria-hidden="true" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}

      {editingBook ? (
        <EditBookDialog
          key={editingBook.id}
          book={editingBook}
          open
          onOpenChange={(open) => {
            if (!open) setEditingBook(null);
          }}
          onSaved={handleSaved}
        />
      ) : null}

      {deletingBook ? (
        <DeleteBookDialog
          key={deletingBook.id}
          book={deletingBook}
          open
          onOpenChange={(open) => {
            if (!open) setDeletingBook(null);
          }}
          onDeleted={handleDeleted}
        />
      ) : null}
    </div>
  );
}