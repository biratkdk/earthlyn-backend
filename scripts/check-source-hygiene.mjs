import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const scopeArgIndex = process.argv.indexOf("--scope");
const scope = scopeArgIndex >= 0 ? process.argv[scopeArgIndex + 1] : "all";
const targets = {
  frontend: [path.join(root, "packages/frontend/src")],
  backend: [path.join(root, "packages/backend/src")],
  all: [path.join(root, "packages/frontend/src"), path.join(root, "packages/backend/src")],
}[scope] || [];

const allowedConsoleFiles = new Set([
  path.normalize(path.join(root, "packages/backend/src/utils/logger.js")),
]);

const forbiddenPatterns = [
  { pattern: /GEMINI_API_KEY=AIza/g, message: "committed Gemini API key" },
  { pattern: /audible\.in|amazon\.in|INR\s+\$\{/g, message: "India-specific storefront or currency leakage" },
  { pattern: /\.bak\b/g, message: "backup file reference in source" },
  { pattern: /\blocalStorage\b/g, message: "persistent localStorage token usage" },
  { pattern: /window\.open\([^)]*"_blank"\s*\)/g, message: "window.open without noopener" },
];

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(entryPath);
    return /\.(js|jsx|ts|tsx|css|json)$/.test(entry.name) ? [entryPath] : [];
  }));
  return files.flat();
}

const violations = [];
for (const target of targets) {
  for (const file of await listFiles(target)) {
    const normalized = path.normalize(file);
    const text = await readFile(file, "utf8");
    if (!allowedConsoleFiles.has(normalized) && /console\./.test(text)) {
      violations.push(`${path.relative(root, file)}: raw console call`);
    }
    for (const check of forbiddenPatterns) {
      if (check.pattern.test(text)) {
        violations.push(`${path.relative(root, file)}: ${check.message}`);
      }
      check.pattern.lastIndex = 0;
    }
  }
}

if (violations.length) {
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log(`Source hygiene passed for ${scope}.`);
