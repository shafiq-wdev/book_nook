import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { memoryAdapter } from "better-auth/adapters/memory";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

import { getPasswordError } from "./password.js";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "booknook";
const globalForAuth = globalThis;

const authBaseUrl = (
  process.env.BETTER_AUTH_URL || "http://localhost:3000"
).replace(/\/+$/, "");

const memoryDb = (globalForAuth.__booknookAuthMemoryDb ??= {
  user: [],
  session: [],
  account: [],
  verification: [],
});

let database;

if (uri) {
  const client =
    globalForAuth.__booknookAuthMongoClient ??
    new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });

  if (process.env.NODE_ENV !== "production") {
    globalForAuth.__booknookAuthMongoClient = client;
  }

  database = mongodbAdapter(client.db(dbName), { client });
} else {
  // Keep sign-up/sign-in usable in local development without MongoDB.
  database = memoryAdapter(memoryDb);
}

function assertValidPassword(password) {
  const passwordError = getPasswordError(password);

  if (passwordError) {
    throw new APIError("BAD_REQUEST", { message: passwordError });
  }
}

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  database,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  plugins: [
    jwt({
      jwt: {
        issuer: authBaseUrl,
        audience: authBaseUrl,
        expirationTime: "1h",
        definePayload: ({ user }) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }),
      },
    }),
  ],
  ...(googleClientId && googleClientSecret
    ? {
        socialProviders: {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        },
      }
    : {}),
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        assertValidPassword(ctx.body?.password);
      }
    }),
  },
});
