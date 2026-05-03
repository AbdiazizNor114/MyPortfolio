import { spawn } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const processes = [
  spawn(process.execPath, ["server.js"], {
    env: { ...process.env, PORT: "8787", NODE_ENV: "development" },
    stdio: "inherit",
  }),
  spawn(npmCommand, ["run", "vite", "--", "--host", "127.0.0.1"], {
    stdio: "inherit",
  }),
];

function shutdown(signal) {
  for (const child of processes) {
    child.kill(signal);
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

for (const child of processes) {
  child.on("exit", (code) => {
    if (code && code !== 0) {
      shutdown("SIGTERM");
      process.exit(code);
    }
  });
}
