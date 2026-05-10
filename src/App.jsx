import "./style.css";

import React, { useEffect, useState } from "react";

import About from "./components/About";
import Admin from "./pages/Admin";
import Analytics from "./components/Analytics";
import BlogView from "./components/BlogView";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import ProjectsView from "./components/ProjectsView";
import SEO from "./components/SEO";
import Services from "./components/Services";
import Skills from "./components/Skills";
import { dataService } from "./services/dataService";
import { useLocation } from "react-router-dom";
import Education from "./pages/Education";
import Chatbot from "./components/Chatbot";

const VIEW_HASHES = {
  "#blog": "blog",
  "#education": "education",
  "#projects": "projects",
};

const SECTION_HASHES = new Set(["#About", "#Services", "#Skills", "#contact"]);

export default function App() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState(() => VIEW_HASHES[window.location.hash] || "portfolio");
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [blogLoadError, setBlogLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      const [projectResult, blogResult] = await Promise.allSettled([
        dataService.getProjects(),
        dataService.getBlogs(),
      ]);

      if (cancelled) return;

      if (projectResult.status === "fulfilled") {
        setProjects(projectResult.value);
      } else {
        setProjects([]);

        if (import.meta.env.DEV) {
          console.warn("Projects could not be loaded.", projectResult.reason);
        }
      }

      if (blogResult.status === "fulfilled") {
        setBlogs(blogResult.value);
        setBlogLoadError(false);
      } else {
        setBlogs([]);
        setBlogLoadError(true);

        if (import.meta.env.DEV) {
          console.warn("Blogs could not be loaded.", blogResult.reason);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  useEffect(() => {
    const syncViewFromHash = () => {
      setView(VIEW_HASHES[window.location.hash] || "portfolio");
    };

    window.addEventListener("hashchange", syncViewFromHash);
    window.addEventListener("popstate", syncViewFromHash);

    return () => {
      window.removeEventListener("hashchange", syncViewFromHash);
      window.removeEventListener("popstate", syncViewFromHash);
    };
  }, []);

  useEffect(() => {
    if (view !== "portfolio" || !SECTION_HASHES.has(window.location.hash)) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document
          .getElementById(window.location.hash.slice(1))
          ?.scrollIntoView({ behavior: "smooth" });
      });
    });
  }, [view]);

  if (window.location.pathname === "/admin") return <Admin />;

  return (
    <div className="portfolio-wrapper">
      <SEO
        title="Portfolio | Full Stack Developer"
        description="Professional portfolio showcasing web development projects, skills, and experience in React, JavaScript, and modern web technologies."
        keywords="web development, react, javascript, portfolio, full stack developer, frontend, backend"
      />
      <Analytics pageName={view} />
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} setView={setView} />

      {view === "portfolio" && (
        <main>
          <Hero />
          <About />
          <Services />
          <Skills />
          <Contact />
        </main>
      )}

      {view === "blog" && <BlogView blogs={blogs} hasError={blogLoadError} />}
      {view === "projects" && <ProjectsView projects={projects} />}
      {view === "education" && <Education />}

      <Footer />
      <Chatbot />
    </div>
  );
}
