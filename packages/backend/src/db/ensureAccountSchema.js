const fs = require('fs');
const path = require('path');
const { hasDatabaseConnection, query } = require('./client');

async function ensureAccountSchema() {
  if (!hasDatabaseConnection) {
    return;
  }

  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8').replace(/^\uFEFF/, '');
  await query(schemaSql);
}

module.exports = {
  ensureAccountSchema
};
