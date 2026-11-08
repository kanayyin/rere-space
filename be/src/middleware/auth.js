import jwt from 'jsonwebtoken';
import { ApiError } from '../lib/errors.js';

export function requireAdmin(req, res, next) {
  const token = req.cookies?.pastel_token;
  if (!token) return next(ApiError.unauthorized());
  try {
    const payload = jwt.verify(token, process.env.SESSION_SECRET || 'dev-secret');
    req.admin = payload;
    next();
  } catch {
    next(ApiError.unauthorized());
  }
}
