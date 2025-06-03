import React, { useEffect, useState } from "react"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image"
import { useAuth } from "../hooks/useAuth"
import LoginMenu from "../components/loginMenu"
import PrivateRoute from "../components/privateRoute"
import "../styles/main.scss"

type MessageData = {
  markdownRemark: {
    html: string
    frontmatter: {
      title: string
      image?: {
        childImageSharp?: {
          gatsbyImageData: IGatsbyImageData
        }
      }
      week: number
      date: string
      opened?: boolean
    }
  }
}

const MessageTemplate: React.FC<PageProps<MessageData>> = ({ data }) => {
  const { html, frontmatter } = data.markdownRemark
  const { title, image, week, date, opened } = frontmatter

  const { role, loading } = useAuth()
  const [isOpen, setIsOpen] = useState(opened ?? false)

  const now = new Date()
  const unlockDate = new Date(date)

  useEffect(() => {
    if (!opened && role === "editor" && now >= unlockDate) {
      fetch("/.netlify/functions/openDoor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ week }),
      })
        .then((res) => {
          if (res.ok) setIsOpen(true)
        })
        .catch(() => console.error("Failed to open door"))
    } else if (opened) {
      setIsOpen(true)
    }
  }, [role, opened, week, unlockDate, now])

  if (loading) {
    return (
      <PrivateRoute>
        <main className="main text-center">
          <h1 className="title">⏳ Loading...</h1>
        </main>
      </PrivateRoute>
    )
  }

  if (role === "viewer" && !isOpen) {
    return (
      <PrivateRoute>
        <main className="main text-center">
          <h1 className="title">🔒 This door hasn’t been opened yet!</h1>
          <p className="text-muted">Only M&Ms can open it after <strong>{date}</strong>.</p>
        </main>
      </PrivateRoute>
    )
  }

  const imageData = image?.childImageSharp?.gatsbyImageData
  const gatsbyImage = imageData ? getImage(imageData) : null

  return (
    <PrivateRoute>
      <main className="main card single-message">
        <LoginMenu />
        <h1 className="title">{title}</h1>
        {gatsbyImage && (
          <div className="message-image">
            <GatsbyImage image={gatsbyImage} alt={title} className="rounded" />
          </div>
        )}
        <div
          className="prose message-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>
    </PrivateRoute>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        week
        date
        opened
        image {
          childImageSharp {
            gatsbyImageData(width: 600)
          }
        }
      }
    }
  }
`

export default MessageTemplate
