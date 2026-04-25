import { useEffect, useState } from "react";
import { dataService } from "../services/dataService";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    setProjects(dataService.getProjects());
  }, []);

  const isImage = (file) =>
    file && /\.(jpg|jpeg|png|gif|webp)$/i.test(file);

  const isVideo = (file) =>
    file && /\.(mp4|webm|ogg)$/i.test(file);

  const renderMedia = (media) => {
    if (!media) return null;

    const src = `/uploads/${media}`;

    if (isImage(media)) {
      return <img src={src} alt="media" className="project-media" />;
    }

    if (isVideo(media)) {
      return (
        <video controls className="project-media">
          <source src={src} />
        </video>
      );
    }

    return <small>📎 {media}</small>;
  };

  /* ================= FULL PROJECT VIEW ================= */
  if (selectedProject) {
    return (
      <section className="container blog-view">

        <button className="btn" onClick={() => setSelectedProject(null)}>
          ← Back
        </button>

        <article className="grid-col blog-card">

          <h2>{selectedProject.title}</h2>

          <small className="language">
            {selectedProject.language}
          </small>

          <p style={{ marginTop: "20px" }}>
            {selectedProject.desc}
          </p>

          <div style={{ marginTop: "15px" }}>
            <strong>Tech:</strong> {selectedProject.tech}
          </div>

          <div style={{ marginTop: "20px" }}>
            {renderMedia(selectedProject.media)}
          </div>

        </article>
      </section>
    );
  }

  /* ================= PROJECT LIST VIEW ================= */
  return (
    <section className="portfolio container" id="projects">
      <h4>PROJECTS</h4>

      <div className="blog-list">

        {projects.length === 0 ? (
          <p className="empty-text">No projects yet...</p>
        ) : (
          projects.map((p) => (
            <div
              key={p.id}
              className="grid-col blog-card project-card"
              onClick={() => setSelectedProject(p)}
              style={{ cursor: "pointer" }}
            >

              <h3>{p.title}</h3>

              <p className="desc">
                {p.desc?.slice(0, 120)}...
              </p>

              <div className="meta">
                <span className="tech-stack">{p.tech}</span>
                <span className="language">{p.language}</span>
              </div>

            </div>
          ))
        )}

      </div>
    </section>
  );
}