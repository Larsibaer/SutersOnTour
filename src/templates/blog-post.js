import React, { useEffect, useState } from "react";
import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Layout from "../components/Layout";
import PrivateRoute from "../components/privateRoute";

const MessageTemplate = ({ data }) => {
  const { html, frontmatter } = data.markdownRemark;
  const { title, image, week, date, opened } = frontmatter;

  const [role, setRole] = useState("viewer"); // Replace with real auth logic if needed
  const [loading, setLoading] = useState(false); // Replace with real auth logic
  const [isOpen, setIsOpen] = useState(opened ?? false);

  const now = new Date();
  const unlockDate = new Date(date);

  useEffect(() => {
    if (!opened && role === "editor" && now >= unlockDate) {
      fetch("/.netlify/functions/openDoor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ week }),
      })
        .then((res) => {
          if (res.ok) setIsOpen(true);
        })
        .catch(() => console.error("Failed to open door"));
    } else if (opened) {
      setIsOpen(true);
    }
  }, [role, opened, week, unlockDate, now]);

  if (loading) {
    return (
      <PrivateRoute>
        <main className="main text-center">
          <h1 className="title">⏳ Loading...</h1>
        </main>
      </PrivateRoute>
    );
  }

  if (role === "viewer" && !isOpen) {
    return (
      <PrivateRoute>
        <Layout>
          <main className="main text-center">
            <h1 className="title">🔒 This door hasn’t been opened yet!</h1>
            <p className="text-muted">
              Only M&Ms can open it after <strong>{date}</strong>.
            </p>
          </main>
        </Layout>
      </PrivateRoute>
    );
  }

  const imageData = image

  return (
    <PrivateRoute>
      <Layout>
        <main className="main card single-message">
          <h1 className="title">{title}</h1>
          {image && (
            <div className="message-image">
              <img src={image} alt={title} />
            </div>
          )}
          <div
            className="prose message-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </main>
      </Layout>
    </PrivateRoute>
  );
};

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date
        title
        week
        date
        opened
        image
      }
    }
  }
`;

export default MessageTemplate;
