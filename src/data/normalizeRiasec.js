export function normalizeRiasec(rawQuestions) {
  return rawQuestions.map((q, index) => ({
    id: index + 1,
    text: q.Question,
    options: [
      { label: q.Option_A, type: "R" },
      { label: q.Option_B, type: "I" },
      { label: q.Option_C, type: "A" },
      { label: q.Option_D, type: "S" },
      { label: q.Option_E, type: "E" },
      { label: q.Option_F, type: "C" }
    ]
  }));
}
