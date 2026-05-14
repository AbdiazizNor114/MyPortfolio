import React, { useState } from "react";
import { renderMarkdown } from "../services/markdownService";

const fallbackPosts = [
  {
    id: "portfolio-build",
    title: "Building My Portfolio",
    sub: "React - Firebase - Vite",
    icon: "fa-pen-nib",
    date: "Portfolio note",
    desc: "A short note about building a modern developer portfolio with React, Firebase content, EmailJS contact handling, and an admin workflow.",
    features: [
      "React and Vite frontend structure",
      "Firebase-powered dynamic content",
      "EmailJS contact form integration",
      "Admin workflow for projects and blog updates",
    ],
    tech: ["React", "Firebase", "Vite"],
  },
];

const getPostHighlights = (post) => {
  const value = post.highlights || post.keyPoints || post.features;

  if (Array.isArray(value) && value.length > 0) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(/\n|,/)
      .map((point) => point.trim())
      .filter(Boolean);
  }

  return [
    "Written as part of Abdiaziz Nor's developer logbook",
    "Focused on practical learning and project decisions",
    "Connected to backend, AI, full-stack, or portfolio work",
  ];
};

const normalizePost = (post) => {
  const content = post.content || post.desc || "";

  return {
    id: post.id || post.title,
    title: post.title || "Untitled post",
    sub: post.date || "Blog post",
    icon: "fa-newspaper",
    date: post.date || "No date",
    desc: content,
    features: getPostHighlights(post),
    tech: post.tech
      ? post.tech.split(",").map((item) => item.trim()).filter(Boolean)
      : ["Article", "Learning", "Portfolio"],
  };
};

export default function BlogView({ blogs, hasError = false }) {
  const [selected, setSelected] = useState(null);
  const posts = blogs.length > 0 ? blogs.map(normalizePost) : fallbackPosts;

  return (
    <section className="blog-section container" id="Blog">
      <div className="projects-header">
        <span className="projects-eyebrow">Dev Notes</span>
        <h4>Journal</h4>
      </div>

      {hasError && (
        <p className="empty-text">
          Blog posts could not be loaded right now. Showing a local fallback post.
        </p>
      )}

      <div className="blog-grid">
        {posts.map((post, index) => (
          <div
            className="blog-card"
            key={post.id}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setSelected(post)}
          >
            <div className="blog-card__img">
              <i className={`fa-solid ${post.icon}`} aria-hidden="true" />
              <span className="blog-badge">{post.date}</span>
            </div>

            <div className="blog-card__body">
              <h3 className="blog-card__title">{post.title}</h3>
              <p className="blog-card__desc">
                {post.desc.length > 110 ? `${post.desc.slice(0, 110)}...` : post.desc}
              </p>
            </div>

            <div className="blog-card__footer">
              <div className="tech-tags">
                {post.tech.slice(0, 3).map((tech) => (
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
          className="blog-modal-overlay"
          onClick={(event) => event.target === event.currentTarget && setSelected(null)}
        >
          <div className="blog-modal-box" role="dialog" aria-modal="true" aria-label={selected.title}>
            <div className="blog-modal-header">
              <div>
                <h2 className="blog-modal-title">{selected.title}</h2>
                <p className="blog-modal-sub">{selected.sub}</p>
              </div>
              <button
                type="button"
                className="blog-modal-close"
                onClick={() => setSelected(null)}
                aria-label="Close modal"
              >
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            </div>

            <div className="blog-modal-body">
              <div className="blog-modal-preview">
                <i className={`fa-solid ${selected.icon}`} aria-hidden="true" />
              </div>

              <div
                className="blog-modal-desc"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(selected.desc) }}
              />

              <p className="blog-modal-section-label">Key points</p>
              <ul className="blog-modal-features">
                {selected.features.map((feature) => (
                  <li key={feature}>
                    <i className="fa-solid fa-check" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="blog-modal-tech-row">
                {selected.tech.map((tech) => (
                  <span key={tech} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
