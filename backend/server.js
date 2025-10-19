import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/dream", async (req, res) => {
  try {
    const { question } = req.body;

    const completion = await groq.chat.completions.create({
      model: "moonshotai/kimi-k2-instruct-0905", 
      messages: [
        {
          role: "system",
          content:
            "Tu es un interprète de rêves basé sur Ibn Sirin et Al-Nabulsi. Ne réponds qu'aux rêves, ignore tout ce qui n'est pas un rêve.",
        },
        {
          role: "user",
          content: question,
        },
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`🚀 Backend running on http://localhost:${process.env.PORT || 3001}`);
});
