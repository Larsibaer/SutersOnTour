import React, { useEffect, useState } from "react"
import netlifyIdentity from "netlify-identity-widget"
import { getUser, getUserRole, logout } from "../src/utils/auth.ts"

const LoginMenu: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [role, setRole] = useState("anonymous")

  useEffect(() => {
    netlifyIdentity.init()
    const user = getUser()
    if (user) {
      setUserEmail(user.email)
      setRole(getUserRole())
    }

    netlifyIdentity.on("login", () => {
      window.location.reload()
    })

    netlifyIdentity.on("logout", () => {
      setUserEmail(null)
      setRole("anonymous")
    })

    return () => {
      netlifyIdentity.off("login")
      netlifyIdentity.off("logout")
    }
  }, [])

  if (!userEmail) {
    return (
      <button
        onClick={() => netlifyIdentity.open("login")}
        style={{ position: "fixed", top: 10, right: 10 }}
      >
        Login
      </button>
    )
  }

  return (
    <div style={{ position: "fixed", top: 10, right: 10, textAlign: "right" }}>
      <div style={{ fontSize: "0.8rem" }}>👤 {userEmail} ({role})</div>
      <button onClick={logout} style={{ marginTop: "4px" }}>
        Logout
      </button>
    </div>
  )
}

export default LoginMenu
