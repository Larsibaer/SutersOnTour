import React, { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import netlifyIdentity from "netlify-identity-widget"

declare global {
  interface Window {
    netlifyIdentity?: typeof netlifyIdentity;
  }
}

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()
  const [bypass, setBypass] = useState(false)

useEffect(() => {
  const loadWidget = () => {
    netlifyIdentity.init()

    const hash = window?.location?.hash
    if (hash?.includes("invite_token")) {
      // Redirect invite_token to /admin
      window.location.replace(`/admin/${hash}`)
    } else if (
      hash?.includes("confirmation_token") ||
      hash?.includes("recovery_token")
    ) {
      netlifyIdentity.open()
      setBypass(true)
    }
  }

  if (window.netlifyIdentity) {
    loadWidget()
  } else {
    const script = document.createElement("script")
    script.src = "https://identity.netlify.com/v1/netlify-identity-widget.js"
    script.id = "netlify-identity-widget"
    script.async = true
    document.body.appendChild(script)
    script.onload = loadWidget
  }
}, [])


  if (loading) {
  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>⏳ Loading...</h1>
    </main>
  )
}

if (bypass) {
  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>🔑 Redirecting...</h1>
    </main>
  )
}


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
