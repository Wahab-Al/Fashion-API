import { Application } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import xss from 'xss-clean';
import hpp from "hpp";


/**
 * @description Applies all security middleware to the Express application
 * @param app Express application instance
 */
export const applySecurityMiddleware = (app: Application) : void =>{
  app.use(helmet())

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    message: {
      error: 'Too many requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
  })

  // HTTP security headers
  app.use(limiter)

  // Brute force protection — 100 requests per 15 minutes per IP
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 10,
    message: { error: 'Too many auth attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false
  })

  // Auth routes stricter limit — 10 requests per 15 minutes
  app.use('/api/auth', authLimiter)

  // XSS input sanitization
  app.use(xss())

  // HTTP parameter pollution
  app.use(hpp())
}