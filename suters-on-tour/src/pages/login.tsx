import React, { useState } from "react"
import { navigate } from "gatsby"

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    if (password === "mnms2024") {
      localStorage.setItem("role", "mnms")
      navigate("/")
    } else if (password === "friends2024") {
      localStorage.setItem("role", "friend")
      navigate("/")
    } else {
      alert("Incorrect password")
    }
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h1>🔐 Login</h1>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
      />
      <button onClick={handleLogin}>Login</button>
    </main>
  )
}

export default LoginPage
