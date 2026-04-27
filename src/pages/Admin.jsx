import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dataService } from "../services/dataService";
import "./Admin.css";

export default function Admin() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("projects"); // projects | blogs
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    id: null,
    title: "",
    desc: "",
    tech: "",
    language: "",
    customLanguage: "",
  });

  const [editing, setEditing] = useState(false);

  // LOAD DATA
  useEffect(() => {
    loadData();
  }, [tab]);

  const loadData = () => {
    setItems(
      tab === "projects"
        ? dataService.getProjects()
        : dataService.getBlogs()
    );
  };

  const reset = () => {
    setForm({
      id: null,
      title: "",
      desc: "",
      tech: "",
      language: "",
      customLanguage: "",
    });
    setEditing(false);
  };

  // GET FINAL LANGUAGE
  const getFinalLanguage = () => {
    return form.language === "Other"
      ? form.customLanguage
      : form.language;
  };

  // SAVE (CREATE / UPDATE)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (tab === "projects") {
      const project = {
        ...form,
        language: getFinalLanguage(),
      };

      if (editing) {
        dataService.updateProject(project);
      } else {
        dataService.saveProject({
          ...project,
          id: Date.now(),
        });
      }
    } else {
      const blog = {
        ...form,
        id: form.id || Date.now(),
        content: form.desc,
        date: new Date().toLocaleDateString(),
      };

      if (editing) {
        dataService.updateBlog(blog);
      } else {
        dataService.saveBlog(blog);
      }
    }

    loadData();
    reset();
  };

  // EDIT
  const handleEdit = (item) => {
    setForm(item);
    setEditing(true);
  };

  // DELETE
  const handleDelete = (id) => {
    if (tab === "projects") {
      dataService.deleteProject(id);
    } else {
      dataService.deleteBlog(id);
    }
    loadData();
  };

  return (
    <div className="admin-layout">

      {/* LEFT SIDEBAR */}
      <div className="admin-sidebar">

        <h2>ADMIN</h2>

        <button
          className={tab === "projects" ? "active" : ""}
          onClick={() => setTab("projects")}
        >
          Projects
        </button>

        <button
          className={tab === "blogs" ? "active" : ""}
          onClick={() => setTab("blogs")}
        >
          Blogs
        </button>

        <button className="exit" onClick={() => navigate("/")}>
          EXIT
        </button>

        {/* LIST */}
        <div className="admin-list">
          {items.map((item) => (
            <div key={item.id} className="admin-list-item">

              <div>
                <h4>{item.title}</h4>
                <small>
                  {item.language || item.date || ""}
                </small>
              </div>

              <div className="actions">
                <button onClick={() => handleEdit(item)}>✏️</button>
                <button onClick={() => handleDelete(item.id)}>🗑</button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="admin-content">

        <h2>
          {editing ? "Edit" : "Create"} {tab}
        </h2>

        <form onSubmit={handleSubmit} className="admin-form">

          {/* TITLE */}
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          {/* DESCRIPTION */}
          <textarea
            placeholder="Description"
            value={form.desc}
            onChange={(e) =>
              setForm({ ...form, desc: e.target.value })
            }
          />

          {/* PROJECT FIELDS */}
          {tab === "projects" && (
            <>
              {/* TECH */}
              <input
                placeholder="Tech Stack"
                value={form.tech}
                onChange={(e) =>
                  setForm({ ...form, tech: e.target.value })
                }
              />

              {/* LANGUAGE SELECT */}
              <select
                value={form.language}
                onChange={(e) =>
                  setForm({ ...form, language: e.target.value })
                }
              >
                <option value="">Select Language</option>
                <option value="Python">Python</option>
                <option value="JavaScript">JavaScript</option>
                <option value="TypeScript">TypeScript</option>
                <option value="Java">Java</option>
                <option value="C#">C#</option>
                <option value="C++">C++</option>
                <option value="Go">Go</option>
                <option value="Rust">Rust</option>
                <option value="Kotlin">Kotlin</option>
                <option value="Swift">Swift</option>
                <option value="Dart">Dart</option>
                <option value="PHP">PHP</option>
                <option value="Ruby">Ruby</option>
                <option value="SQL">SQL</option>
                <option value="HTML/CSS">HTML/CSS</option>
                <option value="React">React</option>
                <option value="Node.js">Node.js</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="AI">AI</option>
                <option value="Other">Other</option>
              </select>

              {/* CUSTOM LANGUAGE */}
              {form.language === "Other" && (
                <input
                  placeholder="Custom Language"
                  value={form.customLanguage}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      customLanguage: e.target.value,
                    })
                  }
                />
              )}
            </>
          )}

          {/* BUTTONS */}
          <button className="admin-btn">
            {editing ? "UPDATE" : "ADD"}
          </button>

          {editing && (
            <button
              type="button"
              className="cancel"
              onClick={reset}
            >
              CANCEL
            </button>
          )}

        </form>

      </div>
    </div>
  );
}