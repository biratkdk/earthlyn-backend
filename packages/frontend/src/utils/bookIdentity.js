export function normalizeBookPart(value) {
  return String(value || "").trim().toLowerCase();
}

export function bookIdentity(book = {}) {
  const externalId = book.readingListId
    || book.reading_list_id
    || book.googleBooksId
    || book.google_books_id
    || book.book_id
    || "";

  if (externalId) return `id:${externalId}`;

  return [
    normalizeBookPart(book.title),
    normalizeBookPart(book.author || "Unknown"),
  ].join("::");
}

export function sameBook(left = {}, right = {}) {
  return bookIdentity(left) === bookIdentity(right);
}
