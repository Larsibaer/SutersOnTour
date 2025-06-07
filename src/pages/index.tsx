import React from "react"
import { graphql, PageProps, navigate } from "gatsby"
import { useAuth } from "../hooks/useAuth"
import LoginMenu from "../components/loginMenu"
import PrivateRoute from "../components/privateRoute"
import AdventCalendar from "../components/AdventCalendar"

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
  const { role, loading } = useAuth()
  const messages = data.allMarkdownRemark.nodes

  // if (loading) return null

  return (
    <PrivateRoute>
      <main style={{ padding: "1rem", textAlign: "center" }}>
        <LoginMenu />
        <h1>Suters On Tour: Advent Calendar</h1>
        <AdventCalendar role={role} messages={messages} />
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