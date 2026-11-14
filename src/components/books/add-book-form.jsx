/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpenIcon,
  FileTextIcon,
  ImagePlusIcon,
  MailIcon,
  PenLineIcon,
  TagIcon,
  UploadIcon,
  UserIcon,
} from "lucide-react";
import { cn } from "cn";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
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

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_TITLE_LENGTH = 150;
const MAX_AUTHOR_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 1000;

async function readJson(response) {
  return response.json().catch(() => ({}));
}

async function uploadBookImage(file) {
  const body = new FormData();
  body.append("image", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body,
  });

  const result = await readJson(response);

  if (!response.ok || !result.url) {
    throw new Error(
      result.message || "Image upload failed. Please try again."
    );
  }

  return result.url;
}

async function saveBook(book) {
  const result = await booksApi.create(book);

  return result.book;
}

export function AddBookForm() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null);
  const previewUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  function clearFieldError(name) {
    setFieldErrors((previous) => {
      if (!previous[name]) return previous;

      return { ...previous, [name]: undefined };
    });
  }

  function clearImagePreview() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setImagePreview("");
  }

  function resetImageInput() {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function selectImage(file) {
    clearImagePreview();
    setImageFile(null);
    resetImageInput();

    if (!file) {
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      const message = "Please choose a PNG, JPG or WEBP image.";
      setFieldErrors((previous) => ({ ...previous, image: message }));
      toast.add({
        type: "error",
        title: "Invalid image",
        description: message,
      });
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      const message = "Image size must be 5 MB or less.";
      setFieldErrors((previous) => ({ ...previous, image: message }));
      toast.add({
        type: "error",
        title: "Image is too large",
        description: message,
      });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;
    setImageFile(file);
    setImagePreview(previewUrl);
    clearFieldError("image");
  }

  function handleImageChange(event) {
    selectImage(event.target.files?.[0] ?? null);
  }

  function handleRemoveImage() {
    clearImagePreview();
    setImageFile(null);
    resetImageInput();
  }

  function validate() {
    const errors = {};
    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      errors.title = "Please enter the book title.";
    } else if (trimmedTitle.length > MAX_TITLE_LENGTH) {
      errors.title = `Keep the title under ${MAX_TITLE_LENGTH} characters.`;
    }

    if (!trimmedAuthor) {
      errors.author = "Please enter the author name.";
    } else if (trimmedAuthor.length > MAX_AUTHOR_LENGTH) {
      errors.author = `Keep the author name under ${MAX_AUTHOR_LENGTH} characters.`;
    }

    if (!category) {
      errors.category = "Please choose a category.";
    }

    if (!imageFile) {
      errors.image = "Please choose a book cover image.";
    }

    if (!trimmedDescription) {
      errors.description = "Please add a short description.";
    } else if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
      errors.description = `Keep the description under ${MAX_DESCRIPTION_LENGTH} characters.`;
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return null;
    }

    return {
      title: trimmedTitle,
      author: trimmedAuthor,
      category,
      description: trimmedDescription,
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const values = validate();

    if (!values) {
      toast.add({
        type: "error",
        title: "Check the form",
        description: "Please fix the highlighted fields and try again.",
      });
      return;
    }

    setSubmitting(true);

    const toastId = toast.add({
      type: "loading",
      title: "Adding your book…",
      description: "Uploading the cover image.",
      timeout: 0,
    });

    try {
      const image = await uploadBookImage(imageFile);

      toast.update(toastId, {
        type: "loading",
        title: "Adding your book…",
        description: "Saving it to the library.",
      });

      const book = await saveBook({ ...values, image });
      const bookTitle = book?.title || values.title;

      toast.update(toastId, {
        type: "success",
        title: "Book added successfully!",
        description: `“${bookTitle}” is now on the shelves.`,
        timeout: 5000,
      });

      setTitle("");
      setAuthor("");
      setCategory(null);
      setDescription("");
      setFieldErrors({});
      setImageFile(null);
      clearImagePreview();
      resetImageInput();

      router.push("/books");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      setFormError(message);
      toast.update(toastId, {
        type: "error",
        title: "Could not add book",
        description: message,
        timeout: 6000,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="max-w-3xl">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <PenLineIcon className="size-5 text-primary" aria-hidden="true" />
          Book Information
        </CardTitle>
        <CardDescription>
          Enter the details below to publish your book to the BookNook
          library.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup>
            <Field data-invalid={Boolean(fieldErrors.title)}>
              <FieldLabel htmlFor="title">
                Book Title <span className="text-destructive">*</span>
              </FieldLabel>

              <div className="relative">
                <BookOpenIcon
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter book title"
                  className="h-10 pl-9"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    clearFieldError("title");
                  }}
                  maxLength={MAX_TITLE_LENGTH}
                  autoComplete="off"
                  disabled={submitting}
                  aria-invalid={Boolean(fieldErrors.title)}
                  required
                />
              </div>

              <FieldError>{fieldErrors.title}</FieldError>
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field data-invalid={Boolean(fieldErrors.author)}>
                <FieldLabel htmlFor="author">
                  Author Name <span className="text-destructive">*</span>
                </FieldLabel>

                <div className="relative">
                  <UserIcon
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="author"
                    name="author"
                    placeholder="Enter author name"
                    className="h-10 pl-9"
                    value={author}
                    onChange={(event) => {
                      setAuthor(event.target.value);
                      clearFieldError("author");
                    }}
                    maxLength={MAX_AUTHOR_LENGTH}
                    autoComplete="off"
                    disabled={submitting}
                    aria-invalid={Boolean(fieldErrors.author)}
                    required
                  />
                </div>

                <FieldError>{fieldErrors.author}</FieldError>
              </Field>

              <Field data-invalid={Boolean(fieldErrors.category)}>
                <FieldLabel htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </FieldLabel>

                <div className="relative">
                  <TagIcon
                    className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Select
                    name="category"
                    value={category}
                    onValueChange={(value) => {
                      setCategory(value);
                      clearFieldError("category");
                    }}
                    disabled={submitting}
                    required
                  >
                    <SelectTrigger
                      id="category"
                      className="h-10 w-full pl-9"
                      aria-invalid={Boolean(fieldErrors.category)}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {BOOK_CATEGORIES.map((bookCategory) => (
                        <SelectItem key={bookCategory} value={bookCategory}>
                          {bookCategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <FieldError>{fieldErrors.category}</FieldError>
              </Field>
            </div>

            <Field data-invalid={Boolean(fieldErrors.image)}>
              <FieldLabel htmlFor="image">
                Book Image <span className="text-destructive">*</span>
              </FieldLabel>

              <Input
                ref={fileInputRef}
                id="image"
                name="image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
                disabled={submitting}
                className="peer sr-only"
                aria-invalid={Boolean(fieldErrors.image)}
              />

              <label
                htmlFor="image"
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/30 px-5 py-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/60 peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50",
                  fieldErrors.image
                    ? "border-destructive/50"
                    : "border-border"
                )}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Selected book cover preview"
                    className="mb-4 aspect-[3/4] w-36 rounded-lg object-cover shadow-md"
                  />
                ) : (
                  <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ImagePlusIcon className="size-6" aria-hidden="true" />
                  </div>
                )}

                <span className="flex items-center gap-2 text-sm font-medium">
                  <UploadIcon className="size-4" aria-hidden="true" />
                  {imageFile ? "Change cover image" : "Upload book cover"}
                </span>

                <span className="mt-2 text-xs text-muted-foreground">
                  PNG, JPG or WEBP · maximum 5 MB
                </span>
              </label>

              {imageFile ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-fit text-muted-foreground"
                  onClick={handleRemoveImage}
                  disabled={submitting}
                >
                  Remove image
                </Button>
              ) : null}

              <FieldError>{fieldErrors.image}</FieldError>
            </Field>

            <Field data-invalid={Boolean(fieldErrors.description)}>
              <FieldLabel htmlFor="description">
                Short Description <span className="text-destructive">*</span>
              </FieldLabel>

              <div className="relative">
                <FileTextIcon
                  className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Write a short description about this book..."
                  className="min-h-32 resize-y pl-9"
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                    clearFieldError("description");
                  }}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  disabled={submitting}
                  aria-invalid={Boolean(fieldErrors.description)}
                  required
                />
              </div>

              <FieldDescription>
                {description.length}/{MAX_DESCRIPTION_LENGTH} characters
              </FieldDescription>
              <FieldError>{fieldErrors.description}</FieldError>
            </Field>

            <div className="space-y-4 rounded-xl border bg-muted/30 p-4 sm:p-5">
              <div>
                <h3 className="text-sm font-semibold">
                  Contributor Information
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  These details come from your logged-in account.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="userName">User Name</FieldLabel>
                  <div className="relative">
                    <UserIcon
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id="userName"
                      value={user?.name ?? ""}
                      readOnly
                      className="h-10 bg-background pl-9"
                    />
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="userEmail">Email Address</FieldLabel>
                  <div className="relative">
                    <MailIcon
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id="userEmail"
                      type="email"
                      value={user?.email ?? ""}
                      readOnly
                      className="h-10 bg-background pl-9"
                    />
                  </div>
                </Field>
              </div>
            </div>

            {formError ? (
              <div
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
              >
                {formError}
              </div>
            ) : null}

            <div className="space-y-3">
              <Button
                type="submit"
                size="lg"
                className="h-10 w-full gap-2 text-base"
                disabled={submitting}
              >
                {submitting ? (
                  <Spinner className="size-5" />
                ) : (
                  <BookOpenIcon className="size-5" aria-hidden="true" />
                )}
                {submitting ? "Adding Book…" : "Add Book"}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                By adding this book, you agree to share its information with
                the BookNook community.
              </p>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
