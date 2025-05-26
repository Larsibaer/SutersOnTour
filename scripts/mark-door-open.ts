const fs = require("fs")
const path = require("path")
const matter = require("gray-matter")

const WEEK = parseInt(process.argv[2], 10)

if (!WEEK) {
  console.error("Usage: npm run open-door <week-number>")
  process.exit(1)
}

const dir = path.join(__dirname, "../content/messages")
const files = fs.readdirSync(dir)

for (const file of files) {
  if (!file.endsWith(".md")) continue

  const fullPath = path.join(dir, file)
  const content = fs.readFileSync(fullPath, "utf8")
  const parsed = matter(content)

  if (parsed.data.week === WEEK) {
    parsed.data.opened = true
    const updated = matter.stringify(parsed.content, parsed.data)
    fs.writeFileSync(fullPath, updated)
    console.log(`✅ Opened week ${WEEK}: ${file}`)
  }
}
