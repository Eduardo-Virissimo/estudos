// Build do plugin: junta src/ num main.js e instala na pasta de plugins do vault.
//   node esbuild.config.mjs           -> build único (produção)
//   node esbuild.config.mjs --watch   -> recompila a cada mudança (desenvolvimento)
import esbuild from "esbuild";
import { copyFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const watch = process.argv.includes("--watch");

// Este projeto fica em <vault>/estudos/.sistema/estudos-rpg. O vault é 3 pastas acima.
// E se o vault estiver em outro lugar? Defina a variável OBSIDIAN_VAULT com o caminho dele.
const vault = process.env.OBSIDIAN_VAULT ?? path.resolve(here, "..", "..", "..");
const pluginDir = path.join(vault, ".obsidian", "plugins", "estudos-rpg");
if (!existsSync(path.join(vault, ".obsidian"))) {
  console.error(`Não achei ${path.join(vault, ".obsidian")}. Defina OBSIDIAN_VAULT=<pasta do vault>.`);
  process.exit(1);
}

// Cópia no backup do repositório (estudos/Configs/obsidian/...), para restaurar num PC novo
// sem precisar compilar. Fica dentro do repo, então vai pro Git junto com o código.
const backupDir = path.resolve(here, "..", "..", "Configs", "obsidian", "plugins", "estudos-rpg");

async function install() {
  for (const destino of [pluginDir, backupDir]) {
    await mkdir(destino, { recursive: true });
    await Promise.all(["main.js", "manifest.json", "styles.css"].map((nome) =>
      copyFile(path.join(here, nome === "main.js" ? "dist" : ".", nome), path.join(destino, nome))));
    console.log(`[estudos-rpg] instalado em ${destino}`);
  }
}

const ctx = await esbuild.context({
  entryPoints: [path.join(here, "src", "main.ts")],
  bundle: true,
  format: "cjs",
  platform: "browser",
  target: "es2022",
  outfile: path.join(here, "dist", "main.js"),
  external: ["obsidian", "electron", "@codemirror/*", "@lezer/*"],
  sourcemap: watch ? "inline" : false,
  minify: false, // código legível no main.js instalado: ajuda a depurar
  logLevel: "info",
  plugins: [{ name: "install", setup: (b) => b.onEnd((r) => { if (!r.errors.length) return install(); }) }],
});

if (watch) {
  await ctx.watch();
} else {
  await ctx.rebuild();
  await ctx.dispose();
}
