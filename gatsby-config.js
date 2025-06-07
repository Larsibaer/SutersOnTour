module.exports = {
  siteMetadata: {
    title: "Advent Calendar Blog",
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: "gatsby-plugin-sass",
      options: {
        sassOptions: {
          indentedSyntax: true,
        },
      },
    },
    {
    resolve: `gatsby-plugin-purgecss`,
    options: {
      develop: false, // Disable purge in dev
      printRejected: false,
      tailwind: false,
    },
  },
    `gatsby-transformer-remark`,
    'gatsby-plugin-netlify-cms',
  ],
};
