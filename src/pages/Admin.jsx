import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dataService } from "../services/dataService";
import "./Admin.css";

const LANGUAGES = [
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "C#",
  "C++",
  "Go",
  "Rust",
  "Kotlin",
  "Swift",
  "Dart",
  "PHP",
  "Ruby",
  "Scala",
  "R",
  "SQL",
  "Bash",
  "HTML/CSS",
  "React",
  "Node.js",
  "Machine Learning",
  "AI / ML",
  "Other"
];

export default function Admin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    desc: "",
    tech: "",
    language: "Python",
    customLanguage: "",
    type: "project",
    media: null,
  });

  const handleFile = (e) => {
    setForm({ ...form, media: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalLanguage =
      form.language === "Other" ? form.customLanguage : form.language;

    const item = {
      id: Date.now(),
      title: form.title,
      desc: form.desc,
      tech: form.tech,
      language: finalLanguage,
      media: form.media ? form.media.name : null,
    };

    if (form.type === "project") dataService.saveProject(item);
    else dataService.saveBlog(item);

    alert("Saved Successfully!");
  };

  return (
    <div className="admin-container">

      <div className="admin-card">

        {/* HEADER */}
        <div className="admin-header">
          <h2>ADMIN CONTROL PANEL</h2>

          <button
            className="exit-btn"
            onClick={() => navigate("/")}
          >
            EXIT
          </button>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>

          {/* TYPE */}
          <div className="form-group">
            <label>Type</label>
            <select
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
            >
              <option value="project">Project</option>
              <option value="blog">Blog</option>
            </select>
          </div>

          {/* LANGUAGE */}
          <div className="form-group">
            <label>Programming Language</label>

            <select
              value={form.language}
              onChange={(e) =>
                setForm({ ...form, language: e.target.value })
              }
            >
              {LANGUAGES.map((lang, i) => (
                <option key={i} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* CUSTOM LANGUAGE */}
          {form.language === "Other" && (
            <input
              placeholder="Write your language..."
              onChange={(e) =>
                setForm({ ...form, customLanguage: e.target.value })
              }
            />
          )}

          {/* TITLE */}
          <div className="form-group">
            <label>Title</label>
            <input
              placeholder="Project / Blog title"
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />
          </div>

          {/* TECH */}
          <div className="form-group">
            <label>Tech Stack</label>
            <input
              placeholder="e.g React, Node.js, Flask"
              onChange={(e) =>
                setForm({ ...form, tech: e.target.value })
              }
            />
          </div>

          {/* DESCRIPTION */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Describe your project..."
              onChange={(e) =>
                setForm({ ...form, desc: e.target.value })
              }
            />
          </div>

          {/* MEDIA */}
          <div className="form-group">
            <label>Media (Image / Video)</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFile}
            />
          </div>

          {/* BUTTON */}
          <button className="admin-btn" type="submit">
            SAVE
          </button>

        </form>
      </div>
    </div>
  );
}