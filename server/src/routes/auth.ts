import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { registerSchema, loginSchema } from '../validators/auth';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { env } from '../env';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });

    const accessToken = generateAccessToken({ userId: (user._id as any).toString(), email: user.email });
    const refreshToken = generateRefreshToken({ userId: (user._id as any).toString(), email: user.email });

    const cookieOptions: any = {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
    };

    // Add domain in production for cross-subdomain support
    if (env.NODE_ENV === 'production' && process.env.COOKIE_DOMAIN) {
      cookieOptions.domain = process.env.COOKIE_DOMAIN;
    }

    res.cookie('access_token', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refresh_token', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken({ userId: (user._id as any).toString(), email: user.email });
    const refreshToken = generateRefreshToken({ userId: (user._id as any).toString(), email: user.email });

    const cookieOptions: any = {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
    };

    // Add domain in production for cross-subdomain support
    if (env.NODE_ENV === 'production' && process.env.COOKIE_DOMAIN) {
      cookieOptions.domain = process.env.COOKIE_DOMAIN;
    }

    res.cookie('access_token', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refresh_token', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.json({ ok: true });
});

export default router;
