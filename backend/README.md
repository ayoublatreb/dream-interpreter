# 🔒 Backend API - Secure Dream Interpreter

## الميزات الأمنية

- ✅ Rate Limiting (تحديد معدل الطلبات)
- ✅ Input Validation (التحقق من المدخلات)
- ✅ XSS Protection (حماية من XSS)
- ✅ CORS Protection (حماية CORS)
- ✅ File Upload Security (أمان رفع الملفات)
- ✅ Security Headers (رؤوس الأمان)
- ✅ Error Handling (معالجة آمنة للأخطاء)

## الإعداد السريع

### 1. تثبيت المكتبات

```bash
npm install
```

### 2. إعداد متغيرات البيئة

أنشئ ملف `.env` في مجلد `backend/`:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3. تشغيل الخادم

```bash
# Development
npm run dev

# Production
npm start
```

## Endpoints

### `POST /dream-audio`
معالجة ملف صوتي وتفسير الحلم

**Rate Limit**: 10 طلبات/ساعة

**Request**:
- `audio`: ملف صوتي (max 10MB)

**Response**:
```json
{
  "inputText": "نص الحلم",
  "replyText": "التفسير",
  "audioBase64": "base64_encoded_audio"
}
```

### `POST /dream-text`
تفسير حلم من نص

**Rate Limit**: 20 طلب/15 دقيقة

**Request**:
```json
{
  "text": "نص الحلم"
}
```

**Response**:
```json
{
  "inputText": "نص الحلم",
  "replyText": "التفسير",
  "audioBase64": "base64_encoded_audio"
}
```

### `GET /health`
فحص حالة الخادم

## الحماية

راجع `SECURITY_GUIDE.md` للتفاصيل الكاملة.

