const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const TOKEN_TTL = process.env.AUTH_TOKEN_TTL || '7d';
const AUTH_COOKIE_NAME = 'shelfscanner_session';
const AUTH_CSRF_COOKIE_NAME = 'shelfscanner_csrf';
const DEFAULT_AUTH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const JWT_SECRET = process.env.AUTH_JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'dev-shelfscanner-secret-change-me');
const ALLOWED_SAMESITE = new Set(['lax', 'strict', 'none']);

if (!JWT_SECRET) {
  throw new Error('AUTH_JWT_SECRET is required in production.');
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function createPasswordHash(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return salt + ':' + hash;
}

function verifyPassword(password, storedHash) {
  const [salt, expectedHash] = String(storedHash || '').split(':');
  if (!salt || !expectedHash) {
    return false;
  }

  const actualHash = crypto.scryptSync(String(password), salt, 64).toString('hex');
  const expected = Buffer.from(expectedHash, 'hex');
  const actual = Buffer.from(actualHash, 'hex');
  if (expected.length !== actual.length) {
    return false;
  }
  return crypto.timingSafeEqual(expected, actual);
}

function signAuthToken(user) {
  return jwt.sign(
    {
      sub: Number(user.user_id),
      email: user.email,
      display_name: user.display_name
    },
    JWT_SECRET,
    { expiresIn: TOKEN_TTL }
  );
}

function verifyAuthToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function durationToMs(value) {
  if (typeof value === 'number') return value * 1000;
  const match = String(value || '').trim().match(/^(\d+)\s*(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w)?$/i);
  if (!match) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('AUTH_TOKEN_TTL must be a duration like 7d, 12h, or 45m.');
    }
    return DEFAULT_AUTH_COOKIE_MAX_AGE_MS;
  }
  const amount = Number(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('AUTH_TOKEN_TTL must be a positive duration.');
    }
    return DEFAULT_AUTH_COOKIE_MAX_AGE_MS;
  }
  const unit = (match[2] || 's').toLowerCase();
  const multipliers = {
    s: 1000,
    sec: 1000,
    secs: 1000,
    second: 1000,
    seconds: 1000,
    m: 60 * 1000,
    min: 60 * 1000,
    mins: 60 * 1000,
    minute: 60 * 1000,
    minutes: 60 * 1000,
    h: 60 * 60 * 1000,
    hr: 60 * 60 * 1000,
    hrs: 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    hours: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    weeks: 7 * 24 * 60 * 60 * 1000
  };
  return amount * (multipliers[unit] || multipliers.s);
}

function authCookieSameSite() {
  const value = String(process.env.AUTH_COOKIE_SAMESITE || 'lax').toLowerCase();
  if (ALLOWED_SAMESITE.has(value)) return value;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_COOKIE_SAMESITE must be lax, strict, or none.');
  }
  return 'lax';
}

function authCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  const sameSite = authCookieSameSite();
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite,
    path: '/',
    maxAge: durationToMs(TOKEN_TTL)
  };
}

function csrfCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: false,
    secure: isProduction,
    sameSite: authCookieSameSite(),
    path: '/',
    maxAge: durationToMs(TOKEN_TTL)
  };
}

function createCsrfToken() {
  return crypto.randomBytes(24).toString('base64url');
}

function setAuthCookie(res, token) {
  res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions());
  setCsrfCookie(res);
}

function setCsrfCookie(res) {
  res.cookie(AUTH_CSRF_COOKIE_NAME, createCsrfToken(), csrfCookieOptions());
}

function clearAuthCookie(res) {
  res.clearCookie(AUTH_COOKIE_NAME, {
    ...authCookieOptions(),
    maxAge: undefined
  });
  res.clearCookie(AUTH_CSRF_COOKIE_NAME, {
    ...csrfCookieOptions(),
    maxAge: undefined
  });
}

function parseCookies(cookieHeader) {
  return String(cookieHeader || '')
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, part) => {
      const separator = part.indexOf('=');
      if (separator === -1) return cookies;
      try {
        const key = decodeURIComponent(part.slice(0, separator).trim());
        const value = decodeURIComponent(part.slice(separator + 1).trim());
        return { ...cookies, [key]: value };
      } catch {
        return cookies;
      }
    }, {});
}

module.exports = {
  AUTH_COOKIE_NAME,
  AUTH_CSRF_COOKIE_NAME,
  normalizeEmail,
  createPasswordHash,
  verifyPassword,
  signAuthToken,
  verifyAuthToken,
  setAuthCookie,
  setCsrfCookie,
  clearAuthCookie,
  parseCookies
};
