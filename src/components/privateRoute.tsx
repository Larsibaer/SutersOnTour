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
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
        <h1 className="text-2xl font-semibold">Loading...</h1>
      </main>
    )
  }

  if (bypass) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-blue-50 text-blue-800">
        <h1 className="text-xl font-semibold">Redirecting...</h1>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-800">
        <h1 className="text-2xl font-bold mb-2">Login Required</h1>
        <p className="mb-4 text-center max-w-md">
          You must be logged in to view this content. Please use your credentials to sign in.
        </p>
        <button
          onClick={() => netlifyIdentity.open("login")}
          className="px-5 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
        >
          Log In
        </button>
      </main>
    )
  }

  return <>{children}</>
}

export default PrivateRoute
