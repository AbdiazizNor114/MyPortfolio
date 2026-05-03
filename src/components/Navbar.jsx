import React from "react";

import ThemeToggle from "./ThemeToggle";

export default function Navbar({ menuOpen, setMenuOpen, setView }) {
  const handleNavClick = (event, action) => {
    event.preventDefault();
    action();
  };

  const navigate = (view, scrollToTop = false) => {
    setView(view);
    setMenuOpen(false);

    if (scrollToTop) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  };

  const navigateToSection = (sectionId) => {
    setView("portfolio");
    setMenuOpen(false);

    requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <header>
      <nav className="container navbar">
        <img
          src="./images/svg/abdiaziz-nor-minimal-monogram.svg"
          alt="logo"
          className="logo"
          onClick={() => navigate("portfolio", true)}
          style={{ cursor: "pointer" }}
        />

        <button
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          type="button"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li>
            <a href="#About" onClick={(event) => handleNavClick(event, () => navigateToSection("About"))}>
              About
            </a>
          </li>
          <li>
            <a href="#Services" onClick={(event) => handleNavClick(event, () => navigateToSection("Services"))}>
              Services
            </a>
          </li>
          <li>
            <a href="#Skills" onClick={(event) => handleNavClick(event, () => navigateToSection("Skills"))}>
              Skills
            </a>
          </li>
          <li>
            <a href="#projects" onClick={(event) => handleNavClick(event, () => navigate("projects", true))}>
              Projects
            </a>
          </li>
          <li>
            <a href="#blog" onClick={(event) => handleNavClick(event, () => navigate("blog", true))}>
              Blog
            </a>
          </li>
          <li>
            <ThemeToggle />
          </li>
          <li>
            <a className="btn" href="#contact" onClick={(event) => handleNavClick(event, () => navigateToSection("contact"))}>
              Contact Me
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
