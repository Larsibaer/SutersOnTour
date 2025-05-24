import React, { useEffect, useState } from "react"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image"
import { getUserRole, isDoorOpen, openDoor } from "../utils/auth"

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
  allFile: {
    nodes: {
      relativePath: string
      childImageSharp?: {
        gatsbyImageData: IGatsbyImageData
      }
    }[]
  }
}

const MessageTemplate: React.FC<PageProps<MessageData>> = ({ data }) => {
  const { html, frontmatter } = data.markdownRemark
  const { title, image: imageName, week, date, opened } = frontmatter
  const role = getUserRole()
  const now = new Date()
  const unlockDate = new Date(date)

  const isOpen = frontmatter.opened || (role === "mnms" && now >= unlockDate)


  useEffect(() => {
    if (role === "mnms" && !isOpen && now >= unlockDate) {
      openDoor(week)
    }
  }, [role, isOpen, unlockDate, now, week])

  if (role === "friend" && !isOpen) {
    return (
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <h1>🔒 This door hasn’t been opened yet!</h1>
        <p>Only M&Ms can open it after {date}</p>
      </main>
    )
  }

const imageData = frontmatter.image?.childImageSharp?.gatsbyImageData
const image = imageData ? getImage(imageData) : null

{image && <GatsbyImage image={image} alt={title} />}


  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h1>{title}</h1>
      {image && <GatsbyImage image={image} alt={title} />}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
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
