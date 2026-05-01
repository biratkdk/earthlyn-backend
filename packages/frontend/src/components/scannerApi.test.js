import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { getDiscover, getRecommendations, readJsonResponse, removeBook, scanShelf } from "../services/api.js";

const calls = [];

globalThis.window = globalThis;

afterEach(() => {
  calls.length = 0;
  globalThis.fetch = undefined;
  globalThis.document = undefined;
});

test("scanShelf posts an image upload with cookie credentials", async () => {
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      status: 200,
      async text() {
        return JSON.stringify({ success: true, books: [], totalDetected: 0 });
      },
    };
  };

  const result = await scanShelf(new Blob(["fake-image"], { type: "image/png" }));

  assert.deepEqual(result, { success: true, books: [], totalDetected: 0 });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "/api/scan");
  assert.equal(calls[0].options.method, "POST");
  assert.equal(calls[0].options.credentials, "include");
  assert.equal(calls[0].options.headers["X-ShelfScanner-Request"], "fetch");
  assert.ok(calls[0].options.body instanceof FormData);
});

test("getRecommendations posts detected books as JSON", async () => {
  globalThis.document = { cookie: "shelfscanner_csrf=csrf-test-token" };
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      status: 200,
      async text() {
        return JSON.stringify({ success: true, recommendations: [] });
      },
    };
  };

  const books = [{ title: "Dune", author: "Frank Herbert" }];
  const result = await getRecommendations(books);

  assert.deepEqual(result, { success: true, recommendations: [] });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "/api/recommend");
  assert.equal(calls[0].options.method, "POST");
  assert.equal(calls[0].options.credentials, "include");
  assert.equal(calls[0].options.headers["X-ShelfScanner-Request"], "fetch");
  assert.equal(calls[0].options.headers["X-ShelfScanner-CSRF"], "csrf-test-token");
  assert.equal(calls[0].options.headers["Content-Type"], "application/json");
  assert.equal(calls[0].options.body, JSON.stringify({ books }));
});

test("readJsonResponse handles empty successful responses", async () => {
  const result = await readJsonResponse({
    ok: true,
    status: 204,
    async text() {
      throw new Error("should not read empty no-content response");
    },
  });

  assert.deepEqual(result, {});
});

test("readJsonResponse rejects empty non-204 success responses", async () => {
  await assert.rejects(
    () => readJsonResponse({
      ok: true,
      status: 200,
      async text() {
        return "";
      },
    }),
    /empty response/
  );
});

test("apiFetch turns empty error responses into useful errors", async () => {
  globalThis.fetch = async () => ({
    ok: false,
    status: 500,
    statusText: "Internal Server Error",
    async text() {
      return "";
    },
  });

  await assert.rejects(
    () => getRecommendations([{ title: "Dune" }]),
    /Internal Server Error/
);
});

test("GET requests do not send the CSRF helper header", async () => {
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      status: 200,
      async text() {
        return JSON.stringify({ success: true, books: [] });
      },
    };
  };

  await getDiscover();

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "/api/books/discover");
  assert.equal(calls[0].options.headers["X-ShelfScanner-Request"], undefined);
});

test("removeBook prefers reading-list id when available", async () => {
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      status: 200,
      async text() {
        return JSON.stringify({ success: true });
      },
    };
  };

  await removeBook({ readingListId: 42, title: "Dune" });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "/api/books/remove/id/42");
  assert.equal(calls[0].options.method, "DELETE");
});

test("removeBook rejects title-only deletes", async () => {
  await assert.rejects(() => removeBook("Dune"), /Saved book id is required/);
});
