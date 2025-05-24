import React from "react"
import { navigate } from "gatsby"

export const wrapPageElement = ({ element, props }) => {
  if (typeof window !== "undefined") {
    const isLogin = props.location.pathname === "/login"
    const role = localStorage.getItem("role")

    if (!role && !isLogin) {
      console.log("Redirecting to /login from", props.location.pathname)
      navigate("/login")
      return null
    }

    if (isLogin) {
      console.log("Accessing /login page")
    }
  }

  return element
}
