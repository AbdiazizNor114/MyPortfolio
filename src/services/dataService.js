import { getSupabase } from '../supabase';

const fields = ['title', 'desc', 'content', 'date', 'tech', 'language', 'customLanguage', 'media', 'highlights', 'github', 'demo'];
function payload(item, table) {
  return Object.fromEntries(fields
    .filter((field) => (table === 'blogs' || field !== 'date') && item[field] !== undefined)
    .map((field) => [field, item[field] ?? '']));
}
async function read(table, column) {
  const { data, error } = await getSupabase().from(table).select('*').order(column, { ascending: column === 'media' });
  if (error) throw error;
  return data;
}
async function save(table, item) {
  const { data, error } = await getSupabase().from(table).insert(payload(item, table)).select('id').single();
  if (error) throw error;
  return data.id;
}
async function update(table, item) {
  const { error } = await getSupabase().from(table).update(payload(item, table)).eq('id', String(item.id)).select('id').single();
  if (error) throw error;
}
async function remove(table, id) {
  const { error } = await getSupabase().from(table).delete().eq('id', String(id)).select('id').single();
  if (error) throw error;
}
export const dataService = {
  getProjects: () => read('projects', 'media'),
  getBlogs: () => read('blogs', 'created_at'),
  saveProject: (item) => save('projects', item),
  saveBlog: (item) => save('blogs', item),
  updateProject: (item) => update('projects', item),
  updateBlog: (item) => update('blogs', item),
  deleteProject: (id) => remove('projects', id),
  deleteBlog: (id) => remove('blogs', id),
};
