import React from "react";
import netlifyIdentity from "netlify-identity-widget";
import { useAuth } from "../hooks/useAuth";

const LoginMenu = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return (
      <button className="login-button" onClick={() => netlifyIdentity.open("login")}>
        Login
      </button>
    );
  }

  return (
    <div className="login-container">
      <div className="login-user">
        👤 {user.email}
      </div>
      <button className="logout-button" onClick={() => netlifyIdentity.logout()}>
        Logout
      </button>
    </div>
  );
};

export default LoginMenu;
