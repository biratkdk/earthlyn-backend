const { app } = require('../packages/backend/src/server');
const { ensureAccountSchema } = require('../packages/backend/src/db/ensureAccountSchema');

let schemaReady;

module.exports = async function handler(req, res) {
  schemaReady ||= ensureAccountSchema();
  await schemaReady;
  return app(req, res);
};
