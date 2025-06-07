import React, { useState } from "react";
import { Link } from "gatsby";
import netlifyIdentity from "netlify-identity-widget";
import { useAuth } from "../hooks/useAuth";
import logo from "../img/sutersontour_text.png";

const Navbar = () => {
  const [isActive, setIsActive] = useState(false);
  const { user, loading } = useAuth();

  return (
    <nav
      className="navbar is-transparent"
      role="navigation"
      aria-label="main-navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-item" title="Logo">
            <img src={logo} alt="SutersOnTour" style={{ maxHeight: "100px" }} />
          </Link>
          <button
            className={`navbar-burger burger ${isActive ? "is-active" : ""}`}
            aria-expanded={isActive}
            onClick={() => setIsActive(!isActive)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div
          id="navMenu"
          className={`navbar-menu ${isActive ? "is-active" : ""}`}
        >
          <div className="navbar-start has-text-centered">
            <Link className="navbar-item" to="/about">
              About
            </Link>
              <Link className="navbar-item" to="/admin">
              Admin
            </Link>

          </div>
          <div className="navbar-end">
            <div className="navbar-item" style={{ padding: "0px" }}>
              {!loading && !user && (
                <button
                  className="button is-small is-primary"
                  style={{ marginLeft: "0.5rem" }}
                  onClick={() => netlifyIdentity.open("login")}
                >
                  Login
                </button>
              )}
              {!loading && user && (
                <button
                  className="button is-small is-light"
                  style={{ marginLeft: "0.5rem" }}
                  onClick={() => netlifyIdentity.logout()}
                  title={user.email}
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
