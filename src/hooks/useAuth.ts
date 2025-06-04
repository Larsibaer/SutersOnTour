import { useEffect, useState } from "react"
import netlifyIdentity from "netlify-identity-widget"
import { navigate } from "gatsby"

type UserRole = "admin" | "editor" | "viewer" | "anonymous"

export const useAuth = () => {
  const [user, setUser] = useState<netlifyIdentity.User | null>(null)
  const [role, setRole] = useState<UserRole>("anonymous")
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    netlifyIdentity.init()

    const current = netlifyIdentity.currentUser()
    if (current) {
      setUser(current)
      setRole((current.app_metadata?.roles?.[0] as UserRole) || "anonymous")
      setToken(current.token?.access_token || null)
      setLoading(false)
    }

    netlifyIdentity.on("init", (user) => {
      setUser(user)
      setRole((user?.app_metadata?.roles?.[0] as UserRole) || "anonymous")
      setToken(user?.token?.access_token || null)
      setLoading(false)
    })

    netlifyIdentity.on("login", (user) => {
      setUser(user)
      setRole((user?.app_metadata?.roles?.[0] as UserRole) || "anonymous")
      setToken(user?.token?.access_token || null)
      setLoading(false)
      netlifyIdentity.close()
      navigate("/")
    })

    netlifyIdentity.on("logout", () => {
      setUser(null)
      setRole("anonymous")
      setToken(null)
      setLoading(false)
    })

    return () => {
      netlifyIdentity.off("init")
      netlifyIdentity.off("login")
      netlifyIdentity.off("logout")
    }
  }, [])

  return { user, role, token, loading }
}
