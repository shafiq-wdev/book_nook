/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import {
  BookOpenIcon,
  ImageIcon,
  SaveIcon,
  TagIcon,
  UserIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { BOOK_CATEGORIES } from "@/lib/book-categories";
import { booksApi } from "@/lib/server-api";

const MAX_TITLE_LENGTH = 150;
const MAX_AUTHOR_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 1000;

const EMPTY_FORM = {
  title: "",
  author: "",
  category: "",
  image: "",
  description: "",
};

function bookToForm(book) {
  if (!book) return EMPTY_FORM;

  return {
    title: book.title ?? "",
    author: book.author ?? "",
    category: book.category ?? "",
    image: book.image ?? "",
    description: book.description ?? "",
  };
}

function isValidImageUrl(value) {
  if (value.startsWith("/api/images/")) return true;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function validate(form) {
  const errors = {};

  if (!form.title.trim()) {
    errors.title = "Please enter the book title.";
  } else if (form.title.trim().length > MAX_TITLE_LENGTH) {
    errors.title = `Keep the title under ${MAX_TITLE_LENGTH} characters.`;
  }

  if (!form.author.trim()) {
    errors.author = "Please enter the author name.";
  } else if (form.author.trim().length > MAX_AUTHOR_LENGTH) {
    errors.author = `Keep the author name under ${MAX_AUTHOR_LENGTH} characters.`;
  }

  if (!BOOK_CATEGORIES.includes(form.category)) {
    errors.category = "Please choose a category.";
  }

  if (!form.image.trim() || !isValidImageUrl(form.image.trim())) {
    errors.image = "Please enter a valid image URL.";
  }

  if (!form.description.trim()) {
    errors.description = "Please add a short description.";
  } else if (form.description.trim().length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Keep the description under ${MAX_DESCRIPTION_LENGTH} characters.`;
  }

  return errors;
}

export function EditBookDialog({ book, open, onOpenChange, onSaved }) {
  const [form, setForm] = useState(() => bookToForm(book));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  function updateField(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => {
      if (!previous[field]) return previous;
      return { ...previous, [field]: undefined };
    });

    if (field === "image") {
      setImageFailed(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const nextErrors = validate(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.add({
        type: "error",
        title: "Check the form",
        description: "Please fix the highlighted fields and try again.",
      });
      return;
    }

    setSaving(true);

    try {
      const data = await booksApi.update(book.id, {
        title: form.title.trim(),
        author: form.author.trim(),
        category: form.category,
        image: form.image.trim(),
        description: form.description.trim(),
      });

      onSaved(data.book);
      onOpenChange(false);

      toast.add({
        type: "success",
        title: "Book updated",
        description: `“${data.book?.title || form.title}” has been saved.`,
      });
    } catch (error) {
      const message =
        error?.status === 401
          ? "Your session expired. Please log in again."
          : error?.message || "Could not update this book. Please try again.";

      setFormError(message);
      toast.add({
        type: "error",
        title: "Update failed",
        description: message,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit book</DialogTitle>
          <DialogDescription>
            Update the details for “{book?.title || "this book"}”. Changes are
            saved to your library immediately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup>
            <Field data-invalid={Boolean(errors.image)}>
              <FieldLabel htmlFor="edit-image">Cover image URL</FieldLabel>

              <div className="flex items-start gap-3">
                <div className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-md bg-muted ring-1 ring-foreground/10">
                  {form.image && !imageFailed ? (
                    <img
                      src={form.image}
                      alt=""
                      className="h-full w-full object-cover"
                      onError={() => setImageFailed(true)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <BookOpenIcon className="size-6" aria-hidden="true" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="relative">
                    <ImageIcon
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id="edit-image"
                      value={form.image}
                      onChange={(event) =>
                        updateField("image", event.target.value)
                      }
                      placeholder="https://example.com/cover.jpg"
                      className="h-9 pl-9"
                      maxLength={2048}
                      disabled={saving}
                      aria-invalid={Boolean(errors.image)}
                      required
                    />
                  </div>
                </div>
              </div>

              <FieldError>{errors.image}</FieldError>
            </Field>

            <Field data-invalid={Boolean(errors.title)}>
              <FieldLabel htmlFor="edit-title">Book title</FieldLabel>
              <div className="relative">
                <BookOpenIcon
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="edit-title"
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  className="h-9 pl-9"
                  maxLength={MAX_TITLE_LENGTH}
                  disabled={saving}
                  aria-invalid={Boolean(errors.title)}
                  required
                />
              </div>
              <FieldError>{errors.title}</FieldError>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.author)}>
                <FieldLabel htmlFor="edit-author">Author name</FieldLabel>
                <div className="relative">
                  <UserIcon
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="edit-author"
                    value={form.author}
                    onChange={(event) =>
                      updateField("author", event.target.value)
                    }
                    className="h-9 pl-9"
                    maxLength={MAX_AUTHOR_LENGTH}
                    disabled={saving}
                    aria-invalid={Boolean(errors.author)}
                    required
                  />
                </div>
                <FieldError>{errors.author}</FieldError>
              </Field>

              <Field data-invalid={Boolean(errors.category)}>
                <FieldLabel htmlFor="edit-category">Category</FieldLabel>
                <Select
                  value={form.category || null}
                  onValueChange={(value) => updateField("category", value)}
                  disabled={saving}
                  required
                >
                  <SelectTrigger
                    id="edit-category"
                    className="h-9 w-full"
                    aria-invalid={Boolean(errors.category)}
                  >
                    <TagIcon aria-hidden="true" />
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {BOOK_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{errors.category}</FieldError>
              </Field>
            </div>

            <Field data-invalid={Boolean(errors.description)}>
              <FieldLabel htmlFor="edit-description">Description</FieldLabel>
              <Textarea
                id="edit-description"
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                className="min-h-28 resize-y"
                maxLength={MAX_DESCRIPTION_LENGTH}
                disabled={saving}
                aria-invalid={Boolean(errors.description)}
                required
              />
              <p className="text-xs text-muted-foreground">
                {form.description.length}/{MAX_DESCRIPTION_LENGTH} characters
              </p>
              <FieldError>{errors.description}</FieldError>
            </Field>

            {formError ? (
              <p
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
              >
                {formError}
              </p>
            ) : null}
          </FieldGroup>

          <DialogFooter className="mt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Spinner /> : <SaveIcon aria-hidden="true" />}
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}