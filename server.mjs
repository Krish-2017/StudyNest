import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 3000);
const MAX_BODY_BYTES = 16_000;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

function json(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(payload));
}

function demoReply(question, noteTitle) {
  const source = noteTitle ? `I’m using the selected note, “${noteTitle}”, as context. ` : '';
  return `${source}Demo mode is active because no server-side AI credentials are configured. For “${question}”, start by identifying the core definition, then work through a small example and verify it against your MDU course material.`;
}

async function readJson(req) {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (body.length > MAX_BODY_BYTES) throw new Error('Request body is too large.');
  }
  try { return JSON.parse(body || '{}'); }
  catch { throw new Error('Invalid JSON request body.'); }
}

function extractOpenAIText(data) {
  if (data.output_text) return data.output_text;
  return (data.output || []).flatMap(item => item.content || [])
    .filter(item => item.type === 'output_text')
    .map(item => item.text || '')
    .join('\n') || 'The provider returned no text.';
}

async function callOpenAI(question, noteTitle) {
  const instructions = 'You are StudyNest AI, a clear and supportive MDU B.Tech study assistant. Explain engineering topics accurately, use concise steps, and remind students to verify important answers with prescribed course materials.';
  const input = noteTitle ? `Selected note: ${noteTitle}\n\nStudent question: ${question}` : question;
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-5-mini', instructions, input, store: false }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'OpenAI request failed.');
  return extractOpenAIText(data);
}

async function callGemini(question, noteTitle) {
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: 'You are StudyNest AI, a clear and supportive MDU B.Tech study assistant. Explain engineering topics accurately, use concise steps, and remind students to verify important answers with prescribed course materials.' }] },
      contents: [{ role: 'user', parts: [{ text: noteTitle ? `Selected note: ${noteTitle}\n\nStudent question: ${question}` : question }] }],
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Gemini request failed.');
  return data.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('\n') || 'The provider returned no text.';
}

async function handleAI(req, res) {
  try {
    const { question, noteTitle } = await readJson(req);
    if (typeof question !== 'string' || question.trim().length < 2 || question.length > 4_000) {
      return json(res, 400, { error: 'Enter a question between 2 and 4,000 characters.' });
    }
    const provider = (process.env.AI_PROVIDER || '').toLowerCase();
    if (provider === 'openai' && process.env.OPENAI_API_KEY) {
      return json(res, 200, { answer: await callOpenAI(question.trim(), noteTitle), provider: 'openai', grounded: Boolean(noteTitle), demo: false });
    }
    if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
      return json(res, 200, { answer: await callGemini(question.trim(), noteTitle), provider: 'gemini', grounded: Boolean(noteTitle), demo: false });
    }
    return json(res, 200, { answer: demoReply(question.trim(), noteTitle), provider: 'demo', grounded: Boolean(noteTitle), demo: true });
  } catch (error) {
    console.error('AI request failed:', error.message);
    return json(res, 502, { error: 'The AI service is unavailable. Check provider credentials and try again.' });
  }
}

async function serveStatic(req, res) {
  const requested = req.url === '/' ? 'index.html' : req.url.split('?')[0].replace(/^\/+/, '');
  const safePath = normalize(join(root, requested));
  if (!safePath.startsWith(root)) return json(res, 403, { error: 'Forbidden' });
  try {
    const file = await readFile(safePath);
    const info = await stat(safePath);
    if (!info.isFile()) throw new Error('Not a file');
    res.writeHead(200, { 'Content-Type': mimeTypes[extname(safePath)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
    res.end(file);
  } catch {
    if (extname(requested)) return json(res, 404, { error: 'Not found' });
    const app = await readFile(join(root, 'index.html'));
    res.writeHead(200, { 'Content-Type': mimeTypes['.html'], 'X-Content-Type-Options': 'nosniff' });
    res.end(app);
  }
}

const server = createServer(async (req, res) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:");
  if (req.method === 'GET' && req.url === '/api/health') return json(res, 200, { ok: true, provider: process.env.AI_PROVIDER || 'demo' });
  if (req.method === 'POST' && req.url === '/api/ai') return handleAI(req, res);
  if (req.method === 'GET' || req.method === 'HEAD') return serveStatic(req, res);
  return json(res, 405, { error: 'Method not allowed' });
});

server.listen(port, () => console.log(`StudyNest is running at http://localhost:${port}`));
