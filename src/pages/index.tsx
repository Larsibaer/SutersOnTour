import React from "react"
import { graphql, PageProps, navigate } from "gatsby"
import { getUserRole, logout } from "../utils/auth"
import { Link } from "gatsby"
import LoginMenu from "../../components/loginMenu"

type Message = {
  fields: { slug: string }
  frontmatter: {
    title: string
    week: number
    date: string
    opened: boolean
  }
}

type IndexProps = PageProps<{
  allMarkdownRemark: {
    nodes: Message[]
  }
}>

const IndexPage: React.FC<IndexProps> = ({ data }) => {
  const messages = data.allMarkdownRemark.nodes
  const role = getUserRole()
  const now = new Date()

  return (
    <main style={{ padding: "2rem" }}>
      <LoginMenu />
      <h1>Suters On Tour: Doors</h1>

      <button
        onClick={() => {
          logout()
          window.location.reload()
        }}
        style={{ position: "fixed", top: 10, right: 10 }}
      >
        Logout
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "1rem",
        }}
      >
        {messages.map(({ fields, frontmatter }) => {
          const { slug } = fields
          const { title, week, date, opened } = frontmatter
          const unlockDate = new Date(date)
          const isEditor = role === "editor"
          const canOpen = isEditor && !opened && now >= unlockDate
          const visible = opened || canOpen || role === "admin"

          return (
            <div
              key={slug}
              style={{
                padding: "1rem",
                background: visible ? "#e0ffe0" : "#ddd",
                textAlign: "center",
                borderRadius: "8px",
                opacity: visible ? 1 : 0.5,
              }}
            >
              {canOpen ? (
                <div
                  onClick={async () => {
                    try {
                      await fetch("/.netlify/functions/openDoor", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ week }),
                      })
                      navigate(slug)
                    } catch {
                      alert("❌ Failed to open door")
                    }
                  }}
                  style={{
                    cursor: "pointer",
                    textDecoration: "underline",
                    color: "blue",
                  }}
                >
                  <h3>{title}</h3>
                </div>
              ) : visible ? (
                <Link to={slug} style={{ textDecoration: "none" }}>
                  <h3>{title}</h3>
                </Link>
              ) : (
                <>
                  <h3>{title}</h3>
                  <p>🔒 Locked</p>
                </>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}

export const query = graphql`
  {
    allMarkdownRemark(sort: { frontmatter: { week: ASC } }) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          week
          date
          opened
        }
      }
    }
  }
`

export default IndexPage
