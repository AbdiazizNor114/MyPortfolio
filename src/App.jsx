import "./style.css";

import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Admin from "./pages/Admin";
import { dataService } from "./services/dataService";
import emailjs from "@emailjs/browser";
import { useRef } from "react";

export default function App() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);

  const [view, setView] = useState("portfolio");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const formRef = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      "service_rc09617",
      "template_ozk0ioe",
      formRef.current,
      "yDUR2GPj5Ss6xZp5L"
    )
    .then(() => {
      alert("Message sent successfully!");
      formRef.current.reset();
    })
    .catch((error) => {
      console.log("FAILED...", error);
      alert("Failed to send message");
    });
  };

  const isAdmin = window.location.pathname === "/admin";

  // 🔥 FIX: reload data when route changes
  useEffect(() => {
    setProjects(dataService.getProjects());
    setBlogs(dataService.getBlogs());
  }, [location.pathname]);

  if (isAdmin) {
    return <Admin />;
  }
  return (
    <div className="portfolio-wrapper">

      {/* NAVBAR */}
      {/* NAVBAR */}
      <header>
        <nav className="container navbar">

          {/* LOGO */}
          <img
            src="./images/svg/abdiaziz-nor-minimal-monogram.svg"
            alt="logo"
            className="logo"
            onClick={() => {
              setView("portfolio");
              setMenuOpen(false);
            }}
            style={{ cursor: "pointer" }}
          />

          {/* HAMBURGER */}
          <div
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* NAV LINKS */}
          <ul className={`nav-links ${menuOpen ? "active" : ""}`}>

            <li>
              <a href="#About" onClick={() => { setView("portfolio"); setMenuOpen(false); }}>
                About
              </a>
            </li>

            <li>
              <a href="#Skills" onClick={() => { setView("portfolio"); setMenuOpen(false); }}>
                Skills
              </a>
            </li>

            <li>
              <a onClick={() => { setView("projects"); setMenuOpen(false); }}>
                Projects
              </a>
            </li>

            <li>
              <a onClick={() => { setView("blog"); setMenuOpen(false); }}>
                Blog
              </a>
            </li>

            <a className="btn" href="#contact" onClick={() => setMenuOpen(false)}>
              Contact Me
            </a>

            <a className="btn" href="#contact" onClick={() => setMenuOpen(false)}>
              Test Link
            </a>

          </ul>

        </nav>
      </header>

      {/* MAIN VIEWS */}
      {view === 'portfolio' && (
        <main>

          {/* HERO */}
          <section className="hero container">
            <div className="hero-top">

              <div className="content">
                <div className="info">
                  <h1>Hi, I am</h1>
                  <h2>ABDIAZIZ<br />NOR</h2>
                  <h6 className="glow-text">
                    System Developer | Aspiring AI Enthusiast
                  </h6>
                </div>

                <div className="contact-me">
                  <a href="https://wa.link/uonz28" target="_blank" rel="noopener noreferrer">
                    <i className="fa-brands fa-whatsapp"></i>
                  </a>

                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <i className="fa-brands fa-linkedin"></i>
                  </a>

                  <a href="https://github.com/AbdiazizNor114" target="_blank" rel="noopener noreferrer">
                    <i className="fa-brands fa-github"></i>
                  </a>
                </div>
              </div>

              <div className="person-img">
                <div className="img-ring">
                  <img src="./images/i.jpeg" alt="person" />
                </div>
              </div>

            </div>
          </section>

          {/* ABOUT */}
          <section className="aboutme container" id="About">
            <h4>ABOUT ME</h4>
            <div className="grid-about">

              <div className="intro-text">
                <p>
                  I am a System Developer focused on backend development,
                  building reliable and scalable systems using APIs,
                  logic, and clean architecture.
                </p>
              </div>

              <div className="columns-wrapper">
                <div className="grid-item">
                  <h6>BACKEND DEVELOPMENT</h6>
                  <p>Building APIs, server logic, and system architecture.</p>
                </div>

                <div className="grid-item">
                  <h6>SYSTEM OPTIMIZATION</h6>
                  <p>Debugging and improving backend performance.</p>
                </div>
              </div>

            </div>
          </section>

          {/* SKILLS */}
          <section className="skills container" id="Skills">
            <h4>TECHNICAL SKILLS</h4>

            <div className="skills-grid">

              <div className="skill-card">
                <img src="./images/Python-logo-notext.svg.png" alt="Python" />
                <p>Python</p>
              </div>

              <div className="skill-card">
                <img src="./images/Java_programming_language_logo.svg" alt="Java" />
                <p>Java</p>
              </div>

              <div className="skill-card">
                <img src="./images/csharp_logo.png" alt="C#" />
                <p>C#</p>
              </div>

              <div className="skill-card">
                <img src="./images/dart-logo-for-shares.png" alt="Dart" />
                <p>Dart</p>
              </div>

              
              <div className="skill-card">
                <img src="./images/typscript.png" alt="TypeScript" />
                <p>TypeScript</p>
              </div>

              <div className="skill-card">
                <img src="./images/javascript.svg" alt="JavaScript" />
                <p>JavaScript</p>
              </div>

              <div className="skill-card">
                <img src="./images/nodejs.png" alt="Node.js" />
                <p>Node.js</p>
              </div>


              <div className="skill-card">
                <img src="./images/database-icon.jpg" alt="Database" />
                <p>Database</p>
              </div>
              

              
              
              <div className="skill-card">
                <img src="./images/machine-learning.svg" alt="ML" />
                <p>Machine Learning</p>
              </div>

              <div className="skill-card">
                <img src="./images/API.png" alt="API" />
                <p>API Dev</p>
              </div>

              <div className="skill-card">
                <img src="./images/GitHub_Invertocat_Logo.svg" alt="GitHub" />
                <p>GitHub</p>
              </div>

            </div>
          </section>
          {/* CONTACT */}
          <section className="contact container" id="contact">
            <h4>CONTACT</h4>

            <form ref={formRef} onSubmit={sendEmail}>

              <input
                type="text"
                name="user_name"
                placeholder="YOUR  NAME"
                required
              />

              <input
                type="email"
                name="user_email"
                placeholder="YOUR  EMAIL"
                required
              />

              <textarea
                name="message"
                placeholder="MESSAGE"
                rows="5"
                required
              ></textarea>

              <button className="btn" type="submit">
                SEND MESSAGE
              </button>

            </form>
          </section>

        </main>
      )}

      {/* ================= BLOG ================= */}
      {view === "blog" && (
        <main className="container blog-view">
          <h4>LOGBOOK</h4>

          <div className="blog-list">

            {blogs.length === 0 ? (
              <p>No blogs yet...</p>
            ) : (
              blogs.map((b) => (
                <div
                  key={b.id}
                  className="grid-col blog-card"
                  onClick={() => setSelectedBlog(b)}
                  style={{ cursor: "pointer" }}
                >
                  <h3>{b.title}</h3>

                  <small>{b.date || "No date"}</small>

                  <p>{b.content?.slice(0, 140)}...</p>

                  <span className="tech-stack">
                    READ MORE →
                  </span>
                </div>
              ))
            )}

          </div>

          {/* BLOG MODAL (FULL VIEW) */}
          {/* BLOG MODAL (FULL VIEW) */}
          {selectedBlog && (
            <div
              className="modal-overlay"
              onClick={() => setSelectedBlog(null)}
            >
              <div
                className="modal-box"
                onClick={(e) => e.stopPropagation()}
              >
                <h2>{selectedBlog.title}</h2>

                <small style={{ opacity: 0.6 }}>
                  {selectedBlog.date}
                </small>

                <p style={{ marginTop: "20px", lineHeight: "1.6" }}>
                  {selectedBlog.content}
                </p>

                {/* Optional extra like project */}
                {selectedBlog.tags && (
                  <div style={{ marginTop: "15px" }}>
                    <strong>Tags:</strong> {selectedBlog.tags}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      )}


      {/* ================= PROJECTS ================= */}
      {view === "projects" && (
        <main className="container blog-view">
          <h4>PROJECTS</h4>

          <div className="blog-list">

            {projects.length === 0 ? (
              <p>No projects yet...</p>
            ) : (
              projects.map((p) => (
                <div
                  key={p.id}
                  className="grid-col blog-card"
                  onClick={() => setSelectedProject(p)}
                  style={{ cursor: "pointer" }}
                >
                  <h3>{p.title}</h3>

                  <small>
                    {p.language || "Unknown language"}
                  </small>

                  <p>{p.desc?.slice(0, 140)}...</p>

                  <span className="tech-stack">
                    {p.tech}
                  </span>
                </div>
              ))
            )}

          </div>

          {/* PROJECT MODAL (FULL VIEW) */}
          {selectedProject && (
            <div
              className="modal-overlay"
              onClick={() => setSelectedProject(null)}
            >
              <div
                className="modal-box"
                onClick={(e) => e.stopPropagation()}
              >
                <h2>{selectedProject.title}</h2>

                <small style={{ opacity: 0.6 }}>
                  {selectedProject.language}
                </small>

                <p style={{ marginTop: "20px", lineHeight: "1.6" }}>
                  {selectedProject.desc}
                </p>

                <div style={{ marginTop: "15px" }}>
                  <strong>Tech:</strong> {selectedProject.tech}
                </div>
              </div>
            </div>
          )}
        </main>
      )}
      {/* FOOTER */}
      <footer>
        <div className="container footer-info">
          <div className="social">
            <a href="https://github.com/AbdiazizNor114" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/abdiaziz-nor-1b2b1b1b1/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
          <p>&copy; 2026 ABDIAZIZ NOR</p>
        </div>
      </footer>

    </div>
  );
}