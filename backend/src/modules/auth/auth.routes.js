import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../../lib/errors.js';
import { requireAdmin } from '../../middleware/auth.js';

export const authRouter = Router();

authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw ApiError.badRequest('Email dan password wajib diisi.');

    const validEmail = process.env.ADMIN_EMAIL;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (!validEmail || !validPassword) {
      throw new ApiError(500, 'CONFIG_ERROR', 'ADMIN_EMAIL / ADMIN_PASSWORD belum diset di .env.');
    }
    if (email !== validEmail || password !== validPassword) {
      throw ApiError.unauthorized('Email atau password salah.');
    }

    const admin = { id: 'admin-1', email: validEmail, name: process.env.ADMIN_NAME || 'Admin' };
    const token = jwt.sign(
      admin,
      process.env.SESSION_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );
    res.cookie('pastel_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ data: { admin } });
  } catch (err) { next(err); }
});

authRouter.post('/logout', (req, res) => {
  res.clearCookie('pastel_token');
  res.json({ data: { ok: true } });
});

authRouter.get('/me', requireAdmin, (req, res) => {
  res.json({ data: { admin: req.admin } });
});
