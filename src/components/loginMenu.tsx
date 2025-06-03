import React from "react"
import netlifyIdentity from "netlify-identity-widget"
import { useAuth } from "../hooks/useAuth"

const LoginMenu: React.FC = () => {
  const { user, loading } = useAuth()

  if (loading) return null

  if (!user) {
    return (
      <button
        onClick={() => netlifyIdentity.open("login")}
        className="fixed top-4 right-4 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
      >
        Login
      </button>
    )
  }

  return (
    <div className="fixed top-4 right-4 text-right bg-white shadow-md p-3 rounded border border-gray-200">
      <div className="text-sm text-gray-700 mb-1">
        👤 <span className="font-medium">{user.email}</span>
      </div>
      <button
        onClick={() => netlifyIdentity.logout()}
        className="mt-1 text-sm text-red-600 hover:underline"
      >
        Logout
      </button>
    </div>
  )
}

export default LoginMenu
