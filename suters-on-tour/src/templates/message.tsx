import React from "react"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image"
import { getUserRole, isDoorOpen, openDoor } from "../utils/auth"

type MessageData = {
  markdownRemark: {
    html: string
    frontmatter: {
      title: string
      image?: string
      week: number
      date: string
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
  const { title, image: imageName, week, date } = frontmatter
  const role = getUserRole()
  const unlockDate = new Date(date)
  const now = new Date()

  const isOpen = isDoorOpen(week)

  if (role === "mnms" && !isOpen && now >= unlockDate) {
    openDoor(week)
  }

  if (role === "friend" && !isOpen) {
    return (
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <h1>⛔ This door hasn’t been opened yet!</h1>
        <p>Wait until the M&Ms unlock it 🎁</p>
      </main>
    )
  }

  const imageNode = data.allFile.nodes.find((node) =>
    node.relativePath.includes(imageName || "")
  )
  const image = imageNode?.childImageSharp
    ? getImage(imageNode.childImageSharp)
    : null

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
        image
      }
    }
    allFile(filter: { sourceInstanceName: { eq: "messages" } }) {
      nodes {
        relativePath
        childImageSharp {
          gatsbyImageData(width: 600)
        }
      }
    }
  }
`

export default MessageTemplate
