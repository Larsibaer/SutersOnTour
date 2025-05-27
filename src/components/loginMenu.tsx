import React from "react"
import netlifyIdentity from "netlify-identity-widget"
import { useAuth } from "../hooks/useAuth"

const LoginMenu: React.FC = () => {
  const { user, role, loading } = useAuth()

  if (loading) return null

  if (!user) {
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
      <div style={{ fontSize: "0.8rem" }}>
        👤 {user.email} ({role})
      </div>
      <button
        onClick={() => {
          netlifyIdentity.logout()
        }}
        style={{ marginTop: "4px" }}
      >
        Logout
      </button>
    </div>
  )
}

export default LoginMenu
