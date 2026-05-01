const LEVELS = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};

const configuredLevel = String(process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "warn" : "info")).toLowerCase();
const activeLevel = LEVELS[configuredLevel] ?? LEVELS.info;

function shouldLog(level) {
  return (LEVELS[level] ?? LEVELS.info) <= activeLevel;
}

function log(level, ...args) {
  if (!shouldLog(level)) return;
  const method = level === "debug" ? "log" : level;
  console[method](`[${level.toUpperCase()}]`, ...args);
}

module.exports = {
  debug: (...args) => log("debug", ...args),
  info: (...args) => log("info", ...args),
  warn: (...args) => log("warn", ...args),
  error: (...args) => log("error", ...args),
};
