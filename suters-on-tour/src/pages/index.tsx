import React from "react"
import { graphql, PageProps, Link } from "gatsby"
import { getUserRole, isDoorOpen } from "../utils/auth"

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
      <h1>Suters On Tour: Doors</h1>
      <button
  onClick={() => {
    localStorage.removeItem("role")
    localStorage.removeItem("openedDoors")
    window.location.href = "/login"
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
          const { title, week, date } = frontmatter
          const unlockDate = new Date(date)
          const canOpen = now >= unlockDate
          const isUnlocked = frontmatter.opened
          const canBeUnlocked = role === "mnms" && now >= unlockDate

          const visible = isUnlocked || canBeUnlocked



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
              {visible ? (
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
          opened # ✅ add this
        }
      }
    }
  }
`


export default IndexPage
