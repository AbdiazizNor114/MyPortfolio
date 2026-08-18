import React, { useState } from "react";
import { renderMarkdown } from "../services/markdownService";

const PROJECTS = [
  {
    title: "Somali Bank",
    sub: "Python - CLI & GUI banking system",
    tag: "python",
    badge: "Python",
    icon: "fa-building-columns",
    image: "/images/Python-logo-notext.svg.png",
    desc: "A full banking application built in Python with both a CLI and a Tkinter GUI. Users can create accounts, transfer money, and view transaction history, all persisted in SQLite.",
    features: [
      "Account creation with auto-generated IBAN, BIC & clearing number",
      "Deposit, withdrawal & peer-to-peer transfers with balance validation",
      "Full transaction history ordered by timestamp",
      "SQLite backend with a clean dedicated data access layer",
      "Dual interface: terminal CLI and desktop Tkinter GUI",
    ],
    tech: ["Python", "SQLite", "Tkinter", "OOP"],
    github: "https://github.com/AbdiazizNor114",
    demo: null,
  },
  {
    title: "Portfolio Site",
    sub: "React - Full stack personal site",
    tag: "react",
    badge: "React",
    icon: "fa-layer-group",
    image: "/images/portfolio-preview.png",
    desc: "Personal portfolio built with React and Vite, featuring a Firebase-powered blog, contact form via EmailJS, and an admin panel for managing content.",
    features: [
      "Firebase Firestore blog with admin panel for publishing",
      "EmailJS contact form with no backend required",
      "Custom domain deployment on Vercel",
      "Responsive design with Tailwind CSS",
    ],
    tech: ["React", "Firebase", "Tailwind", "Vite", "EmailJS"],
    github: "https://github.com/AbdiazizNor114/MyPortfolio",
    demo: "https://aziz.smidify.se",
  },
];

const FILTERS = ["All", "Python", "React", "Full stack"];

const toTechArray = (value) => {
  if (Array.isArray(value)) {
    return value.map((tech) => String(tech).trim()).filter(Boolean);
  }

  return String(value || "")
    .split(",")
    .map((tech) => tech.trim())
    .filter(Boolean);
};

const getProjectTag = (project) => {
  const text = [project.language, project.tech, project.title, project.desc, project.content]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (text.includes("python")) return "python";
  if (text.includes("react")) return "react";
  if (
    text.includes("full stack") ||
    text.includes("fullstack") ||
    text.includes("firebase") ||
    text.includes("node")
  ) {
    return "fullstack";
  }

  return "fullstack";
};

const getProjectFeatures = (project) => {
  const editableHighlights = project.highlights || project.keyFeatures;

  if (Array.isArray(editableHighlights) && editableHighlights.length > 0) {
    return editableHighlights;
  }

  if (typeof editableHighlights === "string" && editableHighlights.trim()) {
    return editableHighlights
      .split(/\n|,/)
      .map((feature) => feature.trim())
      .filter(Boolean);
  }

  if (Array.isArray(project.features) && project.features.length > 0) {
    return project.features;
  }

  if (typeof project.features === "string" && project.features.trim()) {
    return project.features
      .split(/\n|,/)
      .map((feature) => feature.trim())
      .filter(Boolean);
  }

  return [
    "A portfolio project by Abdiaziz Nor.",
  ];
};

const getBadgeText = (project, tag, tech) => {
  if (project.badge) return project.badge;
  if (project.language) return project.language;
  if (tech[0]) return tech[0];
  return tag === "fullstack" ? "Full stack" : tag.charAt(0).toUpperCase() + tag.slice(1);
};

const getPlainText = (value) =>
  String(value || "")
    .replace(/^#{1,6}\s+.*$/gm, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`~[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const isVideoMedia = (url) => /\.(mp4|webm|ogg)(\?|#|$)/i.test(url);

function ProjectMedia({ project, className }) {
  const [hasError, setHasError] = useState(false);

  if (!project.image || hasError) {
    return <span className="project-card__placeholder">{project.badge}</span>;
  }

  if (isVideoMedia(project.image)) {
    return (
      <video
        src={project.image}
        className={className}
        muted
        playsInline
        preload="metadata"
        controls
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <img
      src={project.image}
      alt={`${project.title} preview`}
      className={className}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}

const normalizeProject = (project) => {
  const tech = toTechArray(project.tech);
  const tag = getProjectTag(project);
  const desc = project.desc || project.content || "A portfolio project by Abdiaziz Nor.";
  const badge = getBadgeText(project, tag, tech);

  return {
    ...project,
    title: project.title || "Untitled Project",
    sub: project.sub || `${project.language || badge} - Portfolio project`,
    tag,
    badge,
    image: project.media || project.image || project.thumbnail || project.cover || "",
    desc,
    excerpt: getPlainText(desc),
    features: getProjectFeatures(project),
    tech: tech.length > 0 ? tech : [project.language || badge],
    github: project.github || project.githubUrl || project.repo || project.repository || "",
    demo: project.demo || project.liveDemo || project.liveUrl || project.url || "",
  };
};

export default function ProjectsView({ projects = [] }) {
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState(null);
  const projectItems = (projects.length > 0 ? projects : PROJECTS).map(normalizeProject);
  const activeKey = active.toLowerCase().replace(/\s+/g, "");

  const filtered =
    active === "All"
      ? projectItems
      : projectItems.filter(
          (project) =>
            project.tag === activeKey ||
            project.sub.toLowerCase().includes(active.toLowerCase()) ||
            project.tech.join(" ").toLowerCase().includes(active.toLowerCase())
        );

  return (
    <section className="projects-section container" id="Projects">
      <div className="projects-header">
        <span className="projects-eyebrow">Work</span>
        <h4>Projects</h4>
      </div>

      <div className="filter-bar">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`filter-btn${active === filter ? " filter-btn--active" : ""}`}
            onClick={() => setActive(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="projects-grid">
        {filtered.map((project, index) => (
          <div
            className="project-card"
            key={project.title}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setSelected(project)}
          >
            <div className="project-card__img">
              <ProjectMedia project={project} className="project-card__image" />
              <span className={`project-badge project-badge--${project.tag}`}>
                {project.badge}
              </span>
            </div>

            <div className="project-card__body">
              <h3 className="project-card__title">{project.title}</h3>
              <p className="project-card__desc">
                {project.excerpt.length > 100
                  ? `${project.excerpt.slice(0, 100)}...`
                  : project.excerpt}
              </p>
            </div>

            <div className="project-card__footer">
              <div className="tech-tags">
                {project.tech.slice(0, 3).map((tech) => (
                  <span key={tech} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
              <span className="project-card__arrow">
                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div
          className="project-modal-overlay"
          onClick={(event) => event.target === event.currentTarget && setSelected(null)}
        >
          <div className="project-modal-box" role="dialog" aria-modal="true" aria-label={selected.title}>
            <div className="project-modal-header">
              <div>
                <h2 className="project-modal-title">{selected.title}</h2>
                <p className="project-modal-sub">{selected.sub}</p>
              </div>
              <button
                type="button"
                className="project-modal-close"
                onClick={() => setSelected(null)}
                aria-label="Close modal"
              >
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            </div>

            <div className="project-modal-body">
              <div className="project-modal-preview">
                <ProjectMedia project={selected} className="project-modal-preview-img" />
              </div>

              <div
                className="project-modal-desc"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(selected.desc) }}
              />

              <p className="project-modal-section-label">Key features</p>
              <ul className="project-modal-features">
                {selected.features.map((feature) => (
                  <li key={feature}>
                    <i className="fa-solid fa-check" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="project-modal-tech-row">
                {selected.tech.map((tech) => (
                  <span key={tech} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="project-modal-actions">
                {selected.github && (
                  <a
                    href={selected.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    <i className="fa-brands fa-github" aria-hidden="true" />
                    View code
                  </a>
                )}
                {selected.demo && (
                  <a
                    href={selected.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
                    Live demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
