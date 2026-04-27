import React from "react";

export default function Navbar({ menuOpen, setMenuOpen, setView }) {
  const navigate = (view) => {
    setView(view);
    setMenuOpen(false);
  };

  return (
    <header>
      <nav className="container navbar">
        <img
          src="./images/svg/abdiaziz-nor-minimal-monogram.svg"
          alt="logo"
          className="logo"
          onClick={() => navigate("portfolio")}
          style={{ cursor: "pointer" }}
        />

        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><a href="#About" onClick={() => navigate("portfolio")}>About</a></li>
          <li><a href="#Skills" onClick={() => navigate("portfolio")}>Skills</a></li>
          <li><a onClick={() => navigate("projects")}>Projects</a></li>
          <li><a onClick={() => navigate("blog")}>Blog</a></li>
          <a className="btn" href="#contact" onClick={() => setMenuOpen(false)}>Contact Me</a>
        </ul>
      </nav>
    </header>
  );
}