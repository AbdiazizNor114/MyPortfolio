import { createServer } from "node:http";
import handleChat from "./api/chat.js";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const rootDir = resolve(process.cwd());
const distDir = join(rootDir, "dist");
const port = Number(process.env.PORT || 8787);

loadLocalEnv();

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
    if (new URL(req.url, "http://localhost").pathname === "/api/chat") {
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
