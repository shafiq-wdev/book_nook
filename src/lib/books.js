import { demoBooks } from "@/lib/demo-books";
import { getDb, isMongoConfigured } from "@/lib/mongodb";

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
    createdAt,
  };
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
