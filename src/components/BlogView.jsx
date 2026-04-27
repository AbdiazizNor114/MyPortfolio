import React, { useState } from "react";

import Modal from "./Modal";

export default function BlogView({ blogs }) {
  const [selected, setSelected] = useState(null);

  return (
    <main className="container blog-view">
      <h4>LOGBOOK</h4>

      <div className="blog-list">
        {blogs.length === 0 ? (
          <p>No blogs yet...</p>
        ) : (
          blogs.map((b) => (
            <div key={b.id} className="grid-col blog-card" onClick={() => setSelected(b)} style={{ cursor: "pointer" }}>
              <h3>{b.title}</h3>
              <small>{b.date || "No date"}</small>
              <p>{b.content?.slice(0, 140)}...</p>
              <span className="tech-stack">READ MORE →</span>
            </div>
          ))
        )}
      </div>

      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <h2>{selected.title}</h2>
          <small style={{ opacity: 0.6 }}>{selected.date}</small>
          <p style={{ marginTop: 20, lineHeight: 1.6 }}>{selected.content}</p>
          {selected.tags && (
            <div style={{ marginTop: 15 }}>
              <strong>Tags:</strong> {selected.tags}
            </div>
          )}
        </Modal>
      )}
    </main>
  );
}