// import React from "react";
// import { graphql } from "gatsby";
// import LoginMenu from "../components/loginMenu";
// import PrivateRoute from "../components/privateRoute";
// import AdventCalendar from "../components/AdventCalendar";

// const IndexPage = ({ data }) => {
//   const messages = data.allMarkdownRemark.nodes;

//   return (
//     <PrivateRoute>
//       <main style={{ padding: "1rem", textAlign: "center" }}>
//         <LoginMenu />
//         <h1>Suters On Tour: Advent Calendar</h1>
//         <AdventCalendar messages={messages} />
//       </main>
//     </PrivateRoute>
//   );
// };

// export const query = graphql`
// {
//   allMarkdownRemark(
//   filter: { fileAbsolutePath: { regex: "/content/blog/" } }
//   sort: { fields: [frontmatter___week], order: ASC }
// ) {
//     nodes {
//       fields {
//         slug
//       }
//       frontmatter {
//         title
//         week
//         date
//         opened
//       }
//     }
//   }
// }
// `;

// export default IndexPage;
