import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { BOOK_CATEGORIES } from "@/lib/book-categories";
import { createBook } from "@/lib/books";
import { isMongoConfigured } from "@/lib/mongodb";

const MAX_TITLE_LENGTH = 150;
const MAX_AUTHOR_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_IMAGE_URL_LENGTH = 2048;

function jsonError(message, status) {
  return Response.json({ message }, { status });
}

function readText(value) {
  return typeof value === "string" ? value.trim() : "";
}

const LOCAL_IMAGE_PATH = /^\/api\/images\/[a-f0-9]{24}$/i;

function isValidImageUrl(value) {
  if (LOCAL_IMAGE_PATH.test(value)) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export async function POST(request) {
  let session;

  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch (error) {
    console.error("Unable to verify the session for a new book", error);
    return jsonError("Unable to verify your session. Please log in again.", 401);
  }

  if (!session?.user) {
    return jsonError("Please log in before adding a book.", 401);
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    return jsonError("Invalid book data.", 400);
  }

  const title = readText(payload?.title);
  const author = readText(payload?.author);
  const category = readText(payload?.category);
  const image = readText(payload?.image);
  const description = readText(payload?.description);

  if (!title) {
    return jsonError("Book title is required.", 400);
  }

  if (title.length > MAX_TITLE_LENGTH) {
    return jsonError(
      `Book title must be ${MAX_TITLE_LENGTH} characters or less.`,
      400
    );
  }

  if (!author) {
    return jsonError("Author name is required.", 400);
  }

  if (author.length > MAX_AUTHOR_LENGTH) {
    return jsonError(
      `Author name must be ${MAX_AUTHOR_LENGTH} characters or less.`,
      400
    );
  }

  if (!BOOK_CATEGORIES.includes(category)) {
    return jsonError("Please choose a valid category.", 400);
  }

  if (!image) {
    return jsonError("Book image is required.", 400);
  }

  if (image.length > MAX_IMAGE_URL_LENGTH || !isValidImageUrl(image)) {
    return jsonError("Book image URL is not valid.", 400);
  }

  if (!description) {
    return jsonError("Short description is required.", 400);
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return jsonError(
      `Short description must be ${MAX_DESCRIPTION_LENGTH} characters or less.`,
      400
    );
  }

  if (!isMongoConfigured()) {
    return jsonError(
      "The book database is not configured. Add MONGODB_URI to the environment.",
      503
    );
  }

  const userEmail = session.user.email?.trim().toLowerCase() ?? "";
  const userName =
    session.user.name?.trim() || userEmail.split("@")[0] || "BookNook reader";

  try {
    const book = await createBook({
      title,
      author,
      category,
      image,
      description,
      userId: session.user.id,
      userName,
      userEmail,
    });

    return Response.json({ book }, { status: 201 });
  } catch (error) {
    console.error("Unable to save the new book", error);

    return jsonError(
      "We could not save your book right now. Please try again.",
      500
    );
  }
}
