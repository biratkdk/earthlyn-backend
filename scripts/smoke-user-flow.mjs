import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const base = process.env.SMOKE_BASE_URL || "http://127.0.0.1:5000";
const cookieMap = new Map();

function absorbCookies(headers) {
  const raw = headers.getSetCookie ? headers.getSetCookie().join(", ") : String(headers.get("set-cookie") || "");
  for (const match of raw.matchAll(/(shelfscanner_(?:session|csrf)=[^;,]+)/g)) {
    const pair = match[1];
    cookieMap.set(pair.split("=")[0], pair);
  }
}

function cookieHeader() {
  return [...cookieMap.values()].join("; ");
}

function csrfToken() {
  const pair = cookieMap.get("shelfscanner_csrf") || "";
  return pair ? decodeURIComponent(pair.split("=").slice(1).join("=")) : "";
}

async function request(endpoint, options = {}) {
  const method = options.method || "GET";
  const unsafe = !["GET", "HEAD", "OPTIONS"].includes(method);
  const headers = { ...(options.headers || {}) };
  if (cookieHeader()) headers.Cookie = cookieHeader();
  if (unsafe) headers["X-ShelfScanner-Request"] = "fetch";
  if (unsafe && csrfToken()) headers["X-ShelfScanner-CSRF"] = csrfToken();

  const response = await fetch(`${base}${endpoint}`, { ...options, method, headers });
  absorbCookies(response.headers);
  const text = await response.text();
  const body = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(`${method} ${endpoint} failed ${response.status}: ${JSON.stringify(body)}`);
  }
  return body;
}

const suffix = Date.now();
const user = await request("/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    displayName: "Vercel Ready Reader",
    email: `vercel-ready-${suffix}@example.com`,
    password: "SmokeTest123!"
  })
});

const me = await request("/auth/me");
const preferences = await request("/api/preferences", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    genres: ["Science Fiction", "Historical Fiction", "Mystery", "Fantasy"],
    pace: "Either",
    length: "300-500pp",
    authors: "Frank Herbert, Andy Weir, Madeline Miller, Amor Towles",
    loved: "Dune, Project Hail Mary, Circe, A Gentleman in Moscow",
    minRating: 4
  })
});

const csvData = await readFile(path.join(root, "packages/frontend/public/demo/goodreads-sample.csv"), "utf8");
const goodreads = await request("/api/preferences/goodreads", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ csvData })
});

const imageBuffer = await readFile(path.join(root, "packages/frontend/public/fairy/bookshelf-demo.jpg"));
const form = new FormData();
form.append("image", new Blob([imageBuffer], { type: "image/jpeg" }), "bookshelf-demo.jpg");
const scan = await request("/api/scan", { method: "POST", body: form });

const confirmed = (scan.detections || scan.books || [])
  .slice(0, 8)
  .map((book) => ({ title: book.title, author: book.author || "Unknown" }));

const recommendations = await request("/api/recommend", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ books: confirmed })
});

const first = recommendations.recommendations?.[0] || scan.books?.[0];
const saved = first
  ? await request("/api/books/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(first)
    })
  : null;
const readingList = await request("/api/books/list");
const discover = await request("/api/books/discover");

console.log(JSON.stringify({
  base,
  registered: user.user?.email,
  restoredUser: me.user?.email,
  csrfCookie: Boolean(csrfToken()),
  preferenceGenres: preferences.preferences?.genres?.length || 0,
  goodreadsImported: goodreads.imported,
  scanProvider: scan.detectionProvider,
  totalDetected: scan.totalDetected,
  confirmedCount: confirmed.length,
  recommendations: recommendations.recommendations?.length || 0,
  savedTitle: saved?.book?.title || null,
  readingListCount: readingList.books?.length || 0,
  discoverCount: discover.books?.length || 0
}, null, 2));
