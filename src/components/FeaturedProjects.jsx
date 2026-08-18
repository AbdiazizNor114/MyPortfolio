import React from "react";
import { PROJECTS, normalizeProject } from "./ProjectsView";

export default function FeaturedProjects({ projects = [], setView }) {
  const featuredProjects = (projects.length > 0 ? projects : PROJECTS)
    .map(normalizeProject)
    .slice(0, 3);

  const openProjects = () => {
    setView("projects");
    window.history.pushState(null, "", "#projects");
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  return (
    <section className="featured-projects container" id="FeaturedProjects">
      <div className="featured-projects__header">
        <div>
          <span className="projects-eyebrow">Featured</span>
          <h4>Selected Work</h4>
        </div>
        <button type="button" className="featured-projects__link" onClick={openProjects}>
          View all projects
          <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </button>
      </div>

      <div className="featured-projects__grid">
        {featuredProjects.map((project) => (
          <button
            type="button"
            className="featured-project"
            key={project.id || project.title}
            onClick={openProjects}
          >
            <span className={`project-badge project-badge--${project.tag}`}>
              {project.badge}
            </span>
            <h3>{project.title}</h3>
            <p>
              {project.excerpt.length > 130
                ? `${project.excerpt.slice(0, 130)}...`
                : project.excerpt}
            </p>
            <span className="featured-project__meta">
              {project.tech.slice(0, 3).join(" / ")}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
