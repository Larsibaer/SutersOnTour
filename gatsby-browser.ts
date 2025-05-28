import { navigate } from "gatsby"
import netlifyIdentity from "netlify-identity-widget"

// export const wrapPageElement = ({ element, props }) => {
//   if (typeof window !== "undefined") {
//     const isLogin = props.location.pathname === "/login"
//     const hash = window.location.hash

//     const isRecovery = hash && hash.includes("recovery_token")

//     if (!netlifyIdentity.currentUser() && !isLogin && !isRecovery) {
//       navigate("/login")
//     }
//   }

//   return element
// }
