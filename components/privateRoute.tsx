import React, { useEffect, useState } from "react"
import { getUser } from "../src/utils/auth.ts"
import netlifyIdentity from "netlify-identity-widget"

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    netlifyIdentity.init()
    const user = getUser()
    if (user) setIsAuthenticated(true)
    setChecked(true)
  }, [])

  if (!checked) return null

  if (!isAuthenticated) {
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
