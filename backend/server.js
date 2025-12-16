import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ===============================
// System Prompt (ابن سيرين + النابلسي)
// ===============================
const systemPrompt = `
أنت مفسر أحلام على أساس ابن سيرين والنابلسي.
لا تجب إلا على الأحلام.
تجاهل كل ما ليس حلمًا.
إن لم يكن الكلام حلمًا واضحًا، فلا تفسّره.
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
// تشغيل الخادم
// ===============================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
