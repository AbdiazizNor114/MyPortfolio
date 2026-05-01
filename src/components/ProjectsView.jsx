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
              <p>{(p.desc || p.content || "").slice(0, 140)}...</p>
              <span className="tech-stack">{p.tech}</span>
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