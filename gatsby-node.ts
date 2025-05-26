import { GatsbyNode } from "gatsby"
import path from "path"
import slugify from "slugify"

export const onCreateNode: GatsbyNode["onCreateNode"] = ({ node, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === "MarkdownRemark") {
    const frontmatter = node.frontmatter as { title?: string }
    const slug = slugify(frontmatter?.title || "", { lower: true })
    createNodeField({
      node,
      name: "slug",
      value: `/week/${slug}`,
    })
  }
}

export const createPages: GatsbyNode["createPages"] = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    {
      allMarkdownRemark {
        nodes {
          fields {
            slug
          }
        }
      }
    }
  `)

  const typedResult = result as {
    data: {
      allMarkdownRemark: {
        nodes: { fields: { slug: string } }[]
      }
    }
  }

  typedResult.data.allMarkdownRemark.nodes.forEach((node) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/message.tsx`),
      context: {
        slug: node.fields.slug,
      },
    })
  })
}
