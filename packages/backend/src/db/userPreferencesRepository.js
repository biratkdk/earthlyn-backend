const { hasDatabaseConnection, query } = require("./client");

const fallbackPreferences = new Map();

function normalizeGenres(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return [...new Set(value.map((item) => String(item || "").trim()).filter(Boolean))];
}

function serializePreferences(userId, record = {}) {
  return {
    user_id: Number(userId),
    genres: normalizeGenres(record.genres || []),
    pace: String(record.pace || "").trim(),
    length_preference: String(record.length_preference || "").trim(),
    favorite_authors: String(record.favorite_authors || "").trim(),
    loved_books: String(record.loved_books || "").trim(),
    min_rating: Number(record.min_rating || 0),
    updated_at: record.updated_at || new Date().toISOString()
  };
}

async function getUserPreferences(userId) {
  if (hasDatabaseConnection) {
    const result = await query(
      "SELECT user_id, genres, pace, length_preference, favorite_authors, loved_books, min_rating, updated_at FROM user_preferences WHERE user_id = $1 LIMIT 1",
      [userId]
    );
    return serializePreferences(userId, result.rows[0] || {});
  }

  return serializePreferences(userId, fallbackPreferences.get(Number(userId)) || {});
}

async function upsertUserPreferences({ userId, genres = [], pace = "", lengthPreference = "", favoriteAuthors = "", lovedBooks = "", minRating = 0 }) {
  const record = {
    genres: normalizeGenres(genres),
    pace: String(pace || "").trim(),
    length_preference: String(lengthPreference || "").trim(),
    favorite_authors: String(favoriteAuthors || "").trim(),
    loved_books: String(lovedBooks || "").trim(),
    min_rating: Math.max(0, Math.min(5, Number(minRating) || 0)),
    updated_at: new Date().toISOString()
  };

  if (hasDatabaseConnection) {
    const result = await query(
      `INSERT INTO user_preferences (user_id, genres, pace, length_preference, favorite_authors, loved_books, min_rating)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id) DO UPDATE SET
         genres = EXCLUDED.genres,
         pace = EXCLUDED.pace,
         length_preference = EXCLUDED.length_preference,
         favorite_authors = EXCLUDED.favorite_authors,
         loved_books = EXCLUDED.loved_books,
         min_rating = EXCLUDED.min_rating,
         updated_at = NOW()
       RETURNING user_id, genres, pace, length_preference, favorite_authors, loved_books, min_rating, updated_at`,
      [userId, record.genres, record.pace, record.length_preference, record.favorite_authors, record.loved_books, record.min_rating]
    );
    return serializePreferences(userId, result.rows[0]);
  }

  fallbackPreferences.set(Number(userId), record);
  return serializePreferences(userId, record);
}

module.exports = {
  getUserPreferences,
  upsertUserPreferences
};
