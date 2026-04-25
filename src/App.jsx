import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import { dataService } from "./services/dataService";
import Admin from "./pages/Admin";
import "./style.css";


export default function App() {
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [view, setView] = useState('portfolio');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  
  const isAdmin = window.location.pathname === "/admin";

  useEffect(() => {
    setProjects(dataService.getProjects());
    setBlogs(dataService.getBlogs());
  }, []);

  if (isAdmin) {
    return <Admin />;
  }


  return (
    <div className="portfolio-wrapper">

      {/* NAVBAR */}
      <header>
        <nav className="container navbar">
         <img
            src="./images/svg/abdiaziz-nor-minimal-monogram.svg"
            alt="logo"
            className="logo"
            onClick={() => setView('portfolio')}
            style={{ cursor: 'pointer' }}
          />

          <ul className="nav-links">
            <li><a href="#About" onClick={() => setView('portfolio')}>About</a></li>
            <li><a href="#Skills" onClick={() => setView('portfolio')}>Skills</a></li>
            <li><a href="#" onClick={() => setView('projects')}>Projects</a></li>
            <li><a href="#" onClick={() => setView('blog')}>Blog</a></li>
            <a className="btn" href="#contact">Contact Me</a>
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
                  <a href="#"><i className="fa-brands fa-whatsapp"></i></a>
                  <a href="#"><i className="fa-brands fa-linkedin"></i></a>
                  <a href="#"><i className="fa-brands fa-github"></i></a>
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
                <img src="./images/nodejs.png" alt="Node.js" />
                <p>Node.js</p>
              </div>

              <div className="skill-card">
                <img src="./images/dart-logo-for-shares.png" alt="Dart" />
                <p>Dart</p>
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

            <form>
              <input type="text" placeholder="YOUR NAME" />
              <input type="email" placeholder="YOUR EMAIL" />
              <textarea placeholder="MESSAGE" rows="5"></textarea>
              <button className="btn" type="button">
                SEND
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
            <a href="#"><i className="fab fa-github"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div>
          <p>&copy; 2026 ABDIAZIZ NOR</p>
        </div>
      </footer>

    </div>
  );
}