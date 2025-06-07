import React from "react"
import { graphql } from "gatsby"
import { useAuth } from "../hooks/useAuth"
import PrivateRoute from "../components/privateRoute"
import AdventCalendar from "../components/AdventCalendar"
import Layout from "../components/Layout"

const AboutPage = ({ data }) => {
    return (
        <PrivateRoute>
            <Layout>
            <main style={{ padding: "2rem", textAlign: "center" }}>
                <h1>
                    ABOUT
                </h1>
            </main>
            </Layout>
        </PrivateRoute>
    )
}

export default AboutPage
