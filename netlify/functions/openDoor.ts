import { Handler } from "@netlify/functions"
import { Octokit } from "octokit"

const handler: Handler = async (event, context) => {
  // ✅ Require Netlify Identity login
  const user = context.clientContext?.user

  if (!user) {
    return { statusCode: 401, body: "Not logged in" }
  }

  // ✅ Check if user has editor or admin role
  const roles = user.app_metadata?.roles || []
  const allowed = roles.includes("editor") || roles.includes("admin")

  if (!allowed) {
    return { statusCode: 403, body: "Forbidden: Not an editor" }
  }

  const { week } = JSON.parse(event.body || "{}")
  if (!week) return { statusCode: 400, body: "Missing week" }

  const owner = "Larsibaer"
  const repo = "SutersOnTour"
  const filePath = `content/messages/week-${String(week).padStart(2, "0")}.md`

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

  try {
    const { data: file } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: filePath,
    })

    if (
      Array.isArray(file) ||
      file.type !== "file" ||
      typeof file.content !== "string"
    ) {
      return { statusCode: 404, body: "File not found or is a directory" }
    }
    const content = Buffer.from(file.content, "base64").toString("utf-8")
    const updated = content.replace(/opened:\s?false/, "opened: true")

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
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: "Failed to open door" }
  }
}

export { handler }
