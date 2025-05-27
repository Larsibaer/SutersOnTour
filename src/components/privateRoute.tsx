import React from "react"
import { useAuth } from "../hooks/useAuth"
import netlifyIdentity from "netlify-identity-widget"

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return null

  if (!user) {
    return (
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <h1>🔐 Login Required</h1>
        <p>You must be logged in to view this content.</p>
        <button onClick={() => netlifyIdentity.open("login")}>
          Log In
        </button>
      </main>
    )
  }

  return <>{children}</>
}

export default PrivateRoute
