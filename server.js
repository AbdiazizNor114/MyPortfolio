import { createServer } from "node:http";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const rootDir = resolve(process.cwd());
const distDir = join(rootDir, "dist");
const port = Number(process.env.PORT || 8787);

loadLocalEnv();

const SYSTEM_PROMPT = [
  "You are Abdiaziz Nor, a system developer specializing in backend development, APIs, databases, machine learning, and AI-powered systems.",
  "Speak in first person as Abdiaziz. Be friendly, direct, and helpful.",
  "You can answer questions about the portfolio, projects, skills, experience, and general software topics.",
  "Do not say you are OpenAI or an AI assistant unless the user directly asks how this chat works.",
].join(" ");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
};

createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/api/chat") {
      await handleChat(req, res);
      return;
    }

    if (req.method === "GET") {
      serveStatic(req, res);
      return;
    }

    sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: "Server error. Please try again." });
  }
}).listen(port, () => {
  console.log(`Portfolio server running at http://127.0.0.1:${port}`);
});

async function handleChat(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    sendJson(res, 500, { error: "OpenAI API key is missing. Add OPENAI_API_KEY to .env.local." });
    return;
  }

  const body = await readJson(req);
  const userMessages = Array.isArray(body.messages) ? body.messages : [];
  const input = userMessages
    .filter((message) => message?.text && ["user", "bot"].includes(message.sender))
    .slice(-10)
    .map((message) => ({
      role: message.sender === "user" ? "user" : "assistant",
      content: message.text,
    }));

  if (!input.length || input[input.length - 1].role !== "user") {
    sendJson(res, 400, { error: "Message is required." });
    return;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions: SYSTEM_PROMPT,
      input,
      max_output_tokens: 500,
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    sendJson(res, response.status, { error: data.error?.message || "OpenAI request failed." });
    return;
  }

  sendJson(res, 200, { text: getResponseText(data) });
}

function getResponseText(data) {
  if (data.output_text) return data.output_text;

  return (
    data.output
      ?.flatMap((item) => item.content || [])
      .map((content) => content.text)
      .filter(Boolean)
      .join("\n") || "I could not generate a response. Please try again."
  );
}

function readJson(req) {
  return new Promise((resolveBody, rejectBody) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 100_000) {
        req.destroy();
        rejectBody(new Error("Request body too large"));
      }
    });

    req.on("end", () => {
      try {
        resolveBody(body ? JSON.parse(body) : {});
      } catch {
        rejectBody(new Error("Invalid JSON body"));
      }
    });

    req.on("error", rejectBody);
  });
}

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  const requestedPath = urlPath === "/" ? "/index.html" : urlPath;
  let filePath = resolve(join(distDir, requestedPath));

  if (!filePath.startsWith(distDir) || !existsSync(filePath)) {
    filePath = join(distDir, "index.html");
  }

  if (!existsSync(filePath)) {
    sendJson(res, 404, { error: "Build the app first with npm run build." });
    return;
  }

  res.writeHead(200, {
    "Content-Type": MIME_TYPES[extname(filePath)] || "application/octet-stream",
  });
  createReadStream(filePath).pipe(res);
}

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function loadLocalEnv() {
  const envPath = join(rootDir, ".env.local");
  if (!existsSync(envPath)) return;

  const envFile = readFileSync(envPath, "utf8");

  for (const line of envFile.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}
