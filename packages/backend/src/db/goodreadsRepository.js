const { hasDatabaseConnection, query } = require("./client");

const fallbackImports = [];
let nextImportId = 1;

function serializeGoodreadsImport(record) {
  if (!record) {
    return null;
  }

  return {
    goodreads_import_id: Number(record.goodreads_import_id),
    user_id: Number(record.user_id),
    title: String(record.title || "").trim(),
    author: String(record.author || "").trim(),
    rating: record.rating == null ? null : Number(record.rating),
    exclusive_shelf: String(record.exclusive_shelf || "").trim(),
    date_read: String(record.date_read || "").trim(),
    raw_payload: record.raw_payload && typeof record.raw_payload === "object" ? record.raw_payload : {},
    created_at: record.created_at || new Date().toISOString()
  };
}

async function listGoodreadsImports({ userId, limit = 100 }) {
  const normalizedLimit = Math.max(1, Math.min(Number(limit) || 100, 500));

  if (hasDatabaseConnection) {
    const result = await query(
      "SELECT goodreads_import_id, user_id, title, author, rating, exclusive_shelf, date_read, raw_payload, created_at FROM goodreads_imports WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2",
      [userId, normalizedLimit]
    );
    return result.rows.map(serializeGoodreadsImport);
  }

  return fallbackImports
    .filter((item) => Number(item.user_id) === Number(userId))
    .slice()
    .sort((left, right) => new Date(right.created_at) - new Date(left.created_at))
    .slice(0, normalizedLimit)
    .map(serializeGoodreadsImport);
}

async function importGoodreadsEntries({ userId, entries }) {
  const normalizedEntries = (Array.isArray(entries) ? entries : [])
    .map((entry) => ({
      title: String(entry.title || "").trim(),
      author: String(entry.author || "").trim(),
      rating: entry.rating == null || entry.rating === "" ? null : Math.max(0, Math.min(5, Number(entry.rating) || 0)),
      exclusive_shelf: String(entry.exclusiveShelf || entry.exclusive_shelf || "").trim(),
      date_read: String(entry.dateRead || entry.date_read || "").trim(),
      raw_payload: entry.raw_payload && typeof entry.raw_payload === "object" ? entry.raw_payload : entry
    }))
    .filter((entry) => entry.title);

  if (!normalizedEntries.length) {
    return [];
  }

  if (hasDatabaseConnection) {
    const created = [];
    for (const entry of normalizedEntries) {
      const result = await query(
        `INSERT INTO goodreads_imports (user_id, title, author, rating, exclusive_shelf, date_read, raw_payload)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING goodreads_import_id, user_id, title, author, rating, exclusive_shelf, date_read, raw_payload, created_at`,
        [userId, entry.title, entry.author, entry.rating, entry.exclusive_shelf, entry.date_read, entry.raw_payload]
      );
      created.push(serializeGoodreadsImport(result.rows[0]));
    }
    return created;
  }

  return normalizedEntries.map((entry) => {
    const record = {
      goodreads_import_id: nextImportId++,
      user_id: userId,
      ...entry,
      created_at: new Date().toISOString()
    };
    fallbackImports.unshift(record);
    return serializeGoodreadsImport(record);
  });
}

module.exports = {
  listGoodreadsImports,
  importGoodreadsEntries
};
