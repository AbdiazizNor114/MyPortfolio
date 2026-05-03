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

import Chatbot from "./components/Chatbot";

export default function App() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState("portfolio");
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      const [projectData, blogData] = await Promise.all([
        dataService.getProjects(),
        dataService.getBlogs(),
      ]);

      if (cancelled) return;
      setProjects(projectData);
      setBlogs(blogData);
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  if (window.location.pathname === "/admin") return <Admin />;

  return (
    <div className="portfolio-wrapper">
      <SEO
        title="Portfolio | Full Stack Developer"
        description="Professional portfolio showcasing web development projects, skills, and experience in React, JavaScript, and modern web technologies."
        keywords="web development, react, javascript, portfolio, full stack developer, frontend, backend"
      />
      <Analytics />
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

      {view === "blog" && <BlogView blogs={blogs} />}
      {view === "projects" && <ProjectsView projects={projects} />}

      <Footer />
      <Chatbot />
    </div>
  );
}
