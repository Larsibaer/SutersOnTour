import netlifyIdentity from "netlify-identity-widget"

type UserRole = "admin" | "editor" | "viewer" | "anonymous"

let initialized = false

// ✅ Call this in gatsby-browser.ts or top-level layout
export function initIdentity() {
  if (!initialized) {
    netlifyIdentity.init()
    initialized = true
  }
}

// ✅ Returns logged-in user object or null
export function getUser() {
  return netlifyIdentity.currentUser()
}

// ✅ Returns the user's role or 'anonymous'
export function getUserRole(): UserRole {
  const user = getUser()
  const roles = user?.app_metadata?.roles || []
  return (roles[0] as UserRole) || "anonymous"
}

// ✅ Call to log out the user
export function logout() {
  netlifyIdentity.logout()
}

// ✅ Opens the Netlify Identity login UI
export function openLogin(callback?: () => void) {
  netlifyIdentity.open("login")
  if (callback) {
    netlifyIdentity.on("login", () => {
      callback()
      netlifyIdentity.close()
    })
  }
}
