import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getBookById } from "@/lib/books";
import {
  createBorrow,
  findActiveBorrow,
  isValidBookId,
  serializeBorrow,
} from "@/lib/borrows";
import { isMongoConfigured } from "@/lib/mongodb";

function jsonError(message, status) {
  return Response.json({ message }, { status });
}

async function getSession() {
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch (error) {
    console.error("Unable to verify the session for a borrow", error);
    return null;
  }
}

export async function GET(request) {
  const session = await getSession();

  if (!session?.user) {
    return jsonError("Please log in to view your borrows.", 401);
  }

  const bookId = new URL(request.url).searchParams.get("bookId")?.trim() ?? "";

  if (!isValidBookId(bookId)) {
    return jsonError("Invalid book id.", 400);
  }

  if (!isMongoConfigured()) {
    return Response.json({ borrow: null });
  }

  try {
    const borrow = await findActiveBorrow({
      bookId,
      userId: session.user.id,
    });

    return Response.json({
      borrow: borrow ? serializeBorrow(borrow) : null,
    });
  } catch (error) {
    console.error("Unable to load the borrow status", error);
    return jsonError("We could not check this book right now.", 500);
  }
}

export async function POST(request) {
  const session = await getSession();

  if (!session?.user) {
    return jsonError("Please log in before borrowing a book.", 401);
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    return jsonError("Invalid borrow request.", 400);
  }

  const bookId = typeof payload?.bookId === "string" ? payload.bookId.trim() : "";

  if (!isValidBookId(bookId)) {
    return jsonError("Invalid book id.", 400);
  }

  if (!isMongoConfigured()) {
    return jsonError(
      "The book database is not configured. Add MONGODB_URI to the environment.",
      503
    );
  }

  try {
    const { book } = await getBookById(bookId);

    if (!book) {
      return jsonError("This book could not be found.", 404);
    }

    if (book.userId && book.userId === session.user.id) {
      return jsonError("You cannot borrow a book you added yourself.", 400);
    }

    const existing = await findActiveBorrow({
      bookId,
      userId: session.user.id,
    });

    if (existing) {
      return Response.json(
        {
          message: "You have already borrowed this book.",
          borrow: serializeBorrow(existing),
        },
        { status: 409 }
      );
    }

    const borrow = await createBorrow({
      bookId,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
    });

    return Response.json({ borrow }, { status: 201 });
  } catch (error) {
    console.error("Unable to borrow the book", error);

    return jsonError(
      "We could not borrow this book right now. Please try again.",
      500
    );
  }
}
