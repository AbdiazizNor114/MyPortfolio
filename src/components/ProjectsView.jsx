import React, { useState } from "react";

import Modal from "./Modal";

export default function ProjectsView({ projects }) {
  const [selected, setSelected] = useState(null);

  return (
    <main className="container blog-view">
      <h4>PROJECTS</h4>

      <div className="blog-list">
        {projects.length === 0 ? (
          <p>No projects yet...</p>
        ) : (
          projects.map((p) => (
            <div key={p.id} className="grid-col blog-card" onClick={() => setSelected(p)} style={{ cursor: "pointer" }}>
              <h3>{p.title}</h3>
              <small>{p.language || "Unknown language"}</small>
              <p>{p.desc?.slice(0, 140)}...</p>
              <span className="tech-stack">{p.tech}</span>
            </div>
          ))
        )}
      </div>

      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <h2>{selected.title}</h2>
          <small style={{ opacity: 0.6 }}>{selected.language}</small>
          <p style={{ marginTop: 20, lineHeight: 1.6 }}>{selected.desc}</p>
          <div style={{ marginTop: 15 }}>
            <strong>Tech:</strong> {selected.tech}
          </div>
        </Modal>
      )}
    </main>
  );
}