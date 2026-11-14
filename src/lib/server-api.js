const configuredBaseUrl =
  process.env.NEXT_PUBLIC_SERVER_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

export const SERVER_BASE_URL = configuredBaseUrl.replace(/\/+$/, "");

const TOKEN_ENDPOINT = "/api/auth/token";
const EXPIRY_SKEW_MS = 30_000;

class TokenCache {
  constructor() {
    this.token = null;
    this.expiresAt = 0;
    this.inFlight = null;
  }
}

const tokenCache = new TokenCache();

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function readBody(response) {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function readTokenExpiry(token) {
  try {
    const [, payload] = token.split(".");

    if (!payload) return Date.now() + 5 * 60 * 1000;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    const data = JSON.parse(atob(padded));

    return typeof data.exp === "number"
      ? data.exp * 1000
      : Date.now() + 5 * 60 * 1000;
  } catch {
    return Date.now() + 5 * 60 * 1000;
  }
}

async function requestToken() {
  if (typeof window === "undefined") return null;

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      credentials: "include",
      cache: "no-store",
      headers: { accept: "application/json" },
    });

    if (!response.ok) return null;

    const data = await response.json().catch(() => null);

    if (!data?.token) return null;

    tokenCache.token = data.token;
    tokenCache.expiresAt = readTokenExpiry(data.token);

    return tokenCache.token;
  } catch {
    return null;
  }
}

/**
 * Ask better-auth for a short-lived JWT. Tokens are cached until shortly
 * before they expire, and concurrent callers share one request.
 */
export async function getAuthToken({ force = false } = {}) {
  if (typeof window === "undefined") return null;

  if (
    !force &&
    tokenCache.token &&
    tokenCache.expiresAt - EXPIRY_SKEW_MS > Date.now()
  ) {
    return tokenCache.token;
  }

  if (!tokenCache.inFlight) {
    tokenCache.inFlight = requestToken().finally(() => {
      tokenCache.inFlight = null;
    });
  }

  return tokenCache.inFlight;
}

export function clearAuthToken() {
  tokenCache.token = null;
  tokenCache.expiresAt = 0;
  tokenCache.inFlight = null;
}

function buildHeaders(headers, body, token) {
  const requestHeaders = new Headers(headers);

  requestHeaders.set("Accept", "application/json");

  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  return requestHeaders;
}

/**
 * Call the Express API with a better-auth JWT. The session cookie is still
 * sent so the fallback middleware path works, but private routes verify the
 * signed token first.
 */
export async function apiRequest(path, options = {}) {
  const { method = "GET", body, headers, signal, cache = "no-store" } = options;
  const payload = body !== undefined ? JSON.stringify(body) : undefined;

  async function send(token) {
    return fetch(`${SERVER_BASE_URL}${path}`, {
      method,
      headers: buildHeaders(headers, body, token),
      body: payload,
      credentials: "include",
      cache,
      signal,
    });
  }

  let token = await getAuthToken();
  let response;

  try {
    response = await send(token);

    if (response.status === 401 && token) {
      // The token may have expired between the cache read and the request.
      clearAuthToken();
      const freshToken = await getAuthToken({ force: true });

      if (freshToken) {
        token = freshToken;
        response = await send(token);
      }
    }
  } catch (error) {
    if (error?.name === "AbortError") throw error;

    throw new ApiError(
      "Unable to reach the BookNook API. Please make sure the server is running.",
      0
    );
  }

  const data = await readBody(response);

  if (!response.ok) {
    const message =
      data && typeof data === "object" && data.message
        ? data.message
        : "Something went wrong. Please try again.";

    throw new ApiError(message, response.status, data);
  }

  return data;
}

export const booksApi = {
  list: (options) => apiRequest("/books", options),
  listMine: (options) => apiRequest("/books?mine=true", options),
  get: (id, options) =>
    apiRequest(`/books/${encodeURIComponent(id)}`, options),
  create: (book) =>
    apiRequest("/books", { method: "POST", body: book }),
  update: (id, book) =>
    apiRequest(`/books/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: book,
    }),
  remove: (id) =>
    apiRequest(`/books/${encodeURIComponent(id)}`, { method: "DELETE" }),
};

export const borrowsApi = {
  list: (options) => apiRequest("/borrows", options),
  forBook: (bookId, options) =>
    apiRequest(
      `/borrows?bookId=${encodeURIComponent(bookId)}`,
      options
    ),
  create: (bookId) =>
    apiRequest("/borrows", { method: "POST", body: { bookId } }),
  return: (id) =>
    apiRequest(`/borrows/${encodeURIComponent(id)}`, { method: "DELETE" }),
};
