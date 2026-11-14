const configuredBaseUrl =
  process.env.NEXT_PUBLIC_SERVER_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

export const SERVER_BASE_URL = configuredBaseUrl.replace(/\/+$/, "");

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

/**
 * Call the Express API with the browser's better-auth session cookie.
 * All private routes on the API trust that cookie, not a client email.
 */
export async function apiRequest(path, options = {}) {
  const { method = "GET", body, headers, signal, cache = "no-store" } = options;

  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");

  let payload;

  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
    payload = JSON.stringify(body);
  }

  let response;

  try {
    response = await fetch(`${SERVER_BASE_URL}${path}`, {
      method,
      headers: requestHeaders,
      body: payload,
      credentials: "include",
      cache,
      signal,
    });
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