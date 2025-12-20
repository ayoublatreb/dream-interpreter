import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";
import multer from "multer";
import fs from "fs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// System prompt فقط لـ GPT
const systemPrompt = `
أنت خبير في تفسير الأحلام على منهج ابن سيرين والنابلسي.
افهم جميع اللهجات العربية (مغربية، مصرية، خليجية، شامية…).
رد بالعربية الفصحى، مختصر، نبرة هادئة وهادية.
صوت رجل هادئ وحكيم
إذا الكلام ليس حلم واضح، قل: "لم أستطع تحديد حلم واضح لتفسيره."
`;

// تحويل الصوت لنص
async function transcribeAudio(buffer, originalName) {
  const tempPath = `./temp-${Date.now()}-${originalName}`;
  fs.writeFileSync(tempPath, buffer);

  const transcription = await client.audio.transcriptions.create({
    file: fs.createReadStream(tempPath),
    model: "whisper-1",
    language: "ar"
  });

  fs.unlinkSync(tempPath);
  return transcription.text;
}

// Endpoint for audio
app.post("/dream-audio", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "لم يتم إرسال ملف صوتي" });

    // 1️⃣ تحويل الصوت لنص
    const userText = await transcribeAudio(req.file.buffer, req.file.originalname);

    if (!userText || userText.trim().length < 2) {
      return res.json({
        inputText: userText,
        replyText: "لم أسمع شيئاً واضحاً. الرجاء المحاولة مرة أخرى.",
        audioBase64: null
      });
    }

    // 2️⃣ GPT: تفسير الحلم فقط
    const gptResponse = await client.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userText }
      ],
      temperature: 0.7
    });

    const replyText = gptResponse.choices[0].message.content.trim();

    // 3️⃣ TTS: فقط الرد النهائي، بدون أي تعليمات إضافية
    const ttsResponse = await client.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy", // صوت رجل هادئ وحكيم
      input: replyText,
      language: "ar"
    });

    const bufferTTS = Buffer.from(await ttsResponse.arrayBuffer());
    const audioBase64 = bufferTTS.toString("base64");

    res.json({ inputText: userText, replyText, audioBase64 });

  } catch (err) {
    console.error("❌ Error processing dream:", err);
    res.status(500).json({ error: "حدث خطأ أثناء المعالجة" });
  }
});

// Endpoint for text
app.post("/dream-text", async (req, res) => {
  try {
    const { text } = req.body;
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
      temperature: 0.7
    });

    const replyText = gptResponse.choices[0].message.content.trim();

    // TTS: فقط الرد النهائي
    const ttsResponse = await client.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: replyText,
      language: "ar"
    });

    const bufferTTS = Buffer.from(await ttsResponse.arrayBuffer());
    const audioBase64 = bufferTTS.toString("base64");

    res.json({ inputText: text, replyText, audioBase64 });

  } catch (err) {
    console.error("❌ Error processing dream text:", err);
    res.status(500).json({ error: "حدث خطأ أثناء المعالجة" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
