const express = require('express');
const { createUser, getUserWithPasswordByEmail, getUserById, serializeUser } = require('../db/usersRepository');
const { clearAuthCookie, createPasswordHash, normalizeEmail, setAuthCookie, setCsrfCookie, signAuthToken, verifyPassword } = require('../utils/auth');
const { requireAuth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');

const router = express.Router();

function validateCredentials({ email = '', password = '', displayName = '' }, { requireDisplayName = false } = {}) {
  const errors = [];
  const normalizedEmail = normalizeEmail(email);
  const normalizedDisplayName = String(displayName || '').trim();

  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    errors.push('A valid email is required');
  }

  if (String(password || '').length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (requireDisplayName && normalizedDisplayName.length < 2) {
    errors.push('Display name must be at least 2 characters');
  }

  return errors;
}

router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const { email = '', password = '', displayName = '' } = req.body || {};
    const errors = validateCredentials({ email, password, displayName }, { requireDisplayName: true });
    if (errors.length) {
      return res.status(400).json({ success: false, errors });
    }

    const existing = await getUserWithPasswordByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, error: 'An account with that email already exists' });
    }

    const user = await createUser({
      email,
      displayName,
      passwordHash: createPasswordHash(password)
    });

    const token = signAuthToken(user);
    setAuthCookie(res, token);
    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { email = '', password = '' } = req.body || {};
    const errors = validateCredentials({ email, password });
    if (errors.length) {
      return res.status(400).json({ success: false, errors });
    }

    const userRecord = await getUserWithPasswordByEmail(email);
    if (!userRecord || !verifyPassword(password, userRecord.password_hash)) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const user = serializeUser(userRecord);
    const token = signAuthToken(user);
    setAuthCookie(res, token);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true });
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await getUserById(req.auth.userId);
    setCsrfCookie(res);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
