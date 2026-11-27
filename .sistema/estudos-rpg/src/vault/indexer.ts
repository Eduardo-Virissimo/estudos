// Lê o vault e monta o Snapshot. Descobre tudo DINAMICAMENTE pelas propriedades:
//   tipo: trilha  -> trilha de estudo (vira reino no mapa)
//   nivel: ...    -> nota de estudo (entra em revisão, XP e perguntas)
//   <pastaDiario>/YYYY-MM-DD.md com minutos > 0 -> dia de estudo
// Criou uma nota nova com essas propriedades? Ela aparece sozinha.

import { type App, TFile, normalizePath } from "obsidian";
import { parseISO } from "../domain/dates.ts";
import { parsePerguntas, parseTempo, parseTempoRever, parseTrilha } from "../domain/parse.ts";
import { normalizarCaixa } from "../domain/review.ts";
import { NIVEIS, type DiaDiario, type Nivel, type NotaEstudo, type Pergunta, type Snapshot, type Trilha } from "../domain/types.ts";
import type { Settings } from "../settings.ts";

type Frontmatter = Record<string, unknown>;
interface CorpoLido { mtime: number; perguntas: Pergunta[]; tempo: string | null; tempoRever: string | null }

export class Indexer {
  /** Cache do que vem do corpo da nota (perguntas e tempo): só relê o arquivo se ele mudou. */
  private cacheCorpo = new Map<string, CorpoLido>();

  constructor(private app: App, private getSettings: () => Settings) {}

  async construir(hoje: string): Promise<Snapshot> {
    const s = this.getSettings();
    const ignoradas = s.pastasIgnoradas.map((p) => normalizePath(p).toLowerCase()).filter(Boolean);
    const ignorar = (f: TFile) => ignoradas.some((p) => f.path.toLowerCase() === p || f.path.toLowerCase().startsWith(p + "/"));
    const arquivos = this.app.vault.getMarkdownFiles().filter((f) => !ignorar(f));

    const trilhas: Trilha[] = [];
    const candidatasEstudo: { f: TFile; fm: Frontmatter; nivel: Nivel }[] = [];
    const diario = new Map<string, DiaDiario>();
    const pastaDiario = normalizePath(s.pastaDiario);

    for (const f of arquivos) {
      const fm = this.fm(f);
      const tipo = String(fm.tipo ?? "").toLowerCase().trim();

      if (f.parent?.path === pastaDiario) {
        // Só é dia de estudo se tiver minutos: abrir o diário sem estudar não vale XP nem sequência.
        const data = parseISO(f.basename);
        const minutos = num(fm.minutos, 0);
        if (data && minutos > 0) diario.set(data, { data, caminho: f.path, minutos });
        continue;
      }
      if (tipo === "trilha") {
        const texto = await this.app.vault.cachedRead(f);
        trilhas.push({ caminho: f.path, nome: String(fm.nome ?? f.basename), regioes: parseTrilha(texto, (alvo) => this.resolver(alvo, f.path)) });
      }
      const nivel = String(fm.nivel ?? "").toLowerCase().trim() as Nivel;
      if (NIVEIS.includes(nivel)) candidatasEstudo.push({ f, fm, nivel });
    }

    // Área de cada nota = região da trilha que aponta para ela.
    const areaPorCaminho = new Map<string, string>();
    for (const t of trilhas) for (const r of t.regioes) for (const tp of r.topicos) if (tp.caminho) areaPorCaminho.set(tp.caminho, r.nome);

    const notas: NotaEstudo[] = [];
    const perguntas: Pergunta[] = [];
    for (const { f, fm, nivel } of candidatasEstudo) {
      const lido = await this.lerCorpo(f);
      perguntas.push(...lido.perguntas);
      notas.push({
        caminho: f.path,
        label: rotulo(f),
        nivel,
        caixa: normalizarCaixa(fm.caixa, s.intervalos),
        revisado: parseISO(fm.revisado),
        area: areaPorCaminho.get(f.path) ?? null,
        tempo: lido.tempo,
        tempoRever: lido.tempoRever,
      });
    }

    trilhas.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    notas.sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
    return { hoje, trilhas, notas, perguntas, diario };
  }

  /** Esquece arquivos apagados/renomeados do cache. */
  esquecer(caminho: string) {
    this.cacheCorpo.delete(caminho);
  }

  /** Perguntas e tempo de estudo do corpo da nota. Só relê o arquivo se ele mudou. */
  private async lerCorpo(f: TFile): Promise<CorpoLido> {
    const c = this.cacheCorpo.get(f.path);
    if (c && c.mtime === f.stat.mtime) return c;
    const texto = await this.app.vault.cachedRead(f);
    const lido = {
      mtime: f.stat.mtime,
      perguntas: parsePerguntas(texto).map((p) => ({ ...p, caminho: f.path, nota: rotulo(f) })),
      tempo: parseTempo(texto),
      tempoRever: parseTempoRever(texto),
    };
    this.cacheCorpo.set(f.path, lido);
    return lido;
  }

  private fm(f: TFile): Frontmatter {
    return (this.app.metadataCache.getFileCache(f)?.frontmatter as Frontmatter | undefined) ?? {};
  }

  /** Resolve `[[Alvo]]` como o Obsidian resolve; se não achar, tenta uma pasta `Alvo/README.md`. */
  private resolver(alvo: string, origem: string): string | null {
    const direto = this.app.metadataCache.getFirstLinkpathDest(alvo, origem);
    if (direto) return direto.path;
    const chave = normalizar(alvo);
    const readme = this.app.vault.getMarkdownFiles().find((f) => f.basename.toLowerCase() === "readme" && f.parent && normalizar(f.parent.name) === chave);
    return readme?.path ?? null;
  }
}

/** Nome amigável: "README" vira o nome da pasta. */
export function rotulo(f: TFile): string {
  return f.basename.toLowerCase() === "readme" && f.parent ? f.parent.name : f.basename;
}

function num(v: unknown, padrao = 0): number {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : padrao;
}

/** "VS Code" e "VsCode" e "01 - VsCode" batem. */
function normalizar(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/^\s*\d+\s*-\s*/, "").replace(/[^a-z0-9]/gi, "").toLowerCase();
}
