import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

const PROJECT_COLLECTION = "projects";
const BLOG_COLLECTION = "blogs";

const readCollection = async (name) => {
  const snap = await getDocs(collection(db, name));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const dataService = {
  // ================= READ =================
  getProjects: async () => {
    const q = query(collection(db, PROJECT_COLLECTION), orderBy("media", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },
  getBlogs: async () => readCollection(BLOG_COLLECTION),

  // ================= CREATE =================
  saveProject: async (project) => {
    const { id, ...payload } = project;
    const created = await addDoc(collection(db, PROJECT_COLLECTION), payload);
    return created.id;
  },

  saveBlog: async (blog) => {
    const { id, ...payload } = blog;
    const created = await addDoc(collection(db, BLOG_COLLECTION), payload);
    return created.id;
  },

  // ================= DELETE =================
  deleteProject: async (id) => {
    await deleteDoc(doc(db, PROJECT_COLLECTION, String(id)));
  },

  deleteBlog: async (id) => {
    await deleteDoc(doc(db, BLOG_COLLECTION, String(id)));
  },

  // ================= UPDATE =================
  updateProject: async (updated) => {
    const { id, ...payload } = updated;
    await updateDoc(doc(db, PROJECT_COLLECTION, String(id)), payload);
  },

  updateBlog: async (updated) => {
    const { id, ...payload } = updated;
    await updateDoc(doc(db, BLOG_COLLECTION, String(id)), payload);
  },
};