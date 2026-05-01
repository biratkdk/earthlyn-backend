const { hasDatabaseConnection, query } = require("./client");

const fallbackReadingList = [];
let nextReadingListId = 1;

function toJsonObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function serializeReadingListItem(record) {
  if (!record) {
    return null;
  }

  return {
    reading_list_id: Number(record.reading_list_id),
    user_id: Number(record.user_id),
    book_id: record.book_id == null ? null : Number(record.book_id),
    external_book_key: String(record.external_book_key || "").trim(),
    title: record.title,
    author: String(record.author || "").trim(),
    genre: record.genre || null,
    summary: record.summary || null,
    cover_image: record.cover_image || null,
    source: String(record.source || "catalog").trim(),
    amazon_url: record.amazon_url || null,
    google_url: record.google_url || null,
    open_library_url: record.open_library_url || null,
    metadata: toJsonObject(record.metadata),
    created_at: record.created_at || new Date().toISOString()
  };
}

async function listReadingList({ userId, limit = 100 }) {
  const normalizedLimit = Math.max(1, Math.min(Number(limit) || 100, 200));

  if (hasDatabaseConnection) {
    const result = await query(
      `SELECT rl.reading_list_id, rl.user_id, rl.book_id, rl.external_book_key, rl.title, rl.author, b.genre, b.summary, rl.cover_image, rl.source, rl.amazon_url, rl.google_url, rl.open_library_url, rl.metadata, rl.created_at
       FROM reading_list rl
       LEFT JOIN books b ON b.book_id = rl.book_id
       WHERE rl.user_id = $1
       ORDER BY rl.created_at DESC
       LIMIT $2`,
      [userId, normalizedLimit]
    );
    return result.rows.map(serializeReadingListItem);
  }

  return fallbackReadingList
    .filter((item) => Number(item.user_id) === Number(userId))
    .slice()
    .sort((left, right) => new Date(right.created_at) - new Date(left.created_at))
    .slice(0, normalizedLimit)
    .map(serializeReadingListItem);
}

async function addReadingListItem(input) {
  const normalizedTitle = String(input.title || "").trim();
  const normalizedAuthor = String(input.author || "").trim();

  if (hasDatabaseConnection) {
    const result = await query(
      `INSERT INTO reading_list (user_id, book_id, external_book_key, title, author, cover_image, source, amazon_url, google_url, open_library_url, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (user_id, title, author) DO UPDATE SET
         book_id = EXCLUDED.book_id,
         external_book_key = EXCLUDED.external_book_key,
         cover_image = EXCLUDED.cover_image,
         source = EXCLUDED.source,
         amazon_url = EXCLUDED.amazon_url,
         google_url = EXCLUDED.google_url,
         open_library_url = EXCLUDED.open_library_url,
         metadata = EXCLUDED.metadata
       RETURNING reading_list_id, user_id, book_id, external_book_key, title, author, cover_image, source, amazon_url, google_url, open_library_url, metadata, created_at`,
      [input.userId, input.bookId || null, String(input.externalBookKey || "").trim(), normalizedTitle, normalizedAuthor, input.coverImage || null, input.source || "catalog", input.amazonUrl || null, input.googleUrl || null, input.openLibraryUrl || null, toJsonObject(input.metadata)]
    );
    return serializeReadingListItem({ ...result.rows[0], genre: input.genre || null, summary: input.summary || null });
  }

  const existingIndex = fallbackReadingList.findIndex((item) => Number(item.user_id) === Number(input.userId) && item.title.toLowerCase() === normalizedTitle.toLowerCase() && item.author.toLowerCase() === normalizedAuthor.toLowerCase());
  const record = {
    reading_list_id: existingIndex >= 0 ? fallbackReadingList[existingIndex].reading_list_id : nextReadingListId++,
    user_id: input.userId,
    book_id: input.bookId || null,
    external_book_key: String(input.externalBookKey || "").trim(),
    title: normalizedTitle,
    author: normalizedAuthor,
    genre: input.genre || null,
    summary: input.summary || null,
    cover_image: input.coverImage || null,
    source: input.source || "catalog",
    amazon_url: input.amazonUrl || null,
    google_url: input.googleUrl || null,
    open_library_url: input.openLibraryUrl || null,
    metadata: toJsonObject(input.metadata),
    created_at: existingIndex >= 0 ? fallbackReadingList[existingIndex].created_at : new Date().toISOString()
  };

  if (existingIndex >= 0) {
    fallbackReadingList[existingIndex] = record;
  } else {
    fallbackReadingList.unshift(record);
  }

  return serializeReadingListItem(record);
}

async function removeReadingListItem({ userId, readingListId }) {
  if (hasDatabaseConnection) {
    const result = await query(
      "DELETE FROM reading_list WHERE user_id = $1 AND reading_list_id = $2 RETURNING reading_list_id, user_id, book_id, external_book_key, title, author, cover_image, source, amazon_url, google_url, open_library_url, metadata, created_at",
      [userId, readingListId]
    );
    return serializeReadingListItem(result.rows[0] || null);
  }

  const index = fallbackReadingList.findIndex((item) => Number(item.user_id) === Number(userId) && Number(item.reading_list_id) === Number(readingListId));
  if (index === -1) {
    return null;
  }

  const [removed] = fallbackReadingList.splice(index, 1);
  return serializeReadingListItem(removed);
}

module.exports = {
  listReadingList,
  addReadingListItem,
  removeReadingListItem
};
