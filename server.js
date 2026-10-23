const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Anaya AI Backend is running!");
});

app.post("/ask", async (req, res) => {
  try {
    const question = req.body?.question;
    if (!question) return res.status(400).json({ error: "Question is required" });

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Groq API key is not configured" });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: "Tum Anaya ho, ek friendly Hindi AI assistant. Jawab saral Hindi mein do." },
          { role: "user", content: question }
        ]
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || "Groq AI request failed" });

    res.json({ answer: data.choices?.[0]?.message?.content || "Mujhe jawab nahi mila." });
  } catch (error) {
    res.status(500).json({ error: "Server mein problem hui." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Anaya AI server running on port ${PORT}`);
});
