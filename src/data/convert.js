import fs from "fs";

const raw = JSON.parse(
  fs.readFileSync("courses.json", "utf-8")
);

const cleaned = raw.map(item => ({
  ...item,
  required_subjects: item.required_subjects
    .split(";")
    .map(s => s.trim())
}));

fs.writeFileSync(
  "courses_clean.json",
  JSON.stringify(cleaned, null, 2)
);

console.log("Done. courses_clean.json created successfully.");
