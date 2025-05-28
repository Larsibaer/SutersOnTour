import { useEffect, useState } from "react"
import netlifyIdentity from "netlify-identity-widget"
import { navigate } from "gatsby"

type UserRole = "admin" | "editor" | "viewer" | "anonymous"

export const useAuth = () => {
  const [user, setUser] = useState<netlifyIdentity.User | null>(null)
  const [role, setRole] = useState<UserRole>("anonymous")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    netlifyIdentity.init()

    const current = netlifyIdentity.currentUser()
    if (current) {
      setUser(current)
      setRole((current.app_metadata?.roles?.[0] as UserRole) || "anonymous")
      setLoading(false)
    }

    netlifyIdentity.on("init", (user) => {
      setUser(user)
      setRole((user?.app_metadata?.roles?.[0] as UserRole) || "anonymous")
      setLoading(false)
    })

    netlifyIdentity.on("login", (user) => {
      setUser(user)
      setRole((user?.app_metadata?.roles?.[0] as UserRole) || "anonymous")
      setLoading(false)
      navigate("/")
    })

    netlifyIdentity.on("signup", () => {
      navigate("/")
    })

    netlifyIdentity.on("logout", () => {
      setUser(null)
      setRole("anonymous")
      setLoading(false)
    })

    return () => {
      netlifyIdentity.off("init")
      netlifyIdentity.off("login")
      netlifyIdentity.off("signup")
      netlifyIdentity.off("logout")
    }
  }, [])

  return { user, role, loading }
}
