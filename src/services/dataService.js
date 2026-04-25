const PROJECT_KEY = "projects";
const BLOG_KEY = "blogs";

export const dataService = {
  getProjects: () => JSON.parse(localStorage.getItem(PROJECT_KEY)) || [],
  getBlogs: () => JSON.parse(localStorage.getItem(BLOG_KEY)) || [],

  saveProject: (project) => {
    const data = dataService.getProjects();
    data.push(project);
    localStorage.setItem(PROJECT_KEY, JSON.stringify(data));
  },

  saveBlog: (blog) => {
    const data = dataService.getBlogs();
    data.push(blog);
    localStorage.setItem(BLOG_KEY, JSON.stringify(data));
  }
};