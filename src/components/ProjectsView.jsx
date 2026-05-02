import React, { useState } from "react";

import Modal from "./Modal";

export default function ProjectsView({ projects }) {
  const [selected, setSelected] = useState(null);

  return (
    <main className="container projects-view">
      <h4>PROJECTS</h4>

      <div className="projects-grid">
        {projects.length === 0 ? (
          <p>No projects yet...</p>
        ) : (
          projects.map((p) => (
            <div key={p.id} className="project-card" onClick={() => setSelected(p)} style={{ cursor: "pointer" }}>
              {p.media && (
                <img src={p.media} alt={p.title} className="project-media" />
              )}
              <h3>{p.title}</h3>
              <p>{(p.desc || p.content || "").slice(0, 140)}...</p>
              <span className="project-tech">{p.language || "Unknown language"}</span>
            </div>
          ))
        )}
      </div>

      {selected && (
        <Modal
          title={selected.title}
          date={selected.language}
          content={selected.desc || selected.content}
          media={selected.media}
          onClose={() => setSelected(null)}
        />
      )}
    </main>
  );
}