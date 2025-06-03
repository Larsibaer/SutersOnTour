import React from "react"
import { graphql, PageProps, navigate, Link } from "gatsby"
import { useAuth } from "../hooks/useAuth"
import LoginMenu from "../components/loginMenu"
import PrivateRoute from "../components/privateRoute"

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
  const { user, role, loading } = useAuth()
  const now = new Date()

  if (loading) {
    return (
      <PrivateRoute>
        <main className="p-8 text-center">
          <LoginMenu />
          <h1 className="text-2xl font-bold mb-4">Suters On Tour: Doors</h1>
          <p>Loading user...</p>
        </main>
      </PrivateRoute>
    )
  }

  return (
    <PrivateRoute>
      <main className="p-8 min-h-screen bg-gray-50">
        <LoginMenu />
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Suters On Tour: Doors</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {messages.map(({ fields, frontmatter }) => {
            const { slug } = fields
            const { title, week, date, opened } = frontmatter
            const unlockDate = new Date(date)
            const isEditor = role === "editor"
            const canOpen = isEditor && !opened && now >= unlockDate
            const visible = role === "admin" || opened || canOpen

            const CardBase = ({ children }: { children: React.ReactNode }) => (
              <div
                className={`p-4 rounded-lg shadow transition ${
                  visible ? "bg-green-100 hover:bg-green-200 cursor-pointer" : "bg-gray-200 opacity-60"
                } text-center`}
              >
                {children}
              </div>
            )

            return (
              <CardBase key={slug}>
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
                  >
                    <h3 className="text-lg font-semibold text-blue-800 underline">{title}</h3>
                  </div>
                ) : visible ? (
                  <Link to={slug}>
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">{title}</h3>
                  </Link>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-500">{title}</h3>
                    <p className="text-sm text-gray-600">🔒 Locked</p>
                  </>
                )}
              </CardBase>
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
