const { hasDatabaseConnection, query } = require('../db/client');
const logger = require('../utils/logger');

class PostgresRateLimitStore {
  constructor({ prefix, windowMs }) {
    this.prefix = prefix;
    this.windowMs = windowMs;
    this.ready = this.ensureTable();
  }

  async ensureTable() {
    await query(`
      CREATE TABLE IF NOT EXISTS rate_limit_buckets (
        key TEXT PRIMARY KEY,
        hits INTEGER NOT NULL DEFAULT 0,
        reset_at TIMESTAMPTZ NOT NULL
      )
    `);
    await query('CREATE INDEX IF NOT EXISTS idx_rate_limit_buckets_reset_at ON rate_limit_buckets(reset_at)');
  }

  normalizeKey(key) {
    return `${this.prefix}:${key}`;
  }

  async increment(key) {
    await this.ready;
    const bucketKey = this.normalizeKey(key);
    const resetAt = new Date(Date.now() + this.windowMs);
    await query('DELETE FROM rate_limit_buckets WHERE reset_at <= NOW() AND key LIKE $1', [`${this.prefix}:%`]);
    const result = await query(
      `
        INSERT INTO rate_limit_buckets (key, hits, reset_at)
        VALUES ($1, 1, $2)
        ON CONFLICT (key) DO UPDATE SET
          hits = CASE
            WHEN rate_limit_buckets.reset_at <= NOW() THEN 1
            ELSE rate_limit_buckets.hits + 1
          END,
          reset_at = CASE
            WHEN rate_limit_buckets.reset_at <= NOW() THEN $2
            ELSE rate_limit_buckets.reset_at
          END
        RETURNING hits, reset_at
      `,
      [bucketKey, resetAt]
    );
    const row = result.rows[0];
    return {
      totalHits: Number(row.hits),
      resetTime: new Date(row.reset_at)
    };
  }

  async decrement(key) {
    await this.ready;
    await query(
      'UPDATE rate_limit_buckets SET hits = GREATEST(hits - 1, 0) WHERE key = $1',
      [this.normalizeKey(key)]
    );
  }

  async resetKey(key) {
    await this.ready;
    await query('DELETE FROM rate_limit_buckets WHERE key = $1', [this.normalizeKey(key)]);
  }

  async resetAll() {
    await this.ready;
    await query('DELETE FROM rate_limit_buckets WHERE key LIKE $1', [`${this.prefix}:%`]);
  }
}

function createRateLimitStore(prefix, windowMs) {
  if (!hasDatabaseConnection) {
    if (process.env.NODE_ENV === 'production') {
      logger.warn('Postgres rate limit store unavailable; falling back to memory store');
    }
    return undefined;
  }
  return new PostgresRateLimitStore({ prefix, windowMs });
}

module.exports = { createRateLimitStore };
