const { getUserById } = require('../db/usersRepository');
const { AUTH_COOKIE_NAME, parseCookies, verifyAuthToken } = require('../utils/auth');

async function resolveAuthUser(req) {
  const authHeader = String(req.get('Authorization') || '');
  const bearerToken = authHeader.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length).trim()
    : '';
  const cookieToken = parseCookies(req.get('Cookie'))[AUTH_COOKIE_NAME] || '';
  const token = bearerToken || cookieToken;
  if (!token) {
    return null;
  }

  const payload = verifyAuthToken(token);
  const user = await getUserById(payload.sub);
  if (!user) {
    return null;
  }

  return {
    userId: user.user_id,
    email: user.email,
    displayName: user.display_name,
    tokenPayload: payload
  };
}

async function requireAuth(req, res, next) {
  try {
    const auth = await resolveAuthUser(req);
    if (!auth) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    req.auth = auth;
    req.user = auth;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid session' });
  }
}

async function optionalAuth(req, res, next) {
  try {
    const auth = await resolveAuthUser(req);
    if (auth) {
      req.auth = auth;
      req.user = auth;
    }
    next();
  } catch (error) {
    next();
  }
}

module.exports = { requireAuth, optionalAuth };
