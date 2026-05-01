const { Pool, types } = require('pg');
require('dotenv').config({ quiet: true });

types.setTypeParser(20, (value) => Number(value));

function isMeaningfulEnvValue(value) {
  const normalized = String(value || '').trim();
  if (!normalized) {
    return false;
  }

  return ![
    'your_key_here',
    'your_openai_api_key_here',
    'your_google_vision_api_key_here',
    'your-project-id',
    'postgres://user:password@localhost:5432/shelfscanner'
  ].includes(normalized);
}

const databaseUrl = isMeaningfulEnvValue(process.env.DATABASE_URL)
  ? String(process.env.DATABASE_URL).trim()
  : '';
const pgHost = isMeaningfulEnvValue(process.env.PGHOST) ? String(process.env.PGHOST).trim() : '';
const pgUser = isMeaningfulEnvValue(process.env.PGUSER) ? String(process.env.PGUSER).trim() : '';
const pgDatabase = isMeaningfulEnvValue(process.env.PGDATABASE) ? String(process.env.PGDATABASE).trim() : '';

const hasDatabaseConnection = Boolean(databaseUrl || pgHost || pgUser || pgDatabase);
const rejectUnauthorized = process.env.PGSSL_REJECT_UNAUTHORIZED !== 'false';

if (!hasDatabaseConnection && process.env.NODE_ENV === 'production') {
  throw new Error('PostgreSQL is required in production. Set DATABASE_URL or PG* environment variables.');
}

const pool = hasDatabaseConnection
  ? new Pool(
      databaseUrl
        ? {
            connectionString: databaseUrl,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized } : false
          }
        : {
            host: pgHost || 'localhost',
            port: Number(process.env.PGPORT || 5432),
            user: pgUser || 'postgres',
            password: process.env.PGPASSWORD || undefined,
            database: pgDatabase || 'shelfscanner'
          }
    )
  : null;

async function query(text, params) {
  if (!pool) {
    throw new Error('PostgreSQL is not configured. Set DATABASE_URL or PG* environment variables.');
  }

  return pool.query(text, params);
}

async function closePool() {
  if (pool) {
    await pool.end();
  }
}

module.exports = {
  pool,
  query,
  closePool,
  hasDatabaseConnection
};
