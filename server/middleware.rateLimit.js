import rateLimit from 'express-rate-limit'

// Reasonable defaults for demo: 100 req / 5 minutes per IP
export const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
})
