const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
require('dotenv').config({ quiet: true });
const logger = require('../utils/logger');

function resolvePsqlPath() {
  const configured = process.env.PSQL_PATH;
  if (configured && fs.existsSync(configured)) {
    return configured;
  }

  const candidates = [
    'C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe',
    'C:\\Program Files\\PostgreSQL\\17\\bin\\psql.exe',
    'C:\\Program Files\\PostgreSQL\\16\\bin\\psql.exe',
    'psql'
  ];

  return candidates.find((candidate) => candidate === 'psql' || fs.existsSync(candidate));
}

async function initializeDatabase() {
  const psqlPath = resolvePsqlPath();
  if (!psqlPath) {
    throw new Error('psql was not found. Install PostgreSQL or set PSQL_PATH.');
  }

  const host = process.env.PGHOST || 'localhost';
  const port = process.env.PGPORT || '5432';
  const user = process.env.PGUSER || 'postgres';
  const database = process.env.PGDATABASE || 'shelfscanner';
  const password = process.env.PGPASSWORD;
  const schemaPath = path.join(__dirname, 'schema.sql');

  if (!password) {
    throw new Error('PGPASSWORD is required to run db:init with psql.');
  }

  await new Promise((resolve, reject) => {
    const child = spawn(
      psqlPath,
      ['-v', 'ON_ERROR_STOP=1', '-h', host, '-p', String(port), '-U', user, '-d', database, '-f', schemaPath],
      {
        stdio: 'inherit',
        env: {
          ...process.env,
          PGPASSWORD: password
        }
      }
    );

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`psql exited with code ${code}`));
    });
  });

  return { success: true };
}

if (require.main === module) {
  initializeDatabase()
    .then(() => {
      logger.info('Database schema applied successfully.');
    })
    .catch((error) => {
      logger.error(error.message);
      process.exitCode = 1;
    });
}

module.exports = { initializeDatabase };
