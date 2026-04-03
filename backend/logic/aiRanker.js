import fetch from "node-fetch";

export async function refineWithAI(
  careers,
  selectedInterest,
  selectedSubjects,
  riasecScores
) {
  try {
    const prompt = `
You are a career guidance AI.

User Details:
Interest Area: ${selectedInterest}
Subjects: ${selectedSubjects.join(", ")}

RIASEC:
R=${riasecScores.R}, I=${riasecScores.I}, A=${riasecScores.A},
S=${riasecScores.S}, E=${riasecScores.E}, C=${riasecScores.C}

Careers:
${careers.map(c => `- ${c.career_name}`).join("\n")}

Return ONLY valid JSON array:
[
  {
    "career_name": "string",
    "confidence": number between 0 and 1,
    "reason": "short explanation"
  }
]
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2
        })
      }
    );

    const data = await response.json();

    const content = data.choices?.[0]?.message?.content || "";

    // 🔥 SAFE JSON EXTRACTION
    const jsonStart = content.indexOf("[");
    const jsonEnd = content.lastIndexOf("]");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("AI did not return JSON");
    }

    const cleanJson = content.slice(jsonStart, jsonEnd + 1);
    return JSON.parse(cleanJson);

  } catch (err) {
    console.error("AI failed, using fallback:", err.message);

    // ✅ FALLBACK FORMAT (MATCHES FRONTEND)
    return careers.map(c => ({
      career_name: c.career_name,
      confidence: c.score ?? 0.6,
      reason: "Matched based on your interest, subjects, and personality"
    }));
  }
}
