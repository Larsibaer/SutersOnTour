import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentDir = path.join(__dirname, "../content/messages");
if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true });

const startDate = new Date("2025-12-01");

for (let i = 1; i <= 30; i++) {
  const week = i;
  const slug = `week-${String(week).padStart(2, "0")}`;
  const filePath = path.join(contentDir, `${slug}.md`);
  const date = new Date(startDate);
  date.setDate(startDate.getDate() + (i - 1));

  const frontmatter = `---
title: "Türchen ${week}"
week: ${week}
date: "${date.toISOString()}"
opened: false
image: /img/placeholder.jpg
---

Schreibe deinen Text für die Woche Nummer: ${week} hier.
`;

  fs.writeFileSync(filePath, frontmatter);
}

console.log("✅ All door markdown files generated!");
