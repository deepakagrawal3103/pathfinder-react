import { useState } from "react";
import interestTopics from "../data/interests_topics";
import coursesData from "../data/courses.json";

function Courses() {
  const [selectedInterest, setSelectedInterest] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [rankedCareers, setRankedCareers] = useState([]);

  const handleTopicChange = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  const getRecommendations = () => {
    const ranked = coursesData
      .filter(
        (c) => c.Suitable_Interests === selectedInterest
      )
      .map((c) => {
        const matchedSubjects = c.required_subjects.filter((s) =>
          selectedTopics.includes(s)
        );

        return {
          career_name: c.career_name,
          matchedCount: matchedSubjects.length,
          totalRequired: c.required_subjects.length,
          score: Math.round(
            (matchedSubjects.length / c.required_subjects.length) * 100
          ),
        };
      })
      .filter((c) => c.matchedCount > 0)
      .sort((a, b) => b.score - a.score);

    setRankedCareers(ranked);
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-section">
        <h2 className="section-heading">Course & Subject Explorer</h2>

        {/* STEP 1: INTEREST */}
        <label><b>Select Your Interest Area</b></label>
        <select
          value={selectedInterest}
          onChange={(e) => {
            setSelectedInterest(e.target.value);
            setSelectedTopics([]);
            setRankedCareers([]);
          }}
          style={{ padding: "0.6rem", marginTop: "0.5rem" }}
        >
          <option value="">-- Choose Interest Area --</option>
          {Object.keys(interestTopics).map((interest) => (
            <option key={interest} value={interest}>
              {interest}
            </option>
          ))}
        </select>

        {/* STEP 2: SUBJECTS */}
        {selectedInterest && (
          <>
            <hr />
            <h3 className="sub-heading">Select Subjects You Like</h3>

            <div className="topic-grid">
              {interestTopics[selectedInterest].map((topic) => (
                <label key={topic} className="topic-item">
                  <input
                    type="checkbox"
                    checked={selectedTopics.includes(topic)}
                    onChange={() => handleTopicChange(topic)}
                  />
                  {topic}
                </label>
              ))}
            </div>

            <button
              className="cta-button"
              style={{ marginTop: "1.2rem" }}
              disabled={selectedTopics.length === 0}
              onClick={getRecommendations}
            >
              Get Recommendations
            </button>
          </>
        )}

        {/* STEP 3: RESULTS (LOCAL ONLY) */}
        {rankedCareers.length > 0 && (
          <>
            <hr />
            <h3 className="sub-heading">Suggested Career Options</h3>

            <ul>
              {rankedCareers.map((career, index) => (
                <li key={career.career_name}>
                  <b>{index + 1}. {career.career_name}</b>
                  <span style={{ color: "#6b7280", marginLeft: "0.5rem" }}>
                    ({career.matchedCount}/{career.totalRequired} subjects · {career.score}% match)
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  );
}

export default Courses;
