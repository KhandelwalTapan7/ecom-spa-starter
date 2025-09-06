// backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';

// Extract "Bearer <token>" from Authorization header
function getToken(req) {
  const h = req.headers.authorization || '';
  return h.startsWith('Bearer ') ? h.slice(7) : null;
}

// Core auth (used for both default and named export)
function _requireAuth(req, res, next) {
  try {
    const token = getToken(req);
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const id = payload.id || payload._id || payload.userId || payload.sub;
    if (!id) return res.status(401).json({ error: 'Invalid token payload' });

    // Normalize user object on request
    req.user = { id, ...payload };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Optional auth: attaches req.user if token is present; otherwise continues
function _optionalAuth(req, _res, next) {
  try {
    const token = getToken(req);
    if (!token) return next();
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const id = payload.id || payload._id || payload.userId || payload.sub;
    if (id) req.user = { id, ...payload };
  } catch (_) {
    // ignore invalid token and proceed unauthenticated
  }
  next();
}

// Admin guard (only if you add isAdmin to your JWT payload)
function _requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (!req.user.isAdmin) return res.status(403).json({ error: 'Admin only' });
  next();
}

// Exports:
// - default:      requireAuth
// - named:        requireAuth, optionalAuth, requireAdmin
const requireAuth = _requireAuth;
const optionalAuth = _optionalAuth;
const requireAdmin = _requireAdmin;

export default requireAuth;
export { requireAuth, optionalAuth, requireAdmin };
