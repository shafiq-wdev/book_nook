import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "booknook";

let clientPromise;

export function isMongoConfigured() {
  return Boolean(uri);
}

function getClientPromise() {
  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (!clientPromise) {
    const options = {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    };

    if (process.env.NODE_ENV === "development") {
      if (!globalThis.__booknookMongoClientPromise) {
        globalThis.__booknookMongoClientPromise = new MongoClient(
          uri,
          options
        ).connect();
      }

      clientPromise = globalThis.__booknookMongoClientPromise;
    } else {
      clientPromise = new MongoClient(uri, options).connect();
    }
  }

  return clientPromise;
}

export async function getDb() {
  const client = await getClientPromise();
  return client.db(dbName);
}
