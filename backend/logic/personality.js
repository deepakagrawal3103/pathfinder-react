// Converts quiz answers into RIASEC scores

const optionMap = {
  A: "R",
  B: "I",
  C: "A",
  D: "S",
  E: "E",
  F: "C"
};

export function calculateRiasecScores(quizAnswers = []) {
  const scores = {
    R: 0,
    I: 0,
    A: 0,
    S: 0,
    E: 0,
    C: 0
  };

  quizAnswers.forEach((answer) => {
    // Handle both string ("A") and object ({ type: "A" }) formats
    const type = typeof answer === "object" ? answer.type : answer;
    const code = optionMap[type];
    if (code) scores[code]++;
  });

  return scores;
}
