import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// RUN CODE WITH: npm run generate:doors

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentDir = path.join(__dirname, "../content/blog");
if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true });

const startDate = new Date("2025-07-14");

// Helper function to get ISO week number
function getWeekNumber(date) {
  const tempDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = tempDate.getUTCDay() || 7;
  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil((((tempDate - yearStart) / 86400000) + 1) / 7);
  return weekNum;
}

for (let i = 1; i <= 24; i++) {
  const week = i;
  const slug = `week-${String(week).padStart(2, "0")}`;
  const filePath = path.join(contentDir, `${slug}.md`);
  const date = new Date(startDate);
  date.setDate(startDate.getDate() + (i - 1) * 7);
  const weekNumber = getWeekNumber(date);

  const frontmatter = `---
title: "KW: ${weekNumber} - Türchen ${i}"
week: ${week}
date: "${date.toISOString()}"
opened: false
slug: kw-${weekNumber}
image: /images/placeholder.png
---

Schreibe deinen Text für die Kalenderwoche: ${weekNumber} hier.
`;

  fs.writeFileSync(filePath, frontmatter);
}

console.log("✅ All door markdown files generated!");
