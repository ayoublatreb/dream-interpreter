// Input Validation Middleware
import { body, validationResult } from 'express-validator';
import xss from 'xss';

// XSS sanitization options
const xssOptions = {
  whiteList: {},
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script'],
};

// Sanitize text input
export const sanitizeText = (text) => {
  if (typeof text !== 'string') return '';
  return xss(text.trim(), xssOptions);
};

// Validate and sanitize dream text input
export const validateDreamText = [
  body('text')
    .trim()
    .notEmpty()
    .withMessage('النص مطلوب')
    .isLength({ min: 2, max: 5000 })
    .withMessage('يجب أن يكون النص بين 2 و 5000 حرف')
    .custom((value) => {
      // Check for suspicious patterns
      const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /eval\(/i,
        /expression\(/i,
      ];

      for (const pattern of suspiciousPatterns) {
        if (pattern.test(value)) {
          throw new Error('النص يحتوي على محتوى غير مسموح');
        }
      }

      return true;
    })
    .customSanitizer((value) => sanitizeText(value)),
];

// Validate audio file
export const validateAudioFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'لم يتم إرسال ملف صوتي',
      code: 'NO_FILE'
    });
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (req.file.size > maxSize) {
    return res.status(413).json({
      error: 'حجم الملف كبير جداً. الحد الأقصى: 10MB',
      code: 'FILE_TOO_LARGE'
    });
  }

  // Check file type
  const allowedMimeTypes = [
    'audio/webm',
    'audio/mp3',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/m4a',
    'audio/x-m4a',
  ];

  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      error: 'نوع الملف غير مدعوم. يرجى استخدام ملف صوتي صالح',
      code: 'INVALID_FILE_TYPE'
    });
  }

  // Check filename for suspicious patterns
  const suspiciousPatterns = [
    /\.\./,
    /[<>:"|?*]/,
    /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i,
  ];

  if (req.file.originalname) {
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(req.file.originalname)) {
        return res.status(400).json({
          error: 'اسم الملف غير صالح',
          code: 'INVALID_FILENAME'
        });
      }
    }
  }

  next();
};

// Check validation results
export const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'بيانات غير صحيحة',
      code: 'VALIDATION_ERROR',
      details: errors.array()
    });
  }
  next();
};

// Sanitize filename
export const sanitizeFilename = (filename) => {
  if (!filename) return `audio-${Date.now()}.webm`;
  
  // Remove path components and dangerous characters
  let sanitized = filename
    .replace(/^.*[\\\/]/, '') // Remove path
    .replace(/[<>:"|?*\x00-\x1f]/g, '') // Remove dangerous chars
    .replace(/\.\./g, '') // Remove parent directory
    .substring(0, 255); // Limit length

  // Ensure it has a valid extension
  if (!sanitized.match(/\.(webm|mp3|wav|ogg|m4a)$/i)) {
    sanitized = `${sanitized}.webm`;
  }

  return sanitized || `audio-${Date.now()}.webm`;
};

