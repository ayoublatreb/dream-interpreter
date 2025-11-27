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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const upload = multer({ dest: "uploads/" });

// =========================================
// 📌 SYSTEM PROMPT النهائي للدارجة المغربية
// =========================================
const systemPrompt = `
إنت مغربي متمكّن ف تفسير لْحْلامْ بحال ابن سيرين والنابلسي.
كتجاوب غير بالدارجة المغربية العادية، بحال كونك كتهضر مع خوك.
كل جملة فسططر بوحدها.
كلام قصير، واضح، وساهل.

ممنوع تستعمل كلمات فصحى، رسمية، أو معقدة.
ممنوع كلمات بحال: عادة – يمكن – يعني – يدل – إن – فإذا – يجب – خاص.

إيلا لْهَدْرَة ما واضحةش، سول المستخدم باش يزيد يشرح قبل ما تجاوب.

دير تشكيل مغربي باش الصوت يبان طبيعي:
مثال:
هاد → هَادْ
الحلم → لْحَلْمْ
راه → رَاهْ
كيبّان → كِيبَّانْ

جاوب بالدارجة فقط وبطريقة سهلة للفهم.
`;

// =========================================
// 🎤 تفسير الأحلام من الصوت
// =========================================
app.post("/dream-audio", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "ما كاينش الصوت" });

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: "whisper-1",
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: transcription.text },
      ],
    });

    // تقسيم النص على أسطر
    const formatted = completion.choices[0].message.content
      .split(/(?<=[.!؟])/)
      .map((s) => s.trim())
      .filter(Boolean)
      .join("\n");

    res.json({ reply: formatted });

    fs.unlinkSync(req.file.path);
  } catch (error) {
    console.error("❌ Audio Error:", error);
    res.status(500).json({ error: "وقع مشكل ف السيرفر" });
  }
});

// =========================================
// 📝 تفسير الأحلام من النص
// =========================================
app.post("/dream", async (req, res) => {
  try {
    const { question } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
    });

    const formatted = completion.choices[0].message.content
      .split(/(?<=[.!؟])/)
      .map((s) => s.trim())
      .filter(Boolean)
      .join("\n");

    res.json({ reply: formatted });
  } catch (error) {
    console.error("❌ Text Error:", error);
    res.status(500).json({ error: "وقع مشكل ف المعالجة" });
  }
});

// =========================================
// 🚀 تشغيل السيرفر
// =========================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
