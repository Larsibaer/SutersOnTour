import { Handler } from "@netlify/functions"
import { Octokit } from "octokit"

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" }
  }

  const { week } = JSON.parse(event.body || "{}")
  if (!week) return { statusCode: 400, body: "Missing week" }

  const owner = "Larsibaer"
  const repo = "SutersOnTour"
  const filePath = `content/messages/week-${String(week).padStart(2, "0")}.md`

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

  const { data: file } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: filePath,
  })

  if (Array.isArray(file) || !('content' in file) || typeof file.content !== "string") {
    return { statusCode: 404, body: "File not found or invalid file type" }
  }

  const content = Buffer.from(file.content, "base64").toString("utf-8")
  if (/opened:\s*true/.test(content)) {
    return { statusCode: 200, body: "Already open" }
  }

  const updated = content.replace(/opened:\s*false/, "opened: true")

  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message: `🔓 Opened door for week ${week}`,
    content: Buffer.from(updated).toString("base64"),
    sha: file.sha,
    committer: { name: "Door Bot", email: "bot@example.com" },
    author: { name: "Door Bot", email: "bot@example.com" },
  })

  return { statusCode: 200, body: "Door opened" }
}

export { handler }
