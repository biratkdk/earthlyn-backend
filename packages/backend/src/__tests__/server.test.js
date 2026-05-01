const http = require('http');
const fs = require('fs');
const path = require('path');

process.env.LOG_LEVEL = 'silent';

const { app } = require('../server');
const { detectBooksFromImageUpload } = require('../services/referenceScanUploadService');
const { AUTH_COOKIE_NAME, AUTH_CSRF_COOKIE_NAME, verifyPassword } = require('../utils/auth');
const { closePool } = require('../db/client');

let server;
let baseUrl;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(0, () => {
    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}`;
    done();
  });
});

afterAll((done) => {
  server.close(async () => {
    await closePool();
    done();
  });
});

test('GET /health returns service status', async () => {
  const response = await fetch(`${baseUrl}/health`);
  const payload = await response.json();

  expect(response.status).toBe(200);
  expect(payload.success).toBe(true);
  expect(payload.service).toBe('shelfscanner-api');
});

test('unknown API routes return JSON 404', async () => {
  const response = await fetch(`${baseUrl}/api/not-found`);
  const payload = await response.json();

  expect(response.status).toBe(404);
  expect(payload).toEqual({ success: false, error: 'Route not found' });
});

test('legacy public catalog routes are not mounted', async () => {
  const response = await fetch(`${baseUrl}/books`);
  const payload = await response.json();

  expect(response.status).toBe(404);
  expect(payload).toEqual({ success: false, error: 'Route not found' });
});

test('legacy account route is not mounted', async () => {
  const response = await fetch(`${baseUrl}/account`);
  const payload = await response.json();

  expect(response.status).toBe(404);
  expect(payload).toEqual({ success: false, error: 'Route not found' });
});

test('invalid JSON requests return a structured 400', async () => {
  const response = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{broken-json'
  });
  const payload = await response.json();

  expect(response.status).toBe(400);
  expect(payload).toEqual({ success: false, error: 'Invalid JSON request body' });
});

test('register and login return a normalized authenticated user', async () => {
  const email = `test-${Date.now()}@example.com`;
  const registerResponse = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ displayName: 'Test Reader', email, password: 'password123' })
  });
  const registerPayload = await registerResponse.json();

  expect(registerResponse.status).toBe(201);
  expect(registerPayload.success).toBe(true);
  expect(registerPayload.token).toBeUndefined();
  expect(registerResponse.headers.get('set-cookie')).toContain(AUTH_COOKIE_NAME);
  expect(registerPayload.user.email).toBe(email);

  const loginResponse = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'password123' })
  });
  const loginPayload = await loginResponse.json();

  expect(loginResponse.status).toBe(200);
  expect(loginPayload.success).toBe(true);
  expect(loginPayload.token).toBeUndefined();
  expect(loginResponse.headers.get('set-cookie')).toContain(AUTH_COOKIE_NAME);
});

test('cookie auth can fetch the current user and logout clears the cookie', async () => {
  const email = `cookie-${Date.now()}@example.com`;
  const loginResponse = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ displayName: 'Cookie Reader', email, password: 'password123' })
  });
  const setCookie = loginResponse.headers.get('set-cookie');
  const cookie = setCookie.split(';')[0];

  const meResponse = await fetch(`${baseUrl}/auth/me`, {
    headers: { Cookie: cookie }
  });
  const mePayload = await meResponse.json();
  const csrfSetCookie = meResponse.headers.get('set-cookie') || setCookie;
  const csrfToken = csrfSetCookie.match(new RegExp(`${AUTH_CSRF_COOKIE_NAME}=([^;]+)`))?.[1];

  expect(meResponse.status).toBe(200);
  expect(mePayload.user.email).toBe(email);

  const logoutResponse = await fetch(`${baseUrl}/auth/logout`, {
    method: 'POST',
    headers: {
      Cookie: `${cookie}; ${AUTH_CSRF_COOKIE_NAME}=${csrfToken}`,
      'X-ShelfScanner-Request': 'fetch',
      'X-ShelfScanner-CSRF': csrfToken
    }
  });

  expect(logoutResponse.status).toBe(200);
  expect(logoutResponse.headers.get('set-cookie')).toContain(AUTH_COOKIE_NAME);
});

test('cookie-authenticated writes require the ShelfScanner request header', async () => {
  const email = `csrf-${Date.now()}@example.com`;
  const loginResponse = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ displayName: 'CSRF Reader', email, password: 'password123' })
  });
  const cookie = loginResponse.headers.get('set-cookie').split(';')[0];

  const logoutResponse = await fetch(`${baseUrl}/auth/logout`, {
    method: 'POST',
    headers: { Cookie: cookie }
  });
  const payload = await logoutResponse.json();

  expect(logoutResponse.status).toBe(403);
  expect(payload).toEqual({ success: false, error: 'Invalid browser request' });
});

test('cookie-authenticated writes require a matching CSRF token', async () => {
  const email = `csrf-token-${Date.now()}@example.com`;
  const loginResponse = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ displayName: 'Token Reader', email, password: 'password123' })
  });
  const setCookie = loginResponse.headers.get('set-cookie');
  const authCookie = setCookie.split(';')[0];

  const response = await fetch(`${baseUrl}/auth/logout`, {
    method: 'POST',
    headers: {
      Cookie: authCookie,
      'X-ShelfScanner-Request': 'fetch',
      'X-ShelfScanner-CSRF': 'wrong-token'
    }
  });
  const payload = await response.json();

  expect(response.status).toBe(403);
  expect(payload).toEqual({ success: false, error: 'Invalid request token' });
});

test('malformed password hashes fail without throwing', () => {
  expect(verifyPassword('password123', 'bad:hash')).toBe(false);
});

test('scan rejects non-image payloads even with an image mimetype', async () => {
  const form = new FormData();
  form.append('image', new Blob(['not an image'], { type: 'image/png' }), 'fake.png');

  const response = await fetch(`${baseUrl}/api/scan`, {
    method: 'POST',
    body: form
  });
  const payload = await response.json();

  expect(response.status).toBe(400);
  expect(payload.error).toBe('Uploaded file is not a supported image');
});

test('bundled demo scan calibration works without a vision API key', async () => {
  const demoPath = path.join(__dirname, '..', '..', '..', 'frontend', 'public', 'fairy', 'bookshelf-demo.jpg');
  const detection = await detectBooksFromImageUpload(fs.readFileSync(demoPath), 'image/jpeg');

  expect(detection.detectionProvider).toBe('demo-calibration');
  expect(detection.detectedBooks).toHaveLength(8);
  expect(detection.detectedBooks[0].title).toBe('The Tattooist of Auschwitz');
});
