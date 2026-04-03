export function rankCareers(
  careers,
  selectedInterest,
  selectedSubjects,
  riasecScores = {}
) {
  const totalRiasec = Object.values(riasecScores).reduce(
    (a, b) => a + b,
    0
  );

  return careers
    // 1️⃣ Interest filter
    .filter(c => c.Suitable_Interests === selectedInterest)

    // 2️⃣ Scoring
    .map(career => {
      const required = Array.isArray(career.required_subjects)
        ? career.required_subjects
        : [];

      // Subject score
      const matchedSubjects = required.filter(s =>
        selectedSubjects.includes(s)
      ).length;

      const subjectScore =
        required.length > 0
          ? (matchedSubjects / required.length) * 100
          : 0;

      // Personality score
      let personalityScore = 0;
      if (totalRiasec > 0) {
        const careerRiasecMatch = ["R", "I", "A", "S", "E", "C"]
          .filter(code => career[code] === 1)
          .reduce((sum, code) => sum + (riasecScores[code] || 0), 0);

        personalityScore = (careerRiasecMatch / totalRiasec) * 100;
      }

      // Interest score
      const interestScore = 100;

      // Final weighted score (same as Streamlit)
      const finalScore =
        (0.5 * personalityScore) +
        (0.3 * subjectScore) +
        (0.2 * interestScore);

      return {
        career_name: career.career_name,
        matchedSubjects,
        totalSubjects: required.length,
        personalityScore: Number(personalityScore.toFixed(1)),
        subjectScore: Number(subjectScore.toFixed(1)),
        interestScore,
        finalScore: Number(finalScore.toFixed(1))
      };
    })

    // 3️⃣ Remove useless matches
    .filter(c => c.finalScore > 0)

    // 4️⃣ Sort
    .sort((a, b) => b.finalScore - a.finalScore);
}
