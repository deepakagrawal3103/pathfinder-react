import fetch from "node-fetch";

export async function aiResourceHandler(req, res) {
  try {
    const { interest, subjects = [] } = req.body;

    if (!interest) {
      return res.status(400).json({ error: "Interest is required" });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: "OpenRouter API key missing" });
    }

    const prompt = `
You are a career guidance expert.

Interest: ${interest}
User subjects: ${subjects.join(", ") || "None"}

TASK:
1. Suggest 5 important subjects to learn
2. Suggest 5 FREE learning resources

RULES:
- FREE only
- Prefer YouTube, Coursera free, edX, docs
- Return ONLY valid JSON
- No markdown, no explanations

JSON FORMAT:
{
  "subjects": ["subject1", "subject2"],
  "resources": [
    {
      "title": "Course name",
      "platform": "Platform",
      "link": "https://..."
    }
  ]
}
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices.length) {
      throw new Error("No AI response");
    }

    const text = data.choices[0].message.content;

    // Safe JSON extraction
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    const cleanJson = text.slice(jsonStart, jsonEnd + 1);

    const parsed = JSON.parse(cleanJson);
    res.json(parsed);

  } catch (err) {
    console.error("❌ OPENROUTER ERROR:", err);
    res.status(500).json({ error: "AI resource generation failed" });
  }
}
