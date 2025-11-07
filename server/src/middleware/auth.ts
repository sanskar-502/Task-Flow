import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from '../utils/jwt';
import { env } from '../env';

export interface AuthRequest extends Request {
  userId?: string;
  email?: string;
}

function getCookieOptions() {
  const options: any = {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    maxAge: 15 * 60 * 1000, // 15 minutes
  };

  // Add domain in production for cross-subdomain support
  if (env.NODE_ENV === 'production' && process.env.COOKIE_DOMAIN) {
    options.domain = process.env.COOKIE_DOMAIN;
  }

  return options;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  // Check Authorization header first (for cross-domain)
  const authHeader = req.headers.authorization;
  let accessToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
  
  // Fallback to cookies (for same-domain)
  if (!accessToken) {
    accessToken = req.cookies.access_token;
  }
  
  const refreshToken = req.cookies.refresh_token;

  if (!accessToken) {
    if (!refreshToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const payload = verifyRefreshToken(refreshToken);
      const newAccessToken = generateAccessToken({ userId: payload.userId, email: payload.email });
      
      res.cookie('access_token', newAccessToken, getCookieOptions());

      req.userId = payload.userId;
      req.email = payload.email;
      return next();
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  try {
    const payload = verifyAccessToken(accessToken);
    req.userId = payload.userId;
    req.email = payload.email;
    next();
  } catch (error) {
    if (!refreshToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const payload = verifyRefreshToken(refreshToken);
      const newAccessToken = generateAccessToken({ userId: payload.userId, email: payload.email });
      
      res.cookie('access_token', newAccessToken, getCookieOptions());

      req.userId = payload.userId;
      req.email = payload.email;
      next();
    } catch (refreshError) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }
}
