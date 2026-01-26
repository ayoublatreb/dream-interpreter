import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Security middleware
import {
  helmetConfig,
  generalLimiter,
  apiLimiter,
  audioUploadLimiter,
  validateOrigin,
  validateRequestSize,
  errorHandler
} from "./middleware/security.js";

// Validation middleware
import {
  validateDreamText,
  validateAudioFile,
  checkValidation,
  sanitizeFilename,
  sanitizeText
} from "./middleware/validation.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security: Helmet for security headers
app.use(helmetConfig);

// CORS configuration with origin validation
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173', 'https://www.ahlamok.com', 'https://ahlamok.com'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests) in development
    if (!origin && process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    if (origin && allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (!origin && process.env.NODE_ENV === 'production') {
      callback(new Error('Not allowed by CORS'));
    } else {
      callback(null, true); // Allow in development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  maxAge: 86400 // 24 hours
}));

// Body parser with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply general rate limiting
app.use(generalLimiter);

// Validate API key exists
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ ERROR: OPENAI_API_KEY is not set in environment variables!');
  process.exit(1);
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 3,
  timeout: 30000 // 30 seconds timeout
});

// Multer configuration with file size limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'audio/webm',
      'audio/mp3',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/m4a',
      'audio/x-m4a',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('نوع الملف غير مدعوم'), false);
    }
  }
});

// System prompt فقط لـ GPT
const systemPrompt = `
أنت مفسر أحلام حكيم، تتبع المنهج المعروف في تفسير الأحلام عند أشهر علماء تفسير الأحلام في التاريخ الإسلامي محمد بن سيرين، والنابلسي، وابن حجر العسقلاني، وابن قتيبة الدينوري، وآخرون، معتمدين على القرآن والسنة،
وتعتمد الدلالات المشهورة للرموز، دون ذكر أسماء أو كتب.

تفهم جميع اللهجات العربية
تتحدث بصوت هادئ، رزين، مطمئن،
وكأنك شيخ ناصح يحدّث شخصاً على انفراد.

❗ أسلوب الكلام:
- العربية الفصحى السهلة.
- جُمل قصيرة ومتزنة.
- نبرة وقورة هادئة.
- توقفات طبيعية بين الجمل.
- عبارات قليلة ولكن معبّرة.

❗ منهج التفسير:
- فسّر الرؤيا بهدوء وتأنٍ.
- اربط المعنى بسياق الحلم وحال الرائي إن ظهر.
- لا تجزم بالغيب.
- قدّم المعنى على أنه اجتهاد وتوجيه.

❗ التزم بما يلي:
- لا تذكر أسماء علماء أو مصادر.
- لا تستخدم أسلوب الخطابة أو الوعظ.
- لا تُطِل في الشرح.

اختم التفسير دائماً بعبارة:
"والله أعلم، واسأل الله الخير"

إذا لم تتضح الرؤيا، قل فقط:
"لم تتضح الرؤيا بما يكفي لتفسيرها."

`;


function humanizeText(text) {
  return `${text.replace(/\./g, "…")}`;
}

// تحويل الصوت لنص مع حماية إضافية
async function transcribeAudio(buffer, originalName) {
  // Sanitize filename
  const safeFilename = sanitizeFilename(originalName);
  const tempPath = path.join(__dirname, 'temp', `temp-${Date.now()}-${safeFilename}`);

  // Ensure temp directory exists
  const tempDir = path.join(__dirname, 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  try {
    fs.writeFileSync(tempPath, buffer);

    const transcription = await client.audio.transcriptions.create({
      file: fs.createReadStream(tempPath),
      model: "whisper-1",
      language: "ar"
    });

    // Clean up temp file
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }

    // Sanitize transcription result
    return sanitizeText(transcription.text);
  } catch (error) {
    // Clean up temp file on error
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    throw error;
  }
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});


const limits = {};

function dailyLimit(req, res, next) {
  const key = req.ip;
  const now = Date.now();

  if (!limits[key]) {
    limits[key] = { count: 1, time: now };
    return next();
  }

  const hours = (now - limits[key].time) / 3600000;

  if (hours >= 24) {
    limits[key] = { count: 1, time: now };
    return next();
  }

  if (limits[key].count >= 10) {
    return res.status(429).json({
      error: "لقد استعملت الحد اليومي. انتظر 24 ساعة."
    });
  }

  limits[key].count++;
  next();
}


// Endpoint for audio with security middleware
app.post(
  "/dream-audio",
  audioUploadLimiter, dailyLimit, // Strict rate limiting for audio uploads
  validateRequestSize(10), // Max 10MB
  upload.single("audio"),
  validateAudioFile, // Validate file type and size
  async (req, res, next) => {
    try {
      // 1️⃣ تحويل الصوت لنص
      const userText = await transcribeAudio(req.file.buffer, req.file.originalname);

      if (!userText || userText.trim().length < 2) {
        return res.json({
          inputText: userText,
          replyText: "لم أسمع شيئاً واضحاً. الرجاء المحاولة مرة أخرى.",
          audioBase64: null
        });
      }

      // Validate text length
      if (userText.length > 5000) {
        return res.status(400).json({
          error: "النص طويل جداً. الحد الأقصى: 5000 حرف",
          code: "TEXT_TOO_LONG"
        });
      }

      // 2️⃣ GPT: تفسير الحلم فقط
      const gptResponse = await client.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userText }
        ],
        temperature: 0.7,
        max_tokens: 1000 // Limit response length
      });

      const rawReply = gptResponse.choices[0].message.content.trim();
      const replyText = sanitizeText(humanizeText(rawReply));

      // 3️⃣ TTS: فقط الرد النهائي، بدون أي تعليمات إضافية
      const ttsResponse = await client.audio.speech.create({
        model: "tts-1",
        voice: "alloy", // صوت رجل هادئ وحكيم
        input: replyText.substring(0, 4000), // Limit TTS input
      });

      const bufferTTS = Buffer.from(await ttsResponse.arrayBuffer());
      const audioBase64 = bufferTTS.toString("base64");

      res.json({
        inputText: userText,
        replyText,
        audioBase64
      });

    } catch (err) {
      console.error("❌ Error processing dream:", err);

      // Don't expose internal errors
      if (err.status === 401 || err.status === 403) {
        return res.status(err.status).json({
          error: "خطأ في المصادقة",
          code: "AUTH_ERROR"
        });
      }

      if (err.status === 429) {
        return res.status(429).json({
          error: "تم تجاوز الحد المسموح. يرجى المحاولة لاحقاً",
          code: "RATE_LIMIT_EXCEEDED"
        });
      }

      next(err); // Pass to error handler
    }
  }
);

// Endpoint for text with security middleware
app.post(
  "/dream-text", dailyLimit, // Strict rate limiting for text uploads
  apiLimiter, // Rate limiting for API calls
  validateRequestSize(1), // Max 1MB for text
  validateDreamText, // Input validation
  checkValidation, // Check validation results
  async (req, res, next) => {
    try {
      const { text } = req.body;

      // Additional validation (already done by middleware, but double-check)
      if (!text || text.trim().length < 2) {
        return res.json({
          inputText: text,
          replyText: "لم أستطع تحديد حلم واضح لتفسيره.",
          audioBase64: null
        });
      }

      // GPT: تفسير الحلم فقط
      const gptResponse = await client.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text }
        ],
        temperature: 0.7,
        max_tokens: 1000 // Limit response length
      });

      const rawReply = gptResponse.choices[0].message.content.trim();
      const replyText = sanitizeText(humanizeText(rawReply));

      // TTS: فقط الرد النهائي
      const ttsResponse = await client.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: replyText.substring(0, 4000), // Limit TTS input
      });

      const bufferTTS = Buffer.from(await ttsResponse.arrayBuffer());
      const audioBase64 = bufferTTS.toString("base64");

      res.json({
        inputText: text,
        replyText,
        audioBase64
      });

    } catch (err) {
      console.error("❌ Error processing dream text:", err);

      // Don't expose internal errors
      if (err.status === 401 || err.status === 403) {
        return res.status(err.status).json({
          error: "خطأ في المصادقة",
          code: "AUTH_ERROR"
        });
      }

      if (err.status === 429) {
        return res.status(429).json({
          error: "تم تجاوز الحد المسموح. يرجى المحاولة لاحقاً",
          code: "RATE_LIMIT_EXCEEDED"
        });
      }

      next(err); // Pass to error handler
    }
  }
);

// Endpoint for social sharing (Facebook OG Tags)
app.get("/share", (req, res) => {
  try {
    const { d, i } = req.query;

    // Default content if params are missing
    const dreamText = d ? sanitizeText(d) : "تفسير الأحلام";
    const interpretationText = i ? sanitizeText(i) : "احصل على تفسير دقيق لحلمك الآن.";

    // Redirect to main site after a brief delay so users can see the content if they click
    // We pass the parameters back so the frontend can display them
    const redirectUrl = `https://www.ahlamok.com/?d=${encodeURIComponent(d || "")}&i=${encodeURIComponent(i || "")}`;

    const html = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>تفسير حلم: ${dreamText.substring(0, 50)}...</title>
        
        <!-- Facebook Open Graph -->
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Ahlamok - تفسير الأحلام" />
        <meta property="og:title" content="💭 حلم: ${dreamText.substring(0, 60)}..." />
        <meta property="og:description" content="📖 التفسير: ${interpretationText.substring(0, 250)}..." />
        <meta property="og:image" content="https://www.ahlamok.com/dream-icon.png" />
        
        <!-- Twitter Cards -->
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="💭 حلم: ${dreamText.substring(0, 60)}..." />
        <meta name="twitter:description" content="📖 التفسير: ${interpretationText.substring(0, 250)}..." />
        
        <meta http-equiv="refresh" content="0; url=${redirectUrl}" />
        
        <style>
          body { font-family: sans-serif; text-align: center; padding: 50px; background: #f0f2f5; }
          .loader { font-size: 24px; color: #555; }
        </style>
      </head>
      <body>
        <div class="loader">جارٍ التوجيه إلى Ahlamok... 🌙</div>
        <script>
          window.location.href = "${redirectUrl}";
        </script>
      </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    console.error("Share endpoint error:", error);
    res.redirect("https://www.ahlamok.com");
  }
});

// Error handler (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "المسار غير موجود",
    code: "NOT_FOUND"
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔒 Security features enabled`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);

  // Security warnings
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  WARNING: OPENAI_API_KEY not set!');
  }

  if (process.env.NODE_ENV === 'production' && !process.env.ALLOWED_ORIGINS) {
    console.warn('⚠️  WARNING: ALLOWED_ORIGINS not set in production!');
  }
});
