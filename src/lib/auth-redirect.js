const DEFAULT_PATH = "/";

export function sanitizeNextPath(value, fallback = DEFAULT_PATH) {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  if (value.includes("\\")) return fallback;
  if (value === "/login" || value === "/register") return fallback;
  return value;
}

export function loginHref(nextPath) {
  const safePath = sanitizeNextPath(nextPath);

  if (safePath === DEFAULT_PATH) return "/login";

  return `/login?next=${encodeURIComponent(safePath)}`;
}

export function registerHref(nextPath) {
  const safePath = sanitizeNextPath(nextPath);

  if (safePath === DEFAULT_PATH) return "/register";

  return `/register?next=${encodeURIComponent(safePath)}`;
}

export function loginHrefAfterRegister(nextPath) {
  const safePath = sanitizeNextPath(nextPath);
  const params = new URLSearchParams({ registered: "1" });

  if (safePath !== DEFAULT_PATH) {
    params.set("next", safePath);
  }

  return `/login?${params.toString()}`;
}
