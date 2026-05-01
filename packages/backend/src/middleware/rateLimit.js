const rateLimit = require('express-rate-limit');
const { createRateLimitStore } = require('./postgresRateLimitStore');

const SCAN_WINDOW_MS = 60 * 60 * 1000;
const AUTH_WINDOW_MS = 15 * 60 * 1000;
const RECOMMEND_WINDOW_MS = 60 * 60 * 1000;
const GENERAL_WINDOW_MS = 15 * 60 * 1000;

const scanLimiter = rateLimit({
  windowMs: SCAN_WINDOW_MS,
  max: 10,
  store: createRateLimitStore('scan', SCAN_WINDOW_MS),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many scans. Please wait before scanning again.',
    retryAfter: '1 hour'
  }
});

const authLimiter = rateLimit({
  windowMs: AUTH_WINDOW_MS,
  max: 20,
  store: createRateLimitStore('auth', AUTH_WINDOW_MS),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please wait before trying again.'
  }
});

const recommendLimiter = rateLimit({
  windowMs: RECOMMEND_WINDOW_MS,
  max: 20,
  store: createRateLimitStore('recommend', RECOMMEND_WINDOW_MS),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please wait before trying again.',
    retryAfter: '1 hour'
  }
});

const generalLimiter = rateLimit({
  windowMs: GENERAL_WINDOW_MS,
  max: 100,
  store: createRateLimitStore('general', GENERAL_WINDOW_MS),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please slow down.'
  }
});

module.exports = {
  authLimiter,
  scanLimiter,
  recommendLimiter,
  generalLimiter
};
