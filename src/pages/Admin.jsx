import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, getSupabase } from "../supabase";
import { dataService } from "../services/dataService";
import { renderMarkdown } from "../services/markdownService";
import "../styles/pages/admin.css";

const LANGUAGE_OPTIONS = [
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
  "Flutter",
  "PHP",
  "Ruby",
  "SQL",
  "HTML/CSS",
  "React",
  "Firebase",
  "Node.js",
  "Machine Learning",
  "AI",
  "Other",
];

const EMPTY_FORM = {
  id: null,
  title: "",
  desc: "",
  tech: "",
  language: "",
  customLanguage: "",
  media: "",
  highlights: "",
  github: "",
  demo: "",
};

const formatHighlightsForEdit = (item) => {
  const value = item.highlights || item.features || item.keyFeatures || item.keyPoints || "";

  if (Array.isArray(value)) {
    return value.join("\n");
  }

  return value;
};

export default function Admin() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!supabase) { setAuthLoading(false); return; }
    let active = true;
    let version = 0;
    async function syncSession(nextSession) {
      const requestVersion = ++version;
      setSession(nextSession);
      setIsAdmin(false);
      setAuthLoading(true);
      try {
        if (nextSession) {
          const { data, error: membershipError } = await supabase.from('portfolio_admins')
            .select('user_id').eq('user_id', nextSession.user.id).maybeSingle();
          if (membershipError) throw membershipError;
          if (active && version === requestVersion) setIsAdmin(Boolean(data));
        }
      } catch (err) {
        if (active && version === requestVersion) setError(err.message);
      } finally {
        if (active && version === requestVersion) setAuthLoading(false);
      }
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      // Run queries outside the auth callback to avoid blocking token refresh.
      window.setTimeout(() => { if (active) syncSession(nextSession); }, 0);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  async function signIn(event) {
    event.preventDefault();
    setError("");
    setIsSaving(true);
    try {
      const { error: authError } = await getSupabase().auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      setPassword("");
    } catch (err) { setError(err.message); }
    finally { setIsSaving(false); }
  }

  async function signOut() {
    setError("");
    const { error: authError } = await getSupabase().auth.signOut();
    if (authError) setError(authError.message);
  }

  const [tab, setTab] = useState("projects");
  const [items, setItems] = useState([]);
  const [counts, setCounts] = useState({ projects: 0, blogs: 0 });
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const descRef = useRef(null);

  const isProject = tab === "projects";
  const wordCount = form.desc.trim().split(/\s+/).filter(Boolean).length;
  const titlePlaceholder = isProject
    ? "Project title, example: AI Portfolio Chatbot"
    : "Blog title, example: What I learned building my portfolio";
  const descPlaceholder = isProject
    ? "Write the problem, your role, what you built, and the result..."
    : "Write your intro, main points, lessons learned, and final takeaway...";
  const techTags = form.tech
    .split(",")
    .map((tech) => tech.trim())
    .filter(Boolean);

  useEffect(() => {
    if (isAdmin) loadData().catch((err) => setError(err.message));
  }, [tab, isAdmin]);

  const loadData = async () => {
    const [projects, blogs] = await Promise.all([
      dataService.getProjects(),
      dataService.getBlogs(),
    ]);
    const nextItems = isProject ? projects : blogs;

    setItems(nextItems);
    setCounts({ projects: projects.length, blogs: blogs.length });
  };

  const reset = () => {
    setForm(EMPTY_FORM);
    setEditing(false);
  };

  const getFinalLanguage = () => {
    return form.language === "Other" ? form.customLanguage : form.language;
  };

  const formatDesc = (type) => {
    const textarea = descRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value } = textarea;
    const selectedText = value.slice(selectionStart, selectionEnd);
    let formatted = "";

    switch (type) {
      case "h1":
        formatted = `# ${selectedText || "Heading"}\n`;
        break;
      case "h2":
        formatted = `## ${selectedText || "Heading"}\n`;
        break;
      case "bold":
        formatted = `**${selectedText || "Bold text"}**`;
        break;
      case "italic":
        formatted = `*${selectedText || "Italic text"}*`;
        break;
      case "underline":
        formatted = `<u>${selectedText || "Underline text"}</u>`;
        break;
      case "list":
        formatted = selectedText
          ? selectedText
              .split("\n")
              .map((line) => `- ${line.replace(/^\s*-?\s*/, "")}`)
              .join("\n")
          : "- List item\n- Another item\n";
        break;
      case "quote":
        formatted = selectedText
          ? selectedText
              .split("\n")
              .map((line) => `> ${line}`)
              .join("\n")
          : "> Quote text\n";
        break;
      case "fold":
        formatted = `<details>\n<summary>${selectedText || "Section title"}</summary>\n\n${
          selectedText ? "" : "More details...\n"
        }</details>\n`;
        break;
      default:
        formatted = selectedText;
    }

    const nextValue = value.slice(0, selectionStart) + formatted + value.slice(selectionEnd);
    setForm((prev) => ({ ...prev, desc: nextValue }));

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = selectionStart + formatted.length;
      textarea.selectionStart = cursor;
      textarea.selectionEnd = cursor;
    });
  };

  const insertStarter = () => {
    const starter = isProject
      ? `## Problem\nWhat problem does this project solve?\n\n## What I Built\n- Main feature\n- Tech decision\n- User-facing result\n\n## Tech Stack\nReact, Tailwind CSS, Supabase\n\n## Result\nWhat changed after building it?`
      : `## Quick Summary\nWhat is this post about?\n\n## What I Learned\n- Key lesson one\n- Key lesson two\n- Key lesson three\n\n## Example\nAdd a practical example or code idea here.\n\n## Takeaway\nEnd with one clear lesson.`;

    setForm((prev) => ({
      ...prev,
      desc: prev.desc ? `${prev.desc}\n\n${starter}` : starter,
    }));

    requestAnimationFrame(() => descRef.current?.focus());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isUploading || isSaving) return;
    setError("");
    setIsSaving(true);
    try {
      if (isProject) {
        const project = {
          ...form,
          language: getFinalLanguage(),
          media: form.media?.trim() || "",
          highlights: form.highlights?.trim() || "",
          github: form.github?.trim() || "",
          demo: form.demo?.trim() || "",
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
          highlights: form.highlights?.trim() || "",
        };

        if (editing) {
          await dataService.updateBlog(blog);
        } else {
          await dataService.saveBlog(blog);
        }
      }

      await loadData();
      reset();
    } catch (err) { setError(err.message); }
    finally { setIsSaving(false); }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadError("");
    if (file.size > 50 * 1024 * 1024) {
      setUploadError("Choose a file smaller than 50 MB.");
      return;
    }
    setIsUploading(true);
    try {
      const client = getSupabase();
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
      const path = `media/${tab}/${crypto.randomUUID()}-${cleanName}`;
      const { error: storageError } = await client.storage.from('portfolio-media').upload(path, file);
      if (storageError) throw storageError;
      const { data } = client.storage.from('portfolio-media').getPublicUrl(path);
      setForm((prev) => ({ ...prev, media: data.publicUrl }));
    } catch (err) {
      setUploadError(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id || null,
      title: item.title || "",
      desc: item.desc || item.content || "",
      tech: item.tech || "",
      language: item.language || "",
      customLanguage: item.customLanguage || "",
      media: item.media || "",
      highlights: formatHighlightsForEdit(item),
      github: item.github || item.githubUrl || item.repo || item.repository || "",
      demo: item.demo || item.liveDemo || item.liveUrl || item.url || "",
    });
    setEditing(true);
  };

  const handleDelete = async (id) => {
    if (isSaving) return;
    setIsSaving(true);
    setError("");
    try {
      if (isProject) {
        await dataService.deleteProject(id);
      } else {
        await dataService.deleteBlog(id);
      }

      await loadData();
    } catch (err) { setError(err.message); }
    finally { setIsSaving(false); }
  };

  if (authLoading) return <main className="admin-login"><p>Checking your session…</p></main>;
  if (!supabase || !session || !isAdmin) return (
    <main className="admin-login">
      <h1>Portfolio admin</h1>
      {!supabase ? <p>Add your Supabase URL and publishable key to .env.local, then restart the app.</p>
        : !session ? <form onSubmit={signIn} className="admin-form">
          <label className="field-group"><span>Email</span><input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className="field-group"><span>Password</span><input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          <button className="admin-btn" disabled={isSaving}>{isSaving ? 'Signing in…' : 'Sign in'}</button>
        </form> : <><p>This account does not have admin access. Add it to the admin allowlist in Supabase.</p><button onClick={signOut}>Sign out</button></>}
      {error && <p role="alert" className="admin-upload-error">{error}</p>}
      <button onClick={() => navigate('/')}>Back to portfolio</button>
    </main>
  );

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span>Portfolio CMS</span>
          <h2>ADMIN</h2>
        </div>

        <div className="admin-tabs" aria-label="Content type">
          <button className={isProject ? "active" : ""} disabled={isSaving || isUploading} onClick={() => { reset(); setTab("projects"); }}>
            <span>Projects</span>
            <strong>{counts.projects}</strong>
          </button>

          <button className={!isProject ? "active" : ""} disabled={isSaving || isUploading} onClick={() => { reset(); setTab("blogs"); }}>
            <span>Blogs</span>
            <strong>{counts.blogs}</strong>
          </button>
        </div>

        <div className="admin-list">
          <div className="admin-list-head">
            <div>
              <span>Library</span>
              <h3>{isProject ? "Project Drafts" : "Blog Drafts"}</h3>
            </div>
            <strong>{items.length}</strong>
          </div>

          {items.length === 0 && (
            <div className="admin-empty">
              <strong>{isProject ? "No projects yet" : "No blog posts yet"}</strong>
              <p>
                {isProject
                  ? "Start with one case study: problem, build, stack, and result."
                  : "Use the starter structure to turn a rough idea into a readable post."}
              </p>
            </div>
          )}

          {items.map((item) => (
            <div key={item.id} className="admin-list-item">
              <div className="draft-card-main">
                <div className="draft-card-topline">
                  <span>{item.language || item.date || "Draft"}</span>
                  {item.media && <span>Media</span>}
                </div>
                <h4>{item.title || "Untitled"}</h4>
                <p>{(item.desc || item.content || "No description yet.").slice(0, 96)}</p>
              </div>

              <div className="actions">
                <button type="button" className="edit-action" disabled={isSaving || isUploading} onClick={() => handleEdit(item)}>
                  Edit
                </button>
                <button type="button" className="delete-action" disabled={isSaving || isUploading} onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="exit" onClick={signOut}>Sign out</button>
        <button className="exit" onClick={() => navigate("/")}>
          Exit portfolio
        </button>
      </aside>

      <main className="admin-content">
        <div className="admin-page-header">
          <div>
            <p>{isProject ? "Project builder" : "Blog writer"}</p>
            <h2>{editing ? "Edit" : "Create"} {isProject ? "Project" : "Blog Post"}</h2>
          </div>

          <button type="button" className="ghost-action" onClick={insertStarter}>
            Add starter structure
          </button>
        </div>

        {error && <p role="alert" className="admin-upload-error">{error}</p>}
        <form onSubmit={handleSubmit} className="admin-form">
          <label className="field-group">
            <span>Title</span>
            <input
              placeholder={titlePlaceholder}
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
            />
          </label>

          <div className="editor-shell">
            <div className="editor-pane">
              <div className="admin-toolbar">
                <button type="button" onClick={() => formatDesc("h1")}>H1</button>
                <button type="button" onClick={() => formatDesc("h2")}>H2</button>
                <button type="button" onClick={() => formatDesc("bold")}>Bold</button>
                <button type="button" onClick={() => formatDesc("italic")}>Italic</button>
                <button type="button" onClick={() => formatDesc("underline")}>Underline</button>
                <button type="button" onClick={() => formatDesc("list")}>List</button>
                <button type="button" onClick={() => formatDesc("quote")}>Quote</button>
                <button type="button" onClick={() => formatDesc("fold")}>Fold</button>
              </div>

              <textarea
                ref={descRef}
                placeholder={descPlaceholder}
                value={form.desc}
                onChange={(event) => setForm({ ...form, desc: event.target.value })}
              />

              <div className="editor-meta">
                <span>{wordCount} words</span>
                <span>{form.desc.length} characters</span>
              </div>
            </div>

            <div className="admin-preview">
              <div className="admin-preview-header">Live Preview</div>
              <div
                className="admin-preview-box"
                dangerouslySetInnerHTML={{
                  __html: form.desc
                    ? renderMarkdown(form.desc)
                    : "<p>Your formatted content will appear here.</p>",
                }}
              />
            </div>
          </div>

          <label className="field-group">
            <span>Media</span>
            <input
              placeholder="Media URL or filename, example: demo.mp4 or image.png"
              value={form.media}
              onChange={(event) => setForm({ ...form, media: event.target.value })}
            />
          </label>

          <div className="admin-upload-row">
            <label className="admin-upload-label">
              Upload image/video
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                disabled={isUploading || isSaving}
              />
            </label>
            {isUploading && (
              <div className="upload-progress">

                <small>Uploading…</small>
              </div>
            )}
            {uploadError && <small className="admin-upload-error">{uploadError}</small>}
          </div>

          <label className="field-group">
            <span>{isProject ? "Key Features" : "Key Points"}</span>
            <textarea
              className="admin-small-textarea"
              placeholder={
                isProject
                  ? "One feature per line, example:\nFirebase admin workflow\nResponsive project modal\nGitHub and live demo links"
                  : "One point per line, example:\nWhat I learned\nWhy it matters\nWhat I would improve next"
              }
              value={form.highlights}
              onChange={(event) => setForm({ ...form, highlights: event.target.value })}
            />
          </label>

          {isProject && (
            <>
              <label className="field-group">
                <span>Tech Stack</span>
                <input
                  placeholder="Type comma-separated tags, example: React, Tailwind CSS, Supabase"
                  value={form.tech}
                  onChange={(event) => setForm({ ...form, tech: event.target.value })}
                />
                <div className="tech-tag-preview" aria-label="Tech stack tag preview">
                  {techTags.length === 0 ? (
                    <small>Add technologies separated by commas. They will show as tags here.</small>
                  ) : (
                    techTags.map((tech) => <strong key={tech}>{tech}</strong>)
                  )}
                </div>
              </label>

              <label className="field-group">
                <span>GitHub Repository</span>
                <input
                  placeholder="https://github.com/AbdiazizNor114/BANKINGSYSTEM"
                  value={form.github}
                  onChange={(event) => setForm({ ...form, github: event.target.value })}
                />
              </label>

              <label className="field-group">
                <span>Live Demo</span>
                <input
                  placeholder="https://aziz.smidify.se or deployed project URL"
                  value={form.demo}
                  onChange={(event) => setForm({ ...form, demo: event.target.value })}
                />
              </label>

              <label className="field-group">
                <span>Main Language / Area</span>
                <select
                  value={form.language}
                  onChange={(event) => setForm({ ...form, language: event.target.value })}
                >
                  <option value="">Select Language</option>
                  {LANGUAGE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              {form.language === "Other" && (
                <label className="field-group">
                  <span>Custom Language</span>
                  <input
                    placeholder="Custom language or category"
                    value={form.customLanguage}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        customLanguage: event.target.value,
                      })
                    }
                  />
                </label>
              )}
            </>
          )}

          <div className="admin-actions-row">
            <button className="admin-btn" disabled={isUploading || isSaving}>
              {editing ? "Update content" : `Publish ${isProject ? "project" : "blog"}`}
            </button>

            {editing && (
              <button type="button" className="cancel" onClick={reset}>
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
