const { spawn } = require("child_process");
const path = require("path");

const frontendDir = path.join(__dirname, "..", "frontend");
const viteBin = process.platform === "win32"
  ? path.join(frontendDir, "node_modules", "vite", "bin", "vite.js")
  : path.join(frontendDir, "node_modules", "vite", "bin", "vite.js");

const child = spawn(process.execPath, [viteBin, "--host", "127.0.0.1"], {
  cwd: frontendDir,
  stdio: "inherit",
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});