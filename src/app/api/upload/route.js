import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getDb, isMongoConfigured } from "@/lib/mongodb";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function jsonError(message, status) {
  return Response.json({ message }, { status });
}

function isUploadFile(value) {
  return (
    value &&
    typeof value === "object" &&
    typeof value.arrayBuffer === "function" &&
    typeof value.type === "string"
  );
}

async function uploadToImgbb({ buffer, contentType, filename, apiKey }) {
  const body = new FormData();
  body.append(
    "image",
    new Blob([buffer], { type: contentType }),
    filename || "book-cover"
  );

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      body,
      cache: "no-store",
    }
  );

  const result = await response.json().catch(() => null);
  const imageUrl = result?.data?.display_url || result?.data?.url;

  if (!response.ok || !result?.success || !imageUrl) {
    const error = new Error(
      result?.error?.message || "ImgBB image upload failed."
    );
    error.imgbbCode = result?.error?.code;
    throw error;
  }

  return imageUrl;
}

async function storeImageInDatabase({ buffer, contentType, filename }) {
  const db = await getDb();

  const result = await db.collection("bookImages").insertOne({
    filename: filename || "book-cover",
    contentType,
    size: buffer.byteLength,
    data: buffer,
    createdAt: new Date(),
  });

  return `/api/images/${result.insertedId.toString()}`;
}

export async function POST(request) {
  let session;

  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch (error) {
    console.error("Unable to verify the session for an image upload", error);
    return jsonError("Unable to verify your session. Please log in again.", 401);
  }

  if (!session?.user) {
    return jsonError("Please log in before uploading a book image.", 401);
  }

  let formData;

  try {
    formData = await request.formData();
  } catch {
    return jsonError("Invalid image upload request.", 400);
  }

  const file = formData.get("image");

  if (!isUploadFile(file)) {
    return jsonError("Please choose a book cover image.", 400);
  }

  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    return jsonError("Please choose a PNG, JPG or WEBP image.", 400);
  }

  if (file.size === 0) {
    return jsonError("The selected image is empty.", 400);
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return jsonError("Image size must be 5 MB or less.", 400);
  }

  let buffer;

  try {
    buffer = Buffer.from(await file.arrayBuffer());
  } catch (error) {
    console.error("Unable to read the uploaded image", error);
    return jsonError("We could not read that image. Please try again.", 400);
  }

  const apiKey =
    process.env.IMGBB_API_KEY || process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (apiKey) {
    try {
      const url = await uploadToImgbb({
        buffer,
        contentType: file.type,
        filename: file.name,
        apiKey,
      });

      return Response.json({ url, storage: "imgbb" });
    } catch (error) {
      console.warn(
        "ImgBB upload failed; falling back to MongoDB image storage",
        error.imgbbCode || error.message
      );
    }
  }

  if (!isMongoConfigured()) {
    return jsonError(
      "Image storage is not configured. Add MONGODB_URI or a valid IMGBB_API_KEY.",
      503
    );
  }

  try {
    const url = await storeImageInDatabase({
      buffer,
      contentType: file.type,
      filename: file.name,
    });

    return Response.json({ url, storage: "database" });
  } catch (error) {
    console.error("Unable to store the book image in MongoDB", error);

    return jsonError("Image upload failed. Please try again.", 500);
  }
}
