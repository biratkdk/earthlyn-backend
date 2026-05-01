export const BASE_URL = globalThis.__SHELFSCANNER_API_BASE_URL__
  || (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL)
  || "";

const DEFAULT_TIMEOUT_MS = 20000;
const SCAN_TIMEOUT_MS = 70000;
const CLIENT_REQUEST_HEADER = "X-ShelfScanner-Request";
const CSRF_COOKIE_NAME = "shelfscanner_csrf";

export function buildApiUrl(endpoint) {
  return `${BASE_URL}${endpoint}`;
}

function readCookie(name) {
  if (typeof document === "undefined") return "";
  const match = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
}

function mergeAbortSignals(...signals) {
  const activeSignals = signals.filter(Boolean);
  if (!activeSignals.length) return undefined;
  if (activeSignals.length === 1) return activeSignals[0];
  if (AbortSignal.any) return AbortSignal.any(activeSignals);

  const controller = new AbortController();
  const abort = () => controller.abort();
  activeSignals.forEach((signal) => {
    if (signal.aborted) {
      abort();
    } else {
      signal.addEventListener("abort", abort, { once: true });
    }
  });
  return controller.signal;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const signal = mergeAbortSignals(controller.signal, options.signal);
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      credentials: "include",
      ...options,
      signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function readJsonResponse(response) {
  if (response.status === 204 || response.status === 205) return {};

  const text = await response.text();
  if (!text.trim()) {
    if (response.ok) {
      throw new Error("Server returned an empty response");
    }
    return { error: response.statusText || "API request failed" };
  }

  try {
    return JSON.parse(text);
  } catch {
    if (response.ok) {
      throw new Error("Server returned an invalid response");
    }
    return { error: response.statusText || "API request failed" };
  }
}

// Base fetch with credentials, JSON parsing, and timeouts.
export async function apiFetch(endpoint, options = {}) {
  const hasBody = options.body !== undefined && options.body !== null;
  const method = String(options.method || "GET").toUpperCase();
  const needsClientHeader = !["GET", "HEAD", "OPTIONS"].includes(method);
  const csrfToken = needsClientHeader ? readCookie(CSRF_COOKIE_NAME) : "";
  const headers = {
    ...(needsClientHeader ? { [CLIENT_REQUEST_HEADER]: "fetch" } : {}),
    ...(csrfToken ? { "X-ShelfScanner-CSRF": csrfToken } : {}),
    ...(hasBody && !(options.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
    ...options.headers,
  };

  const response = await fetchWithTimeout(buildApiUrl(endpoint), {
    ...options,
    headers,
  });

  const data = await readJsonResponse(response);

  if (!response.ok) {
    const validationMessage = Array.isArray(data.errors) && data.errors.length
      ? data.errors.join(". ")
      : "";
    const error = new Error(validationMessage || data.error || data.message || response.statusText || "API request failed");
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}

// Scan a bookshelf image.
export async function scanShelf(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);
  const csrfToken = readCookie(CSRF_COOKIE_NAME);

  const response = await fetchWithTimeout(buildApiUrl("/api/scan"), {
    method: "POST",
    headers: {
      [CLIENT_REQUEST_HEADER]: "fetch",
      ...(csrfToken ? { "X-ShelfScanner-CSRF": csrfToken } : {}),
    },
    body: formData,
  }, SCAN_TIMEOUT_MS);

  const data = await readJsonResponse(response);

  if (!response.ok) {
    const validationMessage = Array.isArray(data.errors) && data.errors.length
      ? data.errors.join(". ")
      : "";
    const error = new Error(validationMessage || data.error || data.message || response.statusText || "Scan failed");
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}

// Get recommendations.
export async function getRecommendations(books, options = {}) {
  return apiFetch("/api/recommend", {
    method: "POST",
    body: JSON.stringify({ books }),
    signal: options.signal,
  });
}

// Save preferences.
export async function savePreferences(prefs) {
  return apiFetch("/api/preferences", {
    method: "POST",
    body: JSON.stringify(prefs),
  });
}

// Get preferences.
export async function getPreferences() {
  return apiFetch("/api/preferences");
}

// Get discover books.
export async function getDiscover() {
  return apiFetch("/api/books/discover");
}

// Save book to reading list.
export async function saveBook(book) {
  return apiFetch("/api/books/save", {
    method: "POST",
    body: JSON.stringify(book),
  });
}

// Get reading list.
export async function getReadingList() {
  return apiFetch("/api/books/list");
}

// Remove book from reading list.
export async function removeBook(bookOrTitle) {
  const id = typeof bookOrTitle === "object" ? bookOrTitle?.readingListId || bookOrTitle?.reading_list_id : null;
  if (!id) {
    throw new Error("Saved book id is required to remove a book");
  }

  return apiFetch(`/api/books/remove/id/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

// Import Goodreads CSV.
export async function importGoodreads(csvData) {
  return apiFetch("/api/preferences/goodreads", {
    method: "POST",
    body: JSON.stringify({ csvData }),
  });
}
