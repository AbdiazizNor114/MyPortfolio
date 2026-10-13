import { ChatError, createChatReply } from '../lib/chat.js';
const requests = new Map();
function allowRequest(ip, now = Date.now()) {
  for (const [key, entry] of requests) if (entry.expires <= now) requests.delete(key);
  if (requests.size >= 1000 && !requests.has(ip)) return false;
  const entry = requests.get(ip) || { count: 0, expires: now + 60000 };
  entry.count += 1; requests.set(ip, entry);
  return entry.count <= 15;
}
async function readBody(req) {
  if (req.body !== undefined) {
    if (Buffer.byteLength(typeof req.body === 'string' ? req.body : JSON.stringify(req.body)) > 32000) throw new ChatError('Request is too large.', 413);
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (Buffer.byteLength(body) > 32000) throw new ChatError('Request is too large.', 413);
  }
  return JSON.parse(body || '{}');
}
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  const send = (status, data) => { res.statusCode = status; res.end(JSON.stringify(data)); };
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return send(405, { error: 'Use POST to send a question.' }); }
  const ip = String(req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown');
  if (!allowRequest(ip)) { res.setHeader('Retry-After', '60'); return send(429, { error: 'Please wait a minute before sending more questions.' }); }
  try { return send(200, await createChatReply(await readBody(req))); }
  catch (error) {
    return send(error instanceof ChatError ? error.status : error instanceof SyntaxError ? 400 : 500,
      { error: error instanceof ChatError ? error.message : 'Could not process this question. Please try again.' });
  }
}
