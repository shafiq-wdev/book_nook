import { ObjectId } from "mongodb";

import { demoBooks } from "@/lib/demo-books";
import { getDb, isMongoConfigured } from "@/lib/mongodb";

const OBJECT_ID_PATTERN = /^[a-f0-9]{24}$/i;

function serializeBook(book) {
  const createdAt =
    book.createdAt instanceof Date
      ? book.createdAt.toISOString()
      : book.createdAt ?? null;

  return {
    id: book._id ? book._id.toString() : book.id,
    title: book.title || "Untitled",
    author: book.author || "Unknown author",
    category: book.category || "Uncategorized",
    image: book.image || book.coverImage || book.imageUrl || "",
    description: book.description || "",
    userId: book.userId ?? null,
    userName: book.userName || "",
    userEmail: book.userEmail || "",
    createdAt,
  };
}

export async function createBook({
  title,
  author,
  category,
  image,
  description,
  userId,
  userName,
  userEmail,
}) {
  const db = await getDb();

  const book = {
    title,
    author,
    category,
    image,
    description,
    userId,
    userName,
    userEmail,
    createdAt: new Date(),
  };

  const result = await db.collection("books").insertOne(book);

  return serializeBook({ ...book, _id: result.insertedId });
}

export async function getAllBooks() {
  if (!isMongoConfigured()) {
    return { books: demoBooks, source: "demo" };
  }

  try {
    const db = await getDb();
    const books = await db
      .collection("books")
      .find({})
      .sort({ createdAt: -1, _id: -1 })
      .toArray();

    return { books: books.map(serializeBook), source: "database" };
  } catch (error) {
    console.error("Unable to load books from MongoDB", error);
    return { books: [], source: "error" };
  }
}

export async function getBookById(id) {
  const bookId = typeof id === "string" ? id.trim() : "";

  if (!bookId) {
    return { book: null, source: "not-found" };
  }

  const demoBook = demoBooks.find((book) => book.id === bookId) ?? null;

  if (!isMongoConfigured() || !OBJECT_ID_PATTERN.test(bookId)) {
    return demoBook
      ? { book: demoBook, source: "demo" }
      : { book: null, source: "not-found" };
  }

  try {
    const db = await getDb();
    const book = await db
      .collection("books")
      .findOne({ _id: new ObjectId(bookId) });

    if (book) {
      return { book: serializeBook(book), source: "database" };
    }

    return demoBook
      ? { book: demoBook, source: "demo" }
      : { book: null, source: "not-found" };
  } catch (error) {
    console.error("Unable to load a book from MongoDB", error);
    return { book: null, source: "error" };
  }
}

export async function getLatestBooks(limit = 6) {
  if (!isMongoConfigured()) {
    return { books: demoBooks.slice(0, limit), source: "demo" };
  }

  try {
    const db = await getDb();
    const books = await db
      .collection("books")
      .find({})
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
      .toArray();

    if (books.length === 0) {
      return { books: demoBooks.slice(0, limit), source: "demo" };
    }

    return { books: books.map(serializeBook), source: "database" };
  } catch (error) {
    console.error("Unable to load the latest books from MongoDB", error);
    return { books: demoBooks.slice(0, limit), source: "demo" };
  }
}
