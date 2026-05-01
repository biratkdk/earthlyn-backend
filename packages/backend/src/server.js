const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config({ quiet: true });

const { ensureAccountSchema } = require('./db/ensureAccountSchema');
const authRoutes = require('./routes/auth');
const referenceScanRoutes = require('./routes/referenceScan');
const referenceRecommendRoutes = require('./routes/referenceRecommend');
const referencePreferencesRoutes = require('./routes/referencePreferences');
const referenceBooksRoutes = require('./routes/referenceBooks');
const { generalLimiter } = require('./middleware/rateLimit');
const { AUTH_COOKIE_NAME, AUTH_CSRF_COOKIE_NAME, parseCookies } = require('./utils/auth');
const logger = require('./utils/logger');

const app = express();
const port = Number(process.env.PORT || 5000);
const isProduction = process.env.NODE_ENV === 'production';
const SPA_FALLBACK_BLOCKLIST = [
  '/api',
  '/auth',
  '/account',
  '/books',
  '/recommendations',
  '/scan',
  '/health'
];
const allowedOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const cspConnectOrigins = (process.env.CSP_CONNECT_SRC || process.env.VITE_API_BASE_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// CORS — in production the frontend is served from the same origin
app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      // Same-origin requests (no Origin header) are always allowed
      if (!origin) { callback(null, true); return; }
      // Allow localhost only in development
      if (!isProduction && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) { callback(null, true); return; }
      if (allowedOrigins.includes(origin)) { callback(null, true); return; }
      const error = new Error('Origin not allowed by CORS');
      error.statusCode = 403;
      callback(error);
    }
  })
);

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        connectSrc: ["'self'", ...cspConnectOrigins, 'https://www.googleapis.com', 'https://vision.googleapis.com', 'https://generativelanguage.googleapis.com'],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
        ...(isProduction ? { upgradeInsecureRequests: [] } : {})
      }
    }
  })
);
app.use(compression());
app.use('/api/preferences/goodreads', express.json({ limit: process.env.GOODREADS_IMPORT_LIMIT || '8mb' }));
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '1mb' }));
app.use(express.urlencoded({ extended: true, limit: process.env.FORM_BODY_LIMIT || '1mb' }));

app.use((req, res, next) => {
  const unsafeMethod = !['GET', 'HEAD', 'OPTIONS'].includes(req.method);
  if (!unsafeMethod) {
    next();
    return;
  }

  const hasAuthCookie = String(req.headers.cookie || '').includes(`${AUTH_COOKIE_NAME}=`);
  const hasClientHeader = req.get('X-ShelfScanner-Request') === 'fetch';
  const cookies = parseCookies(req.headers.cookie || '');
  const csrfCookie = cookies[AUTH_CSRF_COOKIE_NAME];
  const csrfHeader = req.get('X-ShelfScanner-CSRF');
  if (hasAuthCookie && !hasClientHeader) {
    res.status(403).json({ success: false, error: 'Invalid browser request' });
    return;
  }
  if (hasAuthCookie && (!csrfCookie || csrfCookie !== csrfHeader)) {
    res.status(403).json({ success: false, error: 'Invalid request token' });
    return;
  }
  next();
});

// --- Health checks ---
app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'shelfscanner-api',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Shelf Scanner API is running' });
});

// --- API routes ---
app.use('/auth', authRoutes);

app.use('/api', generalLimiter);
app.use('/api/scan', referenceScanRoutes);
app.use('/api/recommend', referenceRecommendRoutes);
app.use('/api/preferences', referencePreferencesRoutes);
app.use('/api/books', referenceBooksRoutes);

// --- Serve React frontend in production ---
const distPath = path.join(__dirname, '..', '..', 'frontend', 'dist');
app.use(express.static(distPath));

// SPA fallback - any non-API GET returns index.html
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }

  // Let API 404s fall through to the JSON handler below
  if (SPA_FALLBACK_BLOCKLIST.some((blockedPath) => (
    req.path === blockedPath || req.path.startsWith(`${blockedPath}/`)
  ))) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// --- Error handlers ---
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

app.use((error, req, res, next) => {
  if (error?.name === 'MulterError') {
    const message = error.code === 'LIMIT_FILE_SIZE'
      ? 'Uploaded image is too large. Choose a photo under 20MB.'
      : 'Image upload failed';
    res.status(400).json({ success: false, error: message });
    return;
  }

  if (error instanceof SyntaxError && error.status === 400 && Object.prototype.hasOwnProperty.call(error, 'body')) {
    res.status(400).json({ success: false, error: 'Invalid JSON request body' });
    return;
  }
  logger.error(`${req.method} ${req.originalUrl}`, error.message);
  const statusCode = error.statusCode || error.status || 500;
  const publicMessage = isProduction && statusCode >= 500
    ? 'Internal server error'
    : (error.message || 'Internal server error');
  res.status(statusCode).json({
    success: false,
    error: publicMessage
  });
});

async function startServer() {
  await ensureAccountSchema();
  app.listen(port, () => {
    logger.info(`ShelfScanner API listening on http://localhost:${port}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    logger.error('Failed to start ShelfScanner API:', error);
    process.exitCode = 1;
  });
}

module.exports = { app, startServer };
