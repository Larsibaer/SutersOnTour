import React from "react"
import { graphql } from "gatsby"
import { useAuth } from "../hooks/useAuth"
import PrivateRoute from "../components/privateRoute"
import AdventCalendar from "../components/AdventCalendar"
import Layout from "../components/Layout"

const IndexPage = ({ data }) => {
    const { role, loading } = useAuth()
    const messages = data.allMarkdownRemark.nodes

    // if (loading) return null

    return (
        <PrivateRoute>
            <Layout>
            <main style={{ padding: "2rem", textAlign: "center" }}>
                <h1>
                    Suters On Tour: Advent Calendar
                </h1>
                <AdventCalendar role={role} messages={messages} />
            </main>
            </Layout>
        </PrivateRoute>
    )
}

export const query = graphql`
    {
        allMarkdownRemark(
  filter: { fileAbsolutePath: { regex: "/content/blog/" } }
  sort: { fields: [frontmatter___week], order: ASC }
) {
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
