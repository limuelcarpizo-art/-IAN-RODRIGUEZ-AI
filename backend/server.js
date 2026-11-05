import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(express.json({ limit: "32kb" }));

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY environment variable.");
  process.exit(1);
}
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const model = process.env.OPENAI_MODEL || "gpt-5.5";

app.get("/", (_req, res) => res.json({ status: "Ian Rodriguez AI backend is running" }));

app.post("/chat", async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();
    if (!message) return res.status(400).json({ error: "Message is required" });
    if (message.length > 8000) return res.status(400).json({ error: "Message is too long" });

    const response = await client.responses.create({
      model,
      instructions: "You are Ian Rodriguez AI, a helpful, friendly assistant. Be accurate, practical, and conversational. You may use casual Taglish when appropriate.",
      input: message
    });
    res.json({ reply: response.output_text || "Sorry bro, wala akong nabuong sagot." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "The AI service could not complete the request." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Ian backend listening on ${port}`));
