const { hasDatabaseConnection, query } = require('./client');
const { normalizeEmail } = require('../utils/auth');

const fallbackUsers = [];
let nextUserId = 1;

function serializeUser(record) {
  if (!record) {
    return null;
  }

  return {
    user_id: Number(record.user_id),
    email: normalizeEmail(record.email),
    display_name: String(record.display_name || '').trim(),
    created_at: record.created_at || new Date().toISOString(),
    updated_at: record.updated_at || new Date().toISOString()
  };
}

async function getUserWithPasswordByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    return null;
  }

  if (hasDatabaseConnection) {
    const result = await query(
      'SELECT user_id, email, display_name, password_hash, created_at, updated_at FROM users WHERE email = $1 LIMIT 1',
      [normalizedEmail]
    );
    return result.rows[0] || null;
  }

  return fallbackUsers.find((item) => item.email === normalizedEmail) || null;
}

async function getUserById(userId) {
  if (!userId) {
    return null;
  }

  if (hasDatabaseConnection) {
    const result = await query(
      'SELECT user_id, email, display_name, created_at, updated_at FROM users WHERE user_id = $1 LIMIT 1',
      [userId]
    );
    return serializeUser(result.rows[0] || null);
  }

  return serializeUser(fallbackUsers.find((item) => Number(item.user_id) === Number(userId)) || null);
}

async function createUser({ email, displayName, passwordHash }) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedDisplayName = String(displayName || '').trim();

  if (hasDatabaseConnection) {
    const result = await query(
      'INSERT INTO users (email, password_hash, display_name) VALUES ($1, $2, $3) RETURNING user_id, email, display_name, created_at, updated_at',
      [normalizedEmail, passwordHash, normalizedDisplayName]
    );
    return serializeUser(result.rows[0]);
  }

  const now = new Date().toISOString();
  const record = {
    user_id: nextUserId++,
    email: normalizedEmail,
    display_name: normalizedDisplayName,
    password_hash: passwordHash,
    created_at: now,
    updated_at: now
  };
  fallbackUsers.push(record);
  return serializeUser(record);
}

module.exports = {
  serializeUser,
  getUserWithPasswordByEmail,
  getUserById,
  createUser
};
