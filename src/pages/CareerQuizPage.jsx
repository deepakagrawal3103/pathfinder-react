import { useState } from "react";
import { useNavigate } from "react-router-dom";
import rawQuestions from "../data/riasec_questions.json";
import { normalizeRiasec } from "../data/normalizeRiasec";
import interestTopics from "../data/interests_topics";

function CareerQuizPage() {
  const navigate = useNavigate();

  /* ========= STATE ========= */
  const [stage, setStage] = useState("setup"); // setup | quiz | result
  const [selectedInterest, setSelectedInterest] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const questions = normalizeRiasec(rawQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);

  const [finalResults, setFinalResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!questions.length) {
    return <p style={{ padding: "2rem" }}>Loading quiz…</p>;
  }

  /* ================= SETUP ================= */
  if (stage === "setup") {
    return (
      <main className="dashboard-page">
        <section className="dashboard-section">
          <h2 className="section-heading">Career Quiz Setup</h2>

          <label><b>Select Interest Area</b></label>
          <select
            className="form-select"
            value={selectedInterest}
            onChange={(e) => {
              setSelectedInterest(e.target.value);
              setSelectedSubjects([]);
            }}
          >
            <option value="">-- Select Interest --</option>
            {Object.keys(interestTopics).map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>

          {selectedInterest && (
            <>
              <br /><br />
              <label><b>Select Subjects You Like</b></label>
              <div className="topic-grid">
                {interestTopics[selectedInterest].map(subj => (
                  <label key={subj} className="topic-item">
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(subj)}
                      onChange={() =>
                        setSelectedSubjects(prev =>
                          prev.includes(subj)
                            ? prev.filter(s => s !== subj)
                            : [...prev, subj]
                        )
                      }
                    />
                    {subj}
                  </label>
                ))}
              </div>
            </>
          )}

          <br />

          <button
            className="cta-button"
            disabled={!selectedInterest || selectedSubjects.length === 0}
            onClick={() => setStage("quiz")}
          >
            Start Personality Test
          </button>
        </section>
      </main>
    );
  }

  /* ================= QUIZ ================= */
  if (stage === "quiz") {
    const question = questions[currentIndex];

    const handleAnswer = (type) => {
      setQuizAnswers(prev => [...prev, { type }]);

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1);
      }
    };

    const calculateResults = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/recommend`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            selectedInterest,
            selectedSubjects,
            quizAnswers
          })
        });

        const data = await response.json();
        setFinalResults(data.results || []);
        localStorage.setItem("careerResults", JSON.stringify(data.results || []));
        setStage("result");
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <main className="dashboard-page">
        <section className="dashboard-section quiz-card">

          <div className="quiz-progress">
            <div
              className="quiz-progress-fill"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className="quiz-question">{question.text}</div>

          <div className="quiz-options">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                className="quiz-option-btn"
                onClick={() => handleAnswer(opt.type)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="quiz-footer" style={{ display: "flex", gap: "1rem", justifyContent: "space-between", alignItems: "center" }}>
            <button
              className="nav-btn"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(i => Math.max(i - 1, 0))}
            >
              ⬅️ Previous
            </button>

            <button 
              onClick={calculateResults} 
              className={`cta-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? <><span className="spinner"></span> Analyzing...</> : "Get Result Now ✅"}
            </button>

            <button
              className="nav-btn"
              disabled={currentIndex >= questions.length - 1}
              onClick={() => setCurrentIndex(i => i + 1)}
            >
              Next ➡️
            </button>
          </div>

        </section>
      </main>
    );
  }

  /* ================= RESULT ================= */
  if (stage === "result") {
    return (
      <main className="dashboard-page">
        <section className="dashboard-section quiz-result-card">

          <h2 className="section-heading">🎯 Career Matches</h2>

          {finalResults.map((c, i) => (
            <div key={i} className={`result-item rank-${i + 1}`}>
              <h3>{i + 1}. {c.career_name}</h3>
              <p>Confidence: {Math.round(c.confidence * 100)}%</p>
              <p style={{ marginTop: "0.5rem" }}>🧠 {c.reason}</p>
            </div>
          ))}

          <div className="result-actions">
            <button className="cta-button" onClick={() => navigate("/dashboard")}>
              Go to Dashboard →
            </button>
          </div>

        </section>
      </main>
    );
  }
}

export default CareerQuizPage;
