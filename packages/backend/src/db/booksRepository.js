const { seedBooks } = require("../data/seedBooks");
const { hasDatabaseConnection, query } = require("./client");

const fallbackBooks = seedBooks.map((item) => ({ ...item, tags: [...new Set(item.tags || [])] }));
let nextBookId = fallbackBooks.reduce((max, item) => Math.max(max, item.book_id), 0) + 1;

function normalizeText(value) {
  return (value || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function tokenize(value) {
  return normalizeText(value).split(" ").filter(Boolean);
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }
  return [...new Set(tags.map((item) => String(item).trim()).filter(Boolean))];
}

function serializeBook(book) {
  if (!book) {
    return null;
  }
  return {
    book_id: Number(book.book_id),
    title: book.title,
    author: book.author,
    isbn: book.isbn || null,
    genre: book.genre,
    shelf_location: book.shelf_location,
    tags: normalizeTags(book.tags || [])
  };
}

function scoreBookAgainstQuery(book, queryText) {
  const tokens = tokenize(queryText);
  if (!tokens.length) {
    return 0;
  }
  const haystack = [book.title, book.author, book.genre, book.shelf_location, ...(book.tags || [])].join(" ").toLowerCase();
  return tokens.reduce((score, token) => (haystack.includes(token) ? score + 1 : score), 0);
}

function bigrams(value) {
  const text = normalizeText(value).replace(/\s+/g, "");
  if (!text) {
    return [];
  }
  if (text.length === 1) {
    return [text];
  }
  const output = [];
  for (let index = 0; index < text.length - 1; index += 1) {
    output.push(text.slice(index, index + 2));
  }
  return output;
}

function dice(left, right) {
  const leftBigrams = bigrams(left);
  const rightBigrams = bigrams(right);
  if (!leftBigrams.length || !rightBigrams.length) {
    return 0;
  }
  const counts = new Map();
  for (const item of rightBigrams) {
    counts.set(item, (counts.get(item) || 0) + 1);
  }
  let overlap = 0;
  for (const item of leftBigrams) {
    const count = counts.get(item) || 0;
    if (count > 0) {
      overlap += 1;
      counts.set(item, count - 1);
    }
  }
  return (2 * overlap) / (leftBigrams.length + rightBigrams.length);
}

function cleanOcrText(value) {
  return tokenize(value).filter((token) => token.length >= 3 || /^\d{4,}$/.test(token)).join(" ");
}

function getSignalTokens(value) {
  return tokenize(value).filter((token) => token.length >= 4 || /^\d{4,}$/.test(token));
}

function hasStrongOcrOverlap(book, input) {
  const signalTokens = getSignalTokens([input.title || "", input.author || "", cleanOcrText(input.ocrText || "")].join(" "));
  if (!signalTokens.length) {
    return false;
  }

  const bookTokens = new Set([
    ...getSignalTokens(book.title),
    ...getSignalTokens(book.author),
    ...(book.isbn ? [String(book.isbn)] : [])
  ]);

  return signalTokens.some((token) => bookTokens.has(token));
}

function computeMatchScore(book, input) {
  const cleanedOcr = cleanOcrText(input.ocrText || "");
  const combined = [input.title || "", input.author || "", cleanedOcr].filter(Boolean).join(" ");
  const queryTokens = new Set(tokenize(combined));
  const titleTokenScore = tokenize(book.title).reduce((score, token) => score + (queryTokens.has(token) ? 3 : 0), 0);
  const authorTokenScore = tokenize(book.author).reduce((score, token) => score + (queryTokens.has(token) ? 4 : 0), 0);
  const looseScore = scoreBookAgainstQuery(book, combined);
  const titleSimilarity = dice(input.title || cleanedOcr, book.title) * 12;
  const authorSimilarity = dice(input.author || "", book.author) * 10;
  const combinedSimilarity = dice(combined, `${book.title} ${book.author}`) * 8;
  const normalizedInputTitle = normalizeText(input.title || cleanedOcr);
  const normalizedBookTitle = normalizeText(book.title);
  const containsBoost = normalizedInputTitle && (normalizedBookTitle.includes(normalizedInputTitle) || normalizedInputTitle.includes(normalizedBookTitle)) ? 6 : 0;
  return titleTokenScore + authorTokenScore + looseScore + titleSimilarity + authorSimilarity + combinedSimilarity + containsBoost;
}

async function listCatalogBooks() {
  if (hasDatabaseConnection) {
    const result = await query("SELECT book_id, title, author, isbn, genre, shelf_location, tags FROM books ORDER BY title ASC LIMIT 250");
    return result.rows.map(serializeBook);
  }
  return fallbackBooks.map(serializeBook);
}

async function searchBooks({ query: queryText = "", title = "", author = "", genre = "", tag = "" } = {}) {
  const normalizedTitle = normalizeText(title);
  const normalizedAuthor = normalizeText(author);
  const normalizedGenre = normalizeText(genre);
  const normalizedTags = String(tag || "")
    .split(",")
    .map((item) => normalizeText(item))
    .filter(Boolean);

  if (hasDatabaseConnection) {
    const values = [];
    const where = [];

    const addTokenizedClauses = (field, rawValue) => {
      const tokens = tokenize(rawValue);
      if (!tokens.length) {
        return;
      }

      const clauses = tokens.map((token) => {
        values.push(`%${token}%`);
        return `${field} ILIKE $${values.length}`;
      });
      where.push(`(${clauses.join(" AND ")})`);
    };

    const queryTokens = tokenize(queryText);
    if (queryTokens.length) {
      const clauses = queryTokens.map((token) => {
        values.push(`%${token}%`);
        const placeholder = `$${values.length}`;
        return `(title ILIKE ${placeholder} OR author ILIKE ${placeholder} OR genre ILIKE ${placeholder} OR shelf_location ILIKE ${placeholder} OR EXISTS (SELECT 1 FROM unnest(tags) AS tag_item WHERE tag_item ILIKE ${placeholder}))`;
      });
      where.push(`(${clauses.join(" AND ")})`);
    }

    addTokenizedClauses("title", title);
    addTokenizedClauses("author", author);

    if (normalizedGenre) {
      values.push(`%${normalizedGenre}%`);
      where.push(`genre ILIKE $${values.length}`);
    }

    normalizedTags.forEach((tagToken) => {
      values.push(`%${tagToken}%`);
      where.push(`EXISTS (SELECT 1 FROM unnest(tags) AS tag_item WHERE tag_item ILIKE $${values.length})`);
    });

    const sql = `SELECT book_id, title, author, isbn, genre, shelf_location, tags FROM books ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY title ASC LIMIT 25`;
    const result = await query(sql, values);
    return result.rows.map(serializeBook);
  }

  let books = fallbackBooks.map(serializeBook);

  if (normalizedTitle) {
    books = books.filter((book) => normalizeText(book.title).includes(normalizedTitle));
  }

  if (normalizedAuthor) {
    books = books.filter((book) => normalizeText(book.author).includes(normalizedAuthor));
  }

  if (normalizedGenre) {
    books = books.filter((book) => normalizeText(book.genre).includes(normalizedGenre));
  }

  if (normalizedTags.length) {
    books = books.filter((book) => normalizedTags.every((tagToken) => (
      (book.tags || []).some((item) => normalizeText(item).includes(tagToken))
    )));
  }

  if (queryText) {
    books = books
      .map((book) => ({ book, score: scoreBookAgainstQuery(book, queryText) }))
      .filter((entry) => entry.score > 0)
      .sort((left, right) => right.score - left.score)
      .map((entry) => entry.book);
  }

  return books.slice(0, 25);
}

async function getBookById(bookId) {
  if (hasDatabaseConnection) {
    const result = await query("SELECT book_id, title, author, isbn, genre, shelf_location, tags FROM books WHERE book_id = $1 LIMIT 1", [bookId]);
    return serializeBook(result.rows[0] || null);
  }
  return serializeBook(fallbackBooks.find((book) => String(book.book_id) === String(bookId)) || null);
}

async function getTrendingBooks() {
  if (hasDatabaseConnection) {
    const result = await query("SELECT book_id, title, author, isbn, genre, shelf_location, tags FROM books ORDER BY book_id ASC LIMIT 6");
    return result.rows.map(serializeBook);
  }
  return fallbackBooks.slice(0, 6).map(serializeBook);
}

async function createBook(payload) {
  const tags = normalizeTags(payload.tags);
  if (hasDatabaseConnection) {
    const result = await query("INSERT INTO books (title, author, isbn, genre, shelf_location, tags) VALUES ($1, $2, $3, $4, $5, $6) RETURNING book_id, title, author, isbn, genre, shelf_location, tags", [payload.title, payload.author, payload.isbn || null, payload.genre, payload.shelfLocation, tags]);
    return serializeBook(result.rows[0]);
  }
  const record = { book_id: nextBookId++, title: payload.title, author: payload.author, isbn: payload.isbn || null, genre: payload.genre, shelf_location: payload.shelfLocation, tags };
  fallbackBooks.push(record);
  return serializeBook(record);
}

async function updateBook(bookId, payload) {
  const current = await getBookById(bookId);
  if (!current) { return null; }
  const merged = {
    title: payload.title ?? current.title,
    author: payload.author ?? current.author,
    isbn: payload.isbn ?? current.isbn,
    genre: payload.genre ?? current.genre,
    shelfLocation: payload.shelfLocation ?? current.shelf_location,
    tags: payload.tags ?? current.tags
  };
  const tags = normalizeTags(merged.tags);
  if (hasDatabaseConnection) {
    const result = await query("UPDATE books SET title = $2, author = $3, isbn = $4, genre = $5, shelf_location = $6, tags = $7 WHERE book_id = $1 RETURNING book_id, title, author, isbn, genre, shelf_location, tags", [bookId, merged.title, merged.author, merged.isbn, merged.genre, merged.shelfLocation, tags]);
    return serializeBook(result.rows[0] || null);
  }
  const index = fallbackBooks.findIndex((book) => String(book.book_id) === String(bookId));
  if (index === -1) { return null; }
  fallbackBooks[index] = { ...fallbackBooks[index], title: merged.title, author: merged.author, isbn: merged.isbn, genre: merged.genre, shelf_location: merged.shelfLocation, tags };
  return serializeBook(fallbackBooks[index]);
}

async function deleteBook(bookId) {
  if (hasDatabaseConnection) {
    const result = await query("DELETE FROM books WHERE book_id = $1 RETURNING book_id, title", [bookId]);
    return result.rows[0] || null;
  }
  const index = fallbackBooks.findIndex((book) => String(book.book_id) === String(bookId));
  if (index === -1) { return null; }
  const [removed] = fallbackBooks.splice(index, 1);
  return removed;
}

async function findBookMatches({ title = "", author = "", isbn = "", ocrText = "" } = {}) {
  if (isbn) {
    if (hasDatabaseConnection) {
      const result = await query("SELECT book_id, title, author, isbn, genre, shelf_location, tags FROM books WHERE isbn = $1 LIMIT 1", [isbn]);
      if (result.rows[0]) { return [serializeBook(result.rows[0])]; }
    } else {
      const match = fallbackBooks.find((book) => book.isbn === isbn);
      if (match) { return [serializeBook(match)]; }
    }
  }

  const hasStructuredInput = Boolean(normalizeText(title) || normalizeText(author));
  const searchable = await listCatalogBooks();

  return searchable
    .map((book) => ({ ...book, match_score: computeMatchScore(book, { title, author, ocrText }) }))
    .filter((book) => {
      if (book.match_score <= 1.25) {
        return false;
      }

      if (!hasStructuredInput && !hasStrongOcrOverlap(book, { title, author, ocrText })) {
        return false;
      }

      return true;
    })
    .sort((left, right) => right.match_score - left.match_score)
    .slice(0, 5);
}

module.exports = {
  listCatalogBooks,
  searchBooks,
  getBookById,
  getTrendingBooks,
  createBook,
  updateBook,
  deleteBook,
  findBookMatches,
  normalizeText,
  normalizeTags,
  serializeBook
};