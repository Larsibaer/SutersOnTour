import React from "react"
import { navigate } from "gatsby"

import { WrapPageElementBrowserArgs } from "gatsby"

import { initIdentity } from "./src/utils/auth"

export const onInitialClientRender = () => {
  initIdentity()
}


export const wrapPageElement = ({ element, props }: WrapPageElementBrowserArgs) => {
  if (typeof window !== "undefined") {
    const isLogin = props.location.pathname === "/login"
    const role = localStorage.getItem("role")

    if (!role && !isLogin) {
      console.log("Redirecting to /login from", props.location.pathname)
      navigate("/login")
    }

    if (isLogin) {
      console.log("Accessing /login page")
    }
  }

  return element
}
