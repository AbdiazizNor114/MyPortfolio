import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable, getStorage } from "firebase/storage";
import { dataService } from "../services/dataService";
import { app } from "../firebase";
import "../styles/pages/admin.css";

export default function Admin() {
  const navigate = useNavigate();
  const storage = getStorage(app);

  const [tab, setTab] = useState("projects"); // projects | blogs
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    id: null,
    title: "",
    desc: "",
    tech: "",
    language: "",
    customLanguage: "",
    media: "",
  });

  const [editing, setEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  // LOAD DATA
  useEffect(() => {
    loadData();
  }, [tab]);

  const loadData = async () => {
    const nextItems =
      tab === "projects"
        ? await dataService.getProjects()
        : await dataService.getBlogs();
    setItems(nextItems);
  };

  const reset = () => {
    setForm({
      id: null,
      title: "",
      desc: "",
      tech: "",
      language: "",
      customLanguage: "",
      media: "",
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUploading) return;

    if (tab === "projects") {
      const project = {
        ...form,
        language: getFinalLanguage(),
        media: form.media?.trim() || "",
      };

      if (editing) {
        await dataService.updateProject(project);
      } else {
        await dataService.saveProject(project);
      }
    } else {
      const blog = {
        ...form,
        content: form.desc,
        date: new Date().toLocaleDateString(),
        media: form.media?.trim() || "",
      };

      if (editing) {
        await dataService.updateBlog(blog);
      } else {
        await dataService.saveBlog(blog);
      }
    }

    await loadData();
    reset();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploadProgress(0);
    setIsUploading(true);

    const cleanName = file.name.replace(/\s+/g, "-").toLowerCase();
    const storageRef = ref(
      storage,
      `media/${tab}/${Date.now()}-${cleanName}`
    );

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Show upload progress
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
      },
      (error) => {
        setUploadError(`Upload failed: ${error.message}`);
        setIsUploading(false);
        setUploadProgress(0);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setForm((prev) => ({ ...prev, media: url }));
        setIsUploading(false);
        setUploadProgress(0);
      }
    );
  };

  // EDIT
  const handleEdit = (item) => {
    setForm({
      id: item.id || null,
      title: item.title || "",
      desc: item.desc || item.content || "",
      tech: item.tech || "",
      language: item.language || "",
      customLanguage: item.customLanguage || "",
      media: item.media || "",
    });
    setEditing(true);
  };

  // DELETE
  const handleDelete = async (id) => {
    if (tab === "projects") {
      await dataService.deleteProject(id);
    } else {
      await dataService.deleteBlog(id);
    }
    await loadData();
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
                  {item.media ? " • media" : ""}
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

          <input
            placeholder="Media URL or filename (example: demo.mp4 or image.png)"
            value={form.media}
            onChange={(e) =>
              setForm({ ...form, media: e.target.value })
            }
          />

          <div className="admin-upload-row">
            <label className="admin-upload-label">
              Upload image/video
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
            {isUploading && (
              <div className="upload-progress">
                <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                <small>{uploadProgress}%</small>
              </div>
            )}
            {uploadError && <small className="admin-upload-error">{uploadError}</small>}
          </div>

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
          <button className="admin-btn" disabled={isUploading}>
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