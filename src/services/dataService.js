const PROJECT_KEY = "projects";
const BLOG_KEY = "blogs";

const get = (key) =>
  JSON.parse(localStorage.getItem(key)) || [];

const set = (key, data) =>
  localStorage.setItem(key, JSON.stringify(data));

export const dataService = {
  // ================= READ =================
  getProjects: () => get(PROJECT_KEY),
  getBlogs: () => get(BLOG_KEY),

  // ================= CREATE =================
  saveProject: (project) => {
    const data = get(PROJECT_KEY);
    data.push(project);
    set(PROJECT_KEY, data);
  },

  saveBlog: (blog) => {
    const data = get(BLOG_KEY);
    data.push(blog);
    set(BLOG_KEY, data);
  },

  // ================= DELETE =================
  deleteProject: (id) => {
    const data = get(PROJECT_KEY).filter((p) => p.id !== id);
    set(PROJECT_KEY, data);
  },

  deleteBlog: (id) => {
    const data = get(BLOG_KEY).filter((b) => b.id !== id);
    set(BLOG_KEY, data);
  },

  // ================= UPDATE =================
  updateProject: (updated) => {
    const data = get(PROJECT_KEY).map((p) =>
      p.id === updated.id ? updated : p
    );
    set(PROJECT_KEY, data);
  },

  updateBlog: (updated) => {
    const data = get(BLOG_KEY).map((b) =>
      b.id === updated.id ? updated : b
    );
    set(BLOG_KEY, data);
  },
};