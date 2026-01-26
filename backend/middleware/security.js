// Security Middleware
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Rate limiting configurations
export const generalLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10, // Increased for development
  message: {
    error: 'تم تجاوز الحد المسموح من الطلبات اليوم. يرجى المحاولة بعد 24 ساعة',
    retryAfter: '24 ساعة'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for API endpoints
export const apiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10, // Increased for development
  message: {
    error: 'تم تجاوز الحد المسموح من الطلبات اليوم. يرجى المحاولة بعد 24 ساعة',
    retryAfter: '24 ساعة'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

// Very strict rate limit for audio uploads
export const audioUploadLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hour
  max: 10, // Limit each IP to 10 audio uploads per hour
  message: {
    error: 'تم تجاوز الحد المسموح من الطلبات اليوم. يرجى المحاولة بعد 24 ساعة',
    retryAfter: '24 ساعة'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Helmet security headers configuration
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
});

// API Key validation middleware
export const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  const validApiKey = process.env.API_KEY;

  // If API_KEY is not set in environment, skip validation
  if (!validApiKey) {
    return next();
  }

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({
      error: 'مفتاح API غير صحيح أو مفقود',
      code: 'INVALID_API_KEY'
    });
  }

  next();
};

// Origin validation middleware
export const validateOrigin = (req, res, next) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:3000', 'https://www.ahlamok.com', 'https://ahlamok.com'];

  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    return next();
  }

  // Allow requests without origin (like Postman, curl)
  if (!origin && process.env.NODE_ENV !== 'production') {
    return next();
  }

  // In production, reject requests without valid origin
  if (process.env.NODE_ENV === 'production' && !origin) {
    return res.status(403).json({
      error: 'الطلب مرفوض: Origin غير مسموح',
      code: 'INVALID_ORIGIN'
    });
  }

  next();
};

// Request size validation
export const validateRequestSize = (maxSizeMB = 10) => {
  return (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (contentLength > maxSizeBytes) {
      return res.status(413).json({
        error: `حجم الطلب كبير جداً. الحد الأقصى: ${maxSizeMB}MB`,
        code: 'PAYLOAD_TOO_LARGE'
      });
    }

    next();
  };
};

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'طلب غير صحيح',
      code: 'INVALID_JSON'
    });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'حجم الملف كبير جداً',
      code: 'FILE_TOO_LARGE'
    });
  }

  res.status(err.status || 500).json({
    error: isDevelopment ? err.message : 'حدث خطأ في الخادم',
    code: err.code || 'INTERNAL_ERROR',
    ...(isDevelopment && { stack: err.stack })
  });
};

