import { useState } from "react";
import interestTopics from "../data/interests_topics";

function FreeResources() {
  const [interest, setInterest] = useState("");
  const [customInterest, setCustomInterest] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [aiSubjects, setAiSubjects] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubjectToggle = (subj) => {
    setSubjects((prev) =>
      prev.includes(subj)
        ? prev.filter((s) => s !== subj)
        : [...prev, subj]
    );
  };

  const fetchAIResources = async () => {
    setLoading(true);
    setError("");
    setAiSubjects([]);
    setResources([]);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/ai/resources`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          interest: interest === "OTHER" ? customInterest : interest,
          subjects
        })
      });

      if (!res.ok) {
        throw new Error("AI request failed");
      }

      const data = await res.json();
      setAiSubjects(data.subjects || []);
      setResources(data.resources || []);

    } catch (err) {
      console.error(err);
      setError("Failed to fetch AI resources. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-section">
        <h2 className="section-heading">Free Learning Resources (AI Powered)</h2>

        {/* INTEREST */}
        <label><b>Select Interest</b></label>
        <select
          value={interest}
          onChange={(e) => {
            setInterest(e.target.value);
            setSubjects([]);
            setAiSubjects([]);
            setResources([]);
          }}
        >
          <option value="">-- Select --</option>
          {Object.keys(interestTopics).map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
          <option value="OTHER">Other (AI Powered)</option>
        </select>

        {/* OTHER INTEREST */}
        {interest === "OTHER" && (
          <>
            <br /><br />
            <label><b>Enter Your Interest</b></label>
            <input
              type="text"
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              placeholder="e.g. Game Development, Blockchain"
            />
          </>
        )}

        {/* SUBJECTS (OPTIONAL) */}
        {interest && interest !== "OTHER" && (
          <>
            <br /><br />
            <label><b>Select Subjects (Optional)</b></label>
            <div className="topic-grid">
              {interestTopics[interest].map((subj) => (
                <label key={subj} className="topic-item">
                  <input
                    type="checkbox"
                    checked={subjects.includes(subj)}
                    onChange={() => handleSubjectToggle(subj)}
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
          disabled={
            loading ||
            !interest ||
            (interest === "OTHER" && !customInterest)
          }
          onClick={fetchAIResources}
        >
          {loading ? "AI is working..." : "Find Free Resources"}
        </button>

        {/* ERROR */}
        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

        {/* AI SUBJECTS */}
        {aiSubjects.length > 0 && (
          <>
            <hr />
            <h3 className="sub-heading">Recommended Subjects</h3>
            <ul>
              {aiSubjects.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </>
        )}

        {/* RESOURCES */}
        {resources.length > 0 && (
          <>
            <hr />
            <h3 className="sub-heading">Free Resources</h3>

            <div className="institution-grid">
              {resources.map((r, i) => (
                <div key={i} className="institution-card">
                  <h4>{r.title}</h4>
                  <p><b>Platform:</b> {r.platform}</p>
                  <a
                    href={r.link}
                    target="_blank"
                    rel="noreferrer"
                    className="learn-more-btn"
                  >
                    Open Resource →
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default FreeResources;
