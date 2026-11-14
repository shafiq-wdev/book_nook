import { ObjectId } from "mongodb";

import { BORROW_DAYS } from "@/lib/borrow-config";
import { getDb } from "@/lib/mongodb";

const OBJECT_ID_PATTERN = /^[a-f0-9]{24}$/i;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function isValidBookId(value) {
  return typeof value === "string" && OBJECT_ID_PATTERN.test(value);
}

function toIso(value) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function serializeBorrow(borrow) {
  return {
    id: borrow._id ? borrow._id.toString() : null,
    bookId: borrow.bookId ? borrow.bookId.toString() : null,
    userId: borrow.userId ?? null,
    userName: borrow.userName || "",
    userEmail: borrow.userEmail || "",
    status: borrow.status || "borrowed",
    borrowedAt: toIso(borrow.borrowedAt),
    dueAt: toIso(borrow.dueAt),
    returnedAt: toIso(borrow.returnedAt),
  };
}

export async function findActiveBorrow({ bookId, userId }) {
  const db = await getDb();

  return db.collection("borrows").findOne({
    bookId: new ObjectId(bookId),
    userId,
    status: "borrowed",
    returnedAt: null,
  });
}

export async function createBorrow({ bookId, user }) {
  const db = await getDb();
  const borrowedAt = new Date();
  const dueAt = new Date(borrowedAt.getTime() + BORROW_DAYS * DAY_IN_MS);

  const borrow = {
    bookId: new ObjectId(bookId),
    userId: user.id,
    userName: user.name?.trim() || user.email?.split("@")[0] || "BookNook reader",
    userEmail: user.email?.trim().toLowerCase() || "",
    status: "borrowed",
    borrowedAt,
    dueAt,
    returnedAt: null,
  };

  const result = await db.collection("borrows").insertOne(borrow);

  return serializeBorrow({ ...borrow, _id: result.insertedId });
}
