import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create audio directory if it doesn't exist
const audioDir = path.join(__dirname, 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir);
}

app.use('/audio', express.static(audioDir));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ===============================
// System Prompt (ابن سيرين + النابلسي)
// ===============================
const systemPrompt = `
أنت خبير في تفسير الأحلام على منهج ابن سيرين والنابلسي.

مهمتك تمر عبر مرحلتين:

المرحلة الأولى:
فهم الكلام مهما كانت لهجته العربية (مغربية، مصرية، خليجية، شامية).
حوّل الكلام إلى العربية الفصحى في ذهنك دون إظهار ذلك للمستخدم.

المرحلة الثانية:
إذا كان الكلام حلمًا واضحًا، قم بتفسيره تفسيرًا شرعيًا مبسطًا.
إذا لم يكن حلمًا، أو كان كلامًا عاديًا، أو غير واضح، قل:
"لم أستطع تحديد حلم واضح لتفسيره."
اكتب التفسير بأسلوب بسيط،
بجمل قصيرة،
وبنبرة هادئة ومطمئنة،
ليُقرأ صوتيًا وكأنه إنسان حقيقي.
قواعد:
- لا تجب إلا على الأحلام.
- لا تفسّر الأسئلة أو القصص غير المتعلقة بالأحلام.
- لا تطلب معلومات إضافية.
- لا تخرج عن دور مفسر الأحلام.
`;

// ===============================
// تفسير الحلم (نص)
// ===============================
app.post("/dream", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: "النص فارغ" });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
    });

    const reply =
      response.output_text?.trim() || "لم يتم التعرف على حلم واضح.";

    res.json({ reply });
  } catch (error) {
    console.error("❌ Backend Error:", error);
    res.status(500).json({ error: "حدث خطأ في الخادم" });
  }
});

// ===============================
// Text-to-Speech (صوت)
// ===============================
app.post("/tts", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "النص فارغ" });
    }

    const mp3 = await client.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    const speechFile = path.join(audioDir, `${Date.now()}.mp3`);
    
    await fs.promises.writeFile(speechFile, buffer);

    const audioUrl = `http://localhost:${PORT}/audio/${path.basename(speechFile)}`;
    res.json({ audioUrl });

  } catch (error) {
    console.error("❌ TTS Error:", error);
    res.status(500).json({ error: "حدث خطأ في تحويل النص إلى كلام" });
  }
});

// ===============================
// تشغيل الخادم
// ===============================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
