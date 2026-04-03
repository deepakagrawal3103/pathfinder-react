import { useEffect, useState } from "react";
import institutes from "../data/institutes.json";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [careerResults, setCareerResults] = useState([]);
  const [matchedInstitutes, setMatchedInstitutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /* =====================
       LOAD USER FROM BACKEND (JWT)
    ====================== */
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (!data.error) setUser(data);
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }

    /* =====================
       LOAD CAREER RESULTS
    ====================== */
    const storedResults = localStorage.getItem("careerResults");
    if (!storedResults) return;

    let parsed;
    try {
      parsed = JSON.parse(storedResults);
    } catch {
      return;
    }

    if (!Array.isArray(parsed) || parsed.length === 0) return;
    setCareerResults(parsed);

    /* =====================
       MATCH INSTITUTES
    ====================== */
    const topCareer = parsed[0]?.career_name;
    if (!topCareer || !Array.isArray(institutes)) return;

    const filteredInstitutes = institutes.filter((inst) => {
      const fields = inst["Primary Fields"];
      if (!fields) return false;

      if (Array.isArray(fields)) {
        return fields.some(field =>
          topCareer.toLowerCase().includes(field.toLowerCase())
        );
      }

      return topCareer.toLowerCase().includes(
        String(fields).toLowerCase()
      );
    });

    setMatchedInstitutes(filteredInstitutes);
  }, []);

  return (
    <main className="dashboard-page">

      {/* ================= USER PROFILE ================= */}
      <section className="dashboard-section">
        <h2 className="section-heading">User Profile</h2>

        {isLoading ? (
          <div className="skeleton skeleton-profile"></div>
        ) : user ? (
          <div className="profile-card professional with-avatar">
            <div className="profile-avatar">
              {user.name?.charAt(0)}
            </div>

            <div className="profile-details">
              <div className="profile-item">
                <span className="label">Name</span>
                <span className="value">{user.name}</span>
              </div>

              <div className="profile-item">
                <span className="label">Email</span>
                <span className="value">{user.email}</span>
              </div>

              <div className="profile-item">
                <span className="label">Education</span>
                <span className="value">{user.education || "—"}</span>
              </div>

              <div className="profile-item">
                <span className="label">Location</span>
                <span className="value">{user.location || "—"}</span>
              </div>
            </div>
          </div>
        ) : (
          <p>Please login to see your profile.</p>
        )}
      </section>

      {/* ================= CAREER RECOMMENDATIONS ================= */}
      <section className="dashboard-section">
        <h2 className="section-heading">Career Recommendations</h2>

        {careerResults.length === 0 ? (
          <p>No recommendations yet. Please take the career quiz.</p>
        ) : (
          careerResults.map((career, index) => (
            <div key={career.career_name} className={`result-item rank-${index + 1}`}>
              <h3>
                {index + 1}. {career.career_name}
              </h3>

              {/* SCORE */}
              {typeof career.score === "number" && (
                <p>
                  🎯 <b>Match Score:</b>{" "}
                  {Math.round(career.score * 100)}%
                </p>
              )}

              {/* SUBJECT MATCH */}
              {Array.isArray(career.matchedSubjects) && (
                <p>
                  📘 <b>Matched Subjects:</b>{" "}
                  {career.matchedSubjects.join(", ")}
                </p>
              )}

              {/* EXPLANATION (WINNING FEATURE) */}
              {career.explanation && (
                <ul style={{ marginTop: "0.5rem" }}>
                  <li>🧠 {career.explanation.personality}</li>
                  <li>📘 {career.explanation.subjects}</li>
                  <li>🎯 {career.explanation.interest}</li>
                </ul>
              )}
            </div>
          ))
        )}
      </section>

      {/* ================= INSTITUTIONS ================= */}
      {matchedInstitutes.length > 0 && (
        <section className="dashboard-section">
          <h3 className="sub-heading">
            Recommended Institutions for{" "}
            <b>{careerResults[0]?.career_name}</b>
          </h3>

          <div className="institution-grid">
            {matchedInstitutes.slice(0, 5).map((inst, idx) => (
              <div className="institution-card" key={idx}>
                <h4>{inst.Institution || inst.name}</h4>

                <p>
                  <b>Location:</b>{" "}
                  {inst.City || inst.location},{" "}
                  {inst.State || ""}
                </p>

                <p>
                  <b>Primary Fields:</b>{" "}
                  {Array.isArray(inst["Primary Fields"])
                    ? inst["Primary Fields"].join(", ")
                    : inst["Primary Fields"] || "N/A"}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

    </main>
  );
}

export default Dashboard;
