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

// =======================
// 🎤 تفسير الأحلام من الصوت
// =======================
app.post("/dream-audio", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "ما كاينش audio" });

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: "whisper-1",
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
انت مفسر ديال الأحلام بحال ابن سيرين والنابلسي. تجاوب غير بالدارجة المغربية العادية، بحال كنتي كتهضر مع صحابك، بطريقة بسيطة وسهلة.
كل جملة قصيرة وخليها فسططر بوحدها.
ممنوع تستعمل أي كلمة فصحى أو رسمية أو معقدة.
ممنوع كلمات بحال: عادة، يمكن، يعني، يدل على، إن، فإذا، يجب، خاص.
إيلا النص مش واضح سول المستخدم باش يوضح قبل ما تجاوب.
ركز على كلام عادي وسهل الفهم.
          `,
        },
        {
          role: "user",
          content: transcription.text,
        },
      ],
    });

    let formatted = completion.choices[0].message.content
      .split(/(?<=[.!?])/)
      .map((s) => s.trim())
      .filter(Boolean)
      .join("\n");

    res.json({ reply: formatted });

    fs.unlinkSync(req.file.path);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// =======================
// 📝 تفسير الأحلام من النص
// =======================
app.post("/dream", async (req, res) => {
  try {
    const { question } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
انت مفسر ديال الأحلام بحال ابن سيرين والنابلسي. تجاوب غير بالدارجة المغربية العادية، بحال كنتي كتهضر مع صحابك، بطريقة بسيطة وسهلة.
كل جملة قصيرة وخليها فسططر بوحدها.
ممنوع تستعمل أي كلمة فصحى أو رسمية أو معقدة.
ممنوع كلمات بحال: عادة، يمكن، يعني، يدل على، إن، فإذا، يجب، خاص.
إيلا النص مش واضح سول المستخدم باش يوضح قبل ما تجاوب.
ركز على كلام عادي وسهل الفهم.
          `,
        },
        {
          role: "user",
          content: question,
        },
      ],
    });

    let formatted = completion.choices[0].message.content
      .split(/(?<=[.!?])/)
      .map((s) => s.trim())
      .filter(Boolean)
      .join("\n");

    res.json({ reply: formatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// =======================
// 🚀 تشغيل السيرفر
// =======================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
