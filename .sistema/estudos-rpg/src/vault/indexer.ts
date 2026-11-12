// Lê o vault e monta o Snapshot. Descobre tudo DINAMICAMENTE pelas propriedades:
//   tipo: trilha  -> trilha de estudo (vira reino no mapa)
//   tipo: missao  -> projeto com fases (vira missão)
//   nivel: ...    -> nota de estudo (entra em revisão, XP e perguntas)
//   <pastaDiario>/YYYY-MM-DD.md -> dia de estudo
// Criou uma nota nova com essas propriedades? Ela aparece sozinha.

import { type App, TFile, normalizePath } from "obsidian";
import { parseISO } from "../domain/dates.ts";
import { parseMissao, parsePerguntas, parseTrilha } from "../domain/parse.ts";
import { normalizarCaixa } from "../domain/review.ts";
import { NIVEIS, type DiaDiario, type Missao, type Nivel, type NotaEstudo, type Pergunta, type Snapshot, type Trilha } from "../domain/types.ts";
import type { Settings } from "../settings.ts";

type Frontmatter = Record<string, unknown>;

export class Indexer {
  /** Cache das perguntas por arquivo: só relê o arquivo se ele mudou. */
  private cachePerguntas = new Map<string, { mtime: number; itens: Pergunta[] }>();

  constructor(private app: App, private getSettings: () => Settings) {}

  async construir(hoje: string): Promise<Snapshot> {
    const s = this.getSettings();
    const ignoradas = s.pastasIgnoradas.map((p) => normalizePath(p).toLowerCase()).filter(Boolean);
    const ignorar = (f: TFile) => ignoradas.some((p) => f.path.toLowerCase() === p || f.path.toLowerCase().startsWith(p + "/"));
    const arquivos = this.app.vault.getMarkdownFiles().filter((f) => !ignorar(f));

    const trilhas: Trilha[] = [];
    const missoes: Missao[] = [];
    const candidatasEstudo: { f: TFile; fm: Frontmatter; nivel: Nivel }[] = [];
    const diario = new Map<string, DiaDiario>();
    const pastaDiario = normalizePath(s.pastaDiario);

    for (const f of arquivos) {
      const fm = this.fm(f);
      const tipo = String(fm.tipo ?? "").toLowerCase().trim();

      if (f.parent?.path === pastaDiario) {
        const data = parseISO(f.basename);
        if (data) diario.set(data, {
          data, caminho: f.path,
          minutos: num(fm.minutos, 25), treinos: num(fm.treinos), acertos: num(fm.acertos), perfeitos: num(fm.perfeitos),
        });
        continue;
      }
      if (tipo === "trilha") {
        const texto = await this.app.vault.cachedRead(f);
        trilhas.push({ caminho: f.path, nome: String(fm.nome ?? f.basename), regioes: parseTrilha(texto, (alvo) => this.resolver(alvo, f.path)) });
      } else if (tipo === "missao" || tipo === "missão") {
        if (fm.ativa === false) continue;
        const texto = await this.app.vault.cachedRead(f);
        missoes.push({ caminho: f.path, nome: String(fm.nome ?? f.basename), prioridade: num(fm.prioridade, 100), fases: parseMissao(texto) });
      }
      const nivel = String(fm.nivel ?? "").toLowerCase().trim() as Nivel;
      if (NIVEIS.includes(nivel)) candidatasEstudo.push({ f, fm, nivel });
    }

    // Área de cada nota = região da trilha que aponta para ela.
    const areaPorCaminho = new Map<string, string>();
    for (const t of trilhas) for (const r of t.regioes) for (const tp of r.topicos) if (tp.caminho) areaPorCaminho.set(tp.caminho, r.nome);

    const notas: NotaEstudo[] = candidatasEstudo.map(({ f, fm, nivel }) => ({
      caminho: f.path,
      label: rotulo(f),
      nivel,
      caixa: normalizarCaixa(fm.caixa, s.intervalos),
      revisado: parseISO(fm.revisado),
      area: areaPorCaminho.get(f.path) ?? null,
    }));

    const perguntas: Pergunta[] = [];
    for (const { f } of candidatasEstudo) perguntas.push(...(await this.perguntasDe(f)));

    trilhas.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    missoes.sort((a, b) => a.prioridade - b.prioridade || a.nome.localeCompare(b.nome, "pt-BR"));
    notas.sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
    return { hoje, trilhas, missoes, notas, perguntas, diario };
  }

  /** Esquece arquivos apagados/renomeados do cache. */
  esquecer(caminho: string) {
    this.cachePerguntas.delete(caminho);
  }

  private async perguntasDe(f: TFile): Promise<Pergunta[]> {
    const c = this.cachePerguntas.get(f.path);
    if (c && c.mtime === f.stat.mtime) return c.itens;
    const texto = await this.app.vault.cachedRead(f);
    const itens = parsePerguntas(texto).map((p) => ({ ...p, caminho: f.path, nota: rotulo(f) }));
    this.cachePerguntas.set(f.path, { mtime: f.stat.mtime, itens });
    return itens;
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
