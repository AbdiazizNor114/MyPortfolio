import { useEffect, useState } from "react";
import { dataService } from "../services/dataService";

export default function Blog({ selectedBlog, setSelectedBlog }) {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    setBlogs(dataService.getBlogs());
  }, []);

  /* ================= FULL BLOG VIEW ================= */
  if (selectedBlog) {
    return (
      <section className="container blog-view">

        <button
          className="btn"
          onClick={() => setSelectedBlog(null)}
          style={{ marginBottom: "25px" }}
        >
          ← Back to Blogs
        </button>

        <article className="grid-col blog-card blog-full">

          <h2>{selectedBlog.title}</h2>

          <div className="blog-meta">
            <small>{selectedBlog.date}</small>
          </div>

          <div className="blog-content">
            {selectedBlog.content}
          </div>

        </article>

      </section>
    );
  }

  /* ================= BLOG LIST VIEW ================= */
  return (
    <section className="container blog-view">
      <h4>BLOG LOG</h4>

      <div className="blog-list">

        {blogs.length === 0 ? (
          <p className="empty-text">No blogs yet...</p>
        ) : (
          blogs.map((b) => (
            <article
              key={b.id}
              className="grid-col blog-card blog-item"
              onClick={() => setSelectedBlog(b)}
            >

              <h3>{b.title}</h3>

              <div className="blog-meta">
                <small>{b.date}</small>
              </div>

              <p className="preview-text">
                {b.content?.slice(0, 140)}...
              </p>

              <span className="read-more">
                Read more →
              </span>

            </article>
          ))
        )}

      </div>
    </section>
  );
}