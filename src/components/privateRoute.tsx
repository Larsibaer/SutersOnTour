import React, { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import netlifyIdentity from "netlify-identity-widget"

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()
  const [bypass, setBypass] = useState(false)

  useEffect(() => {
    netlifyIdentity.init()

    // 👇 Check if we're on an invite or recovery flow
    const hash = window?.location?.hash
    if (
      hash?.includes("recovery_token") ||
      hash?.includes("confirmation_token") ||
      hash?.includes("invite_token")
    ) {
      netlifyIdentity.open() // Show widget for password setting
      setBypass(true)
    }
  }, [])

  if (loading || bypass) return null

  if (!user) {
    return (
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <h1>🔐 Login Required</h1>
        <p>You must be logged in to view this content.</p>
        <button onClick={() => netlifyIdentity.open("login")}>Log In</button>
      </main>
    )
  }

  return <>{children}</>
}

export default PrivateRoute
