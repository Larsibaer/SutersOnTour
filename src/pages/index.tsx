import React from "react"
import { graphql, PageProps, navigate, Link } from "gatsby"
import { useAuth } from "../hooks/useAuth"
import LoginMenu from "../components/loginMenu"
import PrivateRoute from "../components/privateRoute"
import "../styles/main.scss"

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
  const { role, loading } = useAuth()
  const now = new Date()

  if (loading) {
    return (
      <PrivateRoute>
        <main className="page">
          <LoginMenu />
          <h1 className="title">Suters On Tour: Doors</h1>
          <p>Loading user...</p>
        </main>
      </PrivateRoute>
    )
  }

  return (
    <PrivateRoute>
      <main className="page">
        <LoginMenu />
        <h1 className="title">Suters On Tour: Doors</h1>
        <div className="grid">
          {messages.map(({ fields, frontmatter }) => {
            const { slug } = fields
            const { title, week, date, opened } = frontmatter
            const unlockDate = new Date(date)
            const isEditor = role === "editor"
            const canOpen = isEditor && !opened && now >= unlockDate
            const visible = role === "admin" || opened || canOpen
            const cardClass = `"card" ${!visible ? "locked" : ""}`

            if (canOpen) {
              return (
                <div
                  key={slug}
                  className={cardClass}
                  onClick={async () => {
                    console.log(`Opening door for week ${week}`)
                    console.log(`Slug: ${slug}`)
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
                >
                  <h3>{title}</h3>
                </div>
              )
            }

            if (visible) {
              return (
                <Link key={slug} to={slug} className="link">
                  <div className={cardClass}>
                    <h3>{title}</h3>
                  </div>
                </Link>
              )
            }

            return (
              <div key={slug} className={cardClass}>
                <h3>{title}</h3>
                <p>🔒 Locked</p>
              </div>
            )
          })}
        </div>
      </main>
    </PrivateRoute>
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
