import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const requireBackend = createRequire(path.join(root, "packages/backend/package.json"));
const { Client } = requireBackend("pg");

const config = {
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "postgres",
};
const database = process.env.PGDATABASE || "shelfscanner";

async function withClient(databaseName, fn) {
  const client = new Client({ ...config, database: databaseName });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end();
  }
}

await withClient("postgres", async (client) => {
  const exists = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [database]);
  if (!exists.rowCount) {
    await client.query(`CREATE DATABASE ${database.replace(/[^a-zA-Z0-9_]/g, "")}`);
  }
});

const schemaSql = (await readFile(path.join(root, "packages/backend/src/db/schema.sql"), "utf8")).replace(/^\uFEFF/, "");
await withClient(database, async (client) => {
  await client.query(schemaSql);
  const { rows } = await client.query("SELECT COUNT(*)::int AS count FROM books");
  console.log(`Local Postgres ready: ${database}, ${rows[0].count} catalog books.`);
});
