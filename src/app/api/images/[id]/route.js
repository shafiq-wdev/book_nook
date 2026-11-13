import { ObjectId } from "mongodb";

import { getDb, isMongoConfigured } from "@/lib/mongodb";

function toBytes(data) {
  if (!data) return null;
  if (Buffer.isBuffer(data)) return data;
  if (data instanceof Uint8Array) return data;
  if (data.buffer instanceof Uint8Array) return data.buffer;
  if (data.buffer instanceof ArrayBuffer) return new Uint8Array(data.buffer);

  return null;
}

export async function GET(_request, { params }) {
  const { id } = await params;

  if (!ObjectId.isValid(id) || !isMongoConfigured()) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const db = await getDb();
    const image = await db
      .collection("bookImages")
      .findOne({ _id: new ObjectId(id) });

    const bytes = toBytes(image?.data);

    if (!bytes) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(bytes, {
      headers: {
        "Content-Type": image.contentType || "application/octet-stream",
        "Content-Length": String(bytes.byteLength),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Unable to load a book image", error);

    return new Response("Unable to load image", { status: 500 });
  }
}
