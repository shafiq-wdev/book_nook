"use client";

import { useState } from "react";
import { BookCheckIcon } from "lucide-react";

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
import { borrowsApi } from "@/lib/server-api";

export function ReturnBorrowDialog({ borrow, open, onOpenChange, onReturned }) {
  const [returning, setReturning] = useState(false);
  const [error, setError] = useState("");

  async function handleReturn() {
    if (!borrow || returning) return;

    setReturning(true);
    setError("");

    try {
      await borrowsApi.return(borrow.id);
      onReturned(borrow);
      onOpenChange(false);

      toast.add({
        type: "success",
        title: "Book returned",
        description: `“${borrow.bookTitle}” is back on the shelves.`,
      });
    } catch (apiError) {
      if (apiError?.status === 409) {
        onReturned(borrow);
        onOpenChange(false);

        toast.add({
          type: "info",
          title: "Already returned",
          description: `“${borrow.bookTitle}” was already marked as returned.`,
        });
        return;
      }

      const message =
        apiError?.status === 401
          ? "Your session expired. Please log in again."
          : apiError?.message ||
            "Could not return this book. Please try again.";

      setError(message);
      toast.add({
        type: "error",
        title: "Return failed",
        description: message,
      });
    } finally {
      setReturning(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <BookCheckIcon aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>Return this book?</AlertDialogTitle>
          <AlertDialogDescription>
            “{borrow?.bookTitle || "This book"}” will be marked as returned.
            You can borrow it again later.
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
          <AlertDialogCancel disabled={returning}>Keep it</AlertDialogCancel>
          <AlertDialogAction onClick={handleReturn} disabled={returning}>
            {returning ? <Spinner /> : <BookCheckIcon aria-hidden="true" />}
            {returning ? "Returning…" : "Return book"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}