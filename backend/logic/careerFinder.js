import fetch from "node-fetch";

/**
 * findCareersWithAI
 * Asks OpenRouter AI to suggest careers based on user data.
 */
export async function findCareersWithAI(
  selectedInterest,
  selectedSubjects,
  riasecScores
) {
  try {
    const prompt = `
You are a career guidance expert. Based on the following user profile, suggest the 5 best career paths.

User Profile:
- Interest Area: ${selectedInterest}
- Strong Subjects: ${selectedSubjects.join(", ")}
- RIASEC Personality Profile: R:${riasecScores.R}, I:${riasecScores.I}, A:${riasecScores.A}, S:${riasecScores.S}, E:${riasecScores.E}, C:${riasecScores.C}

For each career, provide:
1. Career Name
2. Confidence score (0.0 to 1.0)
3. A brief reason why it's a good match.

Return ONLY a valid JSON array in this exact format:
[
  {
    "career_name": "Software Engineer",
    "confidence": 0.95,
    "reason": "Heavy focus on logic and problem solving matches your Interest and subjects."
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
          temperature: 0.3
        })
      }
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Extract JSON array
    const jsonStart = content.indexOf("[");
    const jsonEnd = content.lastIndexOf("]");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("AI did not return valid JSON array");
    }

    const cleanJson = content.slice(jsonStart, jsonEnd + 1);
    return JSON.parse(cleanJson);

  } catch (err) {
    console.warn("AI Career Finding failed:", err.message);
    throw err; // Let the caller handle the fallback
  }
}
