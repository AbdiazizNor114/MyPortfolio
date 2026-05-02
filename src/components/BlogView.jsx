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
            <div key={b.id} className="blog-card" onClick={() => setSelected(b)} style={{ cursor: "pointer" }}>
              {b.media && (
                <img src={b.media} alt={b.title} className="blog-media" />
              )}
              <h3>{b.title}</h3>
              <p>{(b.content || b.desc || "").slice(0, 140)}...</p>
              <span className="blog-date">{b.date || "No date"}</span>
            </div>
          ))
        )}
      </div>

      {selected && (
        <Modal
          title={selected.title}
          date={selected.date}
          content={selected.content || selected.desc}
          media={selected.media}
          onClose={() => setSelected(null)}
        />
      )}
    </main>
  );
}