import { mkdirSync, writeFileSync } from 'node:fs';

// Firebase browser configuration is public; override for a different source project.
const projectId = process.env.FIREBASE_PROJECT_ID || 'myportfolio-246aa';
const apiKey = process.env.FIREBASE_API_KEY || 'AIzaSyDuVmLDY8tycpjgeeaZl-YF7MztxEdLj5c';
function decode(value) {
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('timestampValue' in value) return value.timestampValue;
  if ('nullValue' in value) return null;
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(decode);
  if ('mapValue' in value) return Object.fromEntries(Object.entries(value.mapValue.fields || {}).map(([key, v]) => [key, decode(v)]));
  throw new Error('Unsupported Firestore field type. Export stopped to avoid losing data.');
}
const backup = {};
for (const table of ['projects', 'blogs']) {
  backup[table] = [];
  let nextPageToken = '';
  do {
    const url = new URL(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${table}`);
    url.searchParams.set('key', apiKey);
    url.searchParams.set('pageSize', '100');
    if (nextPageToken) url.searchParams.set('pageToken', nextPageToken);
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) throw new Error(`Firebase ${table}: ${data.error?.message || response.status}`);
    for (const doc of data.documents || []) {
      backup[table].push({ ...Object.fromEntries(Object.entries(doc.fields || {}).map(([k, v]) => [k, decode(v)])), id: doc.name.split('/').pop(), created_at: doc.createTime });
    }
    nextPageToken = data.nextPageToken || '';
  } while (nextPageToken);
  console.log(`${table}: ${backup[table].length} exported`);
}
mkdirSync('supabase/backups', { recursive: true });
writeFileSync('supabase/backups/firebase-content.json', JSON.stringify(backup, null, 2));
const quote = (value) => "'" + String(value ?? '').replaceAll("'", "''") + "'";
const text = (value, delimiter = '\n') => Array.isArray(value) ? value.join(delimiter) : String(value ?? '');
const statements = ['begin;'];
for (const table of ['projects', 'blogs']) {
  for (const source of backup[table]) {
    const row = {
      id: source.id, title: text(source.title), desc: text(source.desc || source.content),
      content: text(source.content || source.desc), tech: text(source.tech, ', '),
      language: text(source.language), customLanguage: text(source.customLanguage),
      media: text(source.media || source.image || source.thumbnail || source.cover),
      highlights: text(source.highlights || source.features || source.keyFeatures || source.keyPoints),
      github: text(source.github || source.githubUrl || source.repo || source.repository),
      demo: text(source.demo || source.liveDemo || source.liveUrl || source.url),
      created_at: source.created_at,
    };
    if (table === 'blogs') row.date = text(source.date);
    const columns = Object.keys(row).map((key) => '"' + key + '"').join(', ');
    statements.push(`insert into public.${table} (${columns}) values (${Object.values(row).map(quote).join(', ')}) on conflict (id) do nothing;`);
  }
}
statements.push('commit;');
writeFileSync('supabase/backups/import-content.sql', statements.join('\n'));
console.log('Backup and import SQL saved in supabase/backups (ignored by Git). Existing media URLs retained; files need a separate transfer.');
