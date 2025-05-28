import { useEffect, useState } from "react"
import netlifyIdentity from "netlify-identity-widget"
import { navigate } from "gatsby"

export function useAuth() {
  const [user, setUser] = useState<netlifyIdentity.User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    netlifyIdentity.init()

    const current = netlifyIdentity.currentUser()
    if (current) setUser(current)
    setLoading(false)

    const onLogin = (user: netlifyIdentity.User) => {
      setUser(user)
      setLoading(false)
      navigate("/") 
    }

    const onLogout = () => {
      setUser(null)
      setLoading(false)
    }

    netlifyIdentity.on("login", onLogin)
    netlifyIdentity.on("logout", onLogout)

    return () => {
      netlifyIdentity.off("login", onLogin)
      netlifyIdentity.off("logout", onLogout)
    }
  }, [])

  return { user, loading }
}
