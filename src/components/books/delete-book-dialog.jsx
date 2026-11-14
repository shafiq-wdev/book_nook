"use client";

import { useState } from "react";
import { Trash2Icon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { booksApi } from "@/lib/server-api";

export function DeleteBookDialog({ book, open, onOpenChange, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!book || deleting) return;

    setDeleting(true);
    setError("");

    try {
      await booksApi.remove(book.id);
      onDeleted(book);
      onOpenChange(false);

      toast.add({
        type: "success",
        title: "Book deleted",
        description: `“${book.title}” has been removed from your library.`,
      });
    } catch (apiError) {
      const message =
        apiError?.status === 401
          ? "Your session expired. Please log in again."
          : apiError?.message ||
            "Could not delete this book. Please try again.";

      setError(message);
      toast.add({
        type: "error",
        title: "Delete failed",
        description: message,
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <Trash2Icon aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete this book?</AlertDialogTitle>
          <AlertDialogDescription>
            “{book?.title || "This book"}” will be permanently removed from the
            database, along with any borrow records for it. This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
          >
            {error}
          </p>
        ) : null}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? <Spinner /> : <Trash2Icon aria-hidden="true" />}
            {deleting ? "Deleting…" : "Delete book"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}