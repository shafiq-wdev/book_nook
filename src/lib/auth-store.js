const STORAGE_KEY = "booknook:user";

const SERVER_SNAPSHOT = Object.freeze({ user: null, isLoaded: false });

let cachedRaw;
let cachedSnapshot = SERVER_SNAPSHOT;
const listeners = new Set();

function parseUser(raw) {
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getAuthSnapshot() {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;

  let raw = null;

  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }

  if (raw === cachedRaw) return cachedSnapshot;

  cachedRaw = raw;
  cachedSnapshot = { user: parseUser(raw), isLoaded: true };

  return cachedSnapshot;
}

export function getAuthServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export function subscribeToAuth(callback) {
  listeners.add(callback);

  function handleStorage(event) {
    if (event.key === STORAGE_KEY || event.key === null) callback();
  }

  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

export function setAuthUser(user) {
  try {
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Storage can be unavailable in private browsing; keep the in-memory session.
  }

  cachedRaw = undefined;
  cachedSnapshot = { user: user ?? null, isLoaded: true };
  listeners.forEach((listener) => listener());
}
