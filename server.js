const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Anaya AI Backend is running!");
});

app.post("/ask", async (req, res) => {
  try {
    const question = req.body.question;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API key is not configured" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: question
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "AI request failed"
      });
    }

    const answer = (data.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("\n");

    res.json({ answer: answer || "Mujhe jawab nahi mila." });
  } catch (error) {
    res.status(500).json({ error: "Server mein problem hui." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Anaya AI server running on port ${PORT}`);
});
