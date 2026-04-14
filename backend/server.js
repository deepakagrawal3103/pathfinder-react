import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import { register, login, me } from "./routes/auth.js";
import { aiResourceHandler } from "./routes/aiResources.js";

import { rankCareers } from "./logic/ranking.js";
import { calculateRiasecScores } from "./logic/personality.js";
import { findCareersWithAI } from "./logic/careerFinder.js";
import { refineWithAI } from "./logic/aiRanker.js";

/* =========================
   FIX __dirname
========================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================
   ENV
========================= */
dotenv.config();
console.log("OPENROUTER KEY LOADED:", !!process.env.OPENROUTER_API_KEY);

/* =========================
   APP
========================= */
const app = express();
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175"
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

/* =========================
   DATA
========================= */
const careers = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "careers.json"), "utf-8")
);

const institutes = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "institutes.json"), "utf-8")
);

/* =========================
   ROUTES
========================= */
app.get("/", (req, res) => {
  res.json({ status: "Backend running" });
});

/* ========= MAIN CAREER RECOMMEND API ========= */
app.post("/api/recommend", async (req, res) => {
  try {
    const { selectedInterest, selectedSubjects, quizAnswers } = req.body;

    if (!selectedInterest || !selectedSubjects || !quizAnswers) {
      return res.status(400).json({ error: "Missing user data" });
    }

    // 1️⃣ Calculate RIASEC scores
    const riasecScores = calculateRiasecScores(quizAnswers);

    let finalResults = [];

    try {
      // 2️⃣ Try AI Discovery First
      console.log("🌐 Attempting AI Career Discovery...");
      finalResults = await findCareersWithAI(
        selectedInterest,
        selectedSubjects,
        riasecScores
      );
      console.log("✅ AI Discovery Successful");
    } catch (apiError) {
      console.warn("❌ AI Discovery Failed, falling back to local dataset:", apiError.message);
      
      // 3️⃣ Fallback: Rule-based ranking from fixed dataset
      const ranked = rankCareers(
        careers,
        selectedInterest,
        selectedSubjects,
        riasecScores
      );

      // 4️⃣ AI refinement for local results
      finalResults = await refineWithAI(
        ranked.slice(0, 5),
        selectedInterest,
        selectedSubjects,
        riasecScores
      );
    }

    res.json({
      riasecScores,
      results: finalResults
    });

  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({ error: "Career recommendation failed" });
  }
});

/* ========= OTHER ROUTES ========= */
app.post("/api/ai/resources", aiResourceHandler);

app.post("/api/auth/register", register);
app.post("/api/auth/login", login);
app.get("/api/auth/me", me);

/* =========================
   START
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
