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

async function install() {
  await mkdir(pluginDir, { recursive: true });
  await Promise.all([
    copyFile(path.join(here, "dist", "main.js"), path.join(pluginDir, "main.js")),
    copyFile(path.join(here, "manifest.json"), path.join(pluginDir, "manifest.json")),
    copyFile(path.join(here, "styles.css"), path.join(pluginDir, "styles.css")),
  ]);
  console.log(`[estudos-rpg] instalado em ${pluginDir}`);
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
