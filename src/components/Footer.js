import * as React from "react";
import { Link } from "gatsby";
import logo from "../img/sutersontour_logo_transparent.png";
import github from "../img/social/github-icon.svg";

const Footer = () => (
  <footer className="footer has-background-black has-text-white-ter" style={{ padding: "0.5em 0" }}>
    <div className="content has-text-centered">
      <img
        src={logo}
        alt="SutersOnTour"
        style={{ width: "10em", height: "auto", marginBottom: "0.2em" }}
      />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1em" }}>
        <Link to="/" className="navbar-item">
          Home
        </Link>
        <Link to="/about" className="navbar-item">
          About
        </Link>
        <a
          href="/admin/"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar-item"
        >
          Admin
        </a>
        <a
          title="GitHub"
          href="https://github.com/Larsibaer/SutersOnTour"
          style={{ verticalAlign: "middle" }}
        >
          <img
            src={github}
            alt="GitHub"
            style={{ width: "1em", height: "1em" }}
          />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
