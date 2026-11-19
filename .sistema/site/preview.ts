/**
 * Pré-visualização local: gera o site e serve a pasta dist/, sem esperar o deploy.
 *
 *   npm run preview            (porta 4321)
 *   npm run preview -- 5000    (outra porta)
 *
 * Mostra dois endereços: um pro computador e outro pro celular (mesma rede Wi-Fi).
 * Ao salvar uma nota ou o CSS, rode de novo (Ctrl+C e npm run preview) pra gerar outra vez.
 */
import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { networkInterfaces } from "node:os";
import path from "node:path";

const aqui = import.meta.dirname;
const DIST = path.join(aqui, "dist");
const PORTA = Number(process.argv[2]) || 4321;

execFileSync(process.execPath, [path.join(aqui, "build.ts")], { stdio: "inherit" });

const TIPOS: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

createServer(async (req, res) => {
  let caminho: string;
  try {
    caminho = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
  } catch {
    res.writeHead(400).end();
    return;
  }
  if (caminho.endsWith("/")) caminho += "index.html";
  const arquivo = path.join(DIST, caminho);
  // Nada fora de dist/ (ex.: /../../segredo).
  if (!arquivo.startsWith(DIST + path.sep)) {
    res.writeHead(403).end();
    return;
  }
  try {
    const corpo = await readFile(arquivo);
    res.writeHead(200, { "content-type": TIPOS[path.extname(arquivo).toLowerCase()] ?? "application/octet-stream", "cache-control": "no-store" });
    res.end(corpo);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Página não encontrada");
  }
}).listen(PORTA, "0.0.0.0", () => {
  const redes = Object.values(networkInterfaces())
    .flat()
    .filter((r) => r && r.family === "IPv4" && !r.internal)
    .map((r) => r!.address);
  console.log(`\n👀 Pré-visualização no ar (Ctrl+C pra parar)`);
  console.log(`   Computador: http://localhost:${PORTA}/`);
  for (const ip of redes) console.log(`   Celular:    http://${ip}:${PORTA}/   (mesma rede Wi-Fi)`);
});
