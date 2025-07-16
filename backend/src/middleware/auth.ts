import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Basic authentication middleware - in production, use proper JWT or Azure AD
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // For now, implement basic API key authentication
  const apiKey = req.header('X-API-Key');
  const validApiKey = process.env.API_KEY;

  if (!validApiKey) {
    // If no API key is configured, allow access (development mode)
    logger.warn('No API key configured - allowing access');
    return next();
  }

  if (!apiKey || apiKey !== validApiKey) {
    logger.warn('Invalid API key attempt', { ip: req.ip });
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Valid API key required'
    });
  }

  next();
};