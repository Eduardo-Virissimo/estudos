// As seções da Ficha. Cada função desenha uma parte e não sabe das outras.
// O encaixe na tela (sem rolagem) é feito em view.ts + styles.css.

import { MarkdownRenderer } from "obsidian";
import { addDias, diffDias, relativo } from "../domain/dates.ts";
import { semWikilinks } from "../domain/parse.ts";
import { indiceDoDia } from "../domain/quiz.ts";
import { infoRevisao, ordenarFila } from "../domain/review.ts";
import type { Topico, Trilha } from "../domain/types.ts";
import type { Ctx } from "./context.ts";
import { barra, botao, icone, ornamento, painel, vazio } from "./dom.ts";

const NOME_NIVEL = { escrito: "escrito", praticado: "praticado", projeto: "em projeto" } as const;
const RARIDADE = { comum: "Comum", raro: "Raro", epico: "Épico", lendario: "Lendário" } as const;

function md(ctx: Ctx, el: HTMLElement, texto: string, origem: string) {
  void MarkdownRenderer.render(ctx.app, texto, el, origem, ctx.comp);
}

// ---------------------------------------------------------------- Faixa do topo
export function ficha(root: HTMLElement, ctx: Ctx) {
  const { prog } = ctx;
  const sec = root.createEl("header", { cls: "erpg-ficha" });

  const brasao = sec.createDiv({ cls: "erpg-brasao", attr: { "aria-label": `Nível ${prog.nivel}` } });
  brasao.createSpan({ cls: "erpg-brasao-rot", text: "Nv" });
  brasao.createSpan({ cls: "erpg-brasao-num", text: String(prog.nivel) });

  const id = sec.createDiv({ cls: "erpg-ficha-id" });
  id.createEl("h1", { cls: "erpg-titulo", text: prog.titulo });
  const p = prog.partes;
  const origemXP = `De onde vem o XP — notas ${p.notas} · tópicos ${p.topicos} · diário ${p.diario} · revisões ${p.revisao} · missões ${p.missoes}`;
  const xp = id.createDiv({ cls: "erpg-xp", attr: { title: origemXP } });
  barra(xp, (prog.xp - prog.xpNivel) / (prog.xpProximo - prog.xpNivel), "erpg-barra is-xp", "Experiência até o próximo nível");
  xp.createSpan({ cls: "erpg-xp-num", text: `${prog.xp} / ${prog.xpProximo} XP` });

  const st = id.createDiv({ cls: "erpg-atributos" });
  const atributo = (ic: string, valor: string | number, rot: string, cls = "") => {
    const a = st.createDiv({ cls: `erpg-atributo ${cls}`.trim(), attr: { title: `${valor} ${rot}` } });
    icone(a, ic);
    a.createSpan({ cls: "erpg-atributo-val", text: String(valor) });
    a.createSpan({ cls: "erpg-atributo-rot", text: rot });
  };
  atributo("flame", prog.sequencia, prog.sequencia === 1 ? "dia seguido" : "dias seguidos", prog.sequencia ? "is-chama" : "");
  atributo("scroll-text", prog.contagemNivel.escrito, "escritas");
  atributo("hammer", prog.contagemNivel.praticado, "praticadas");
  atributo("castle", prog.contagemNivel.projeto, "em projeto");

  medalhas(sec, ctx);

  const acao = sec.createDiv({ cls: "erpg-ficha-acao" });
  botao(acao, prog.estudouHoje ? "Diário de hoje" : `Começar sessão · +${ctx.settings.xp.diario} XP`, () => ctx.acoes.iniciarDia(), { icone: prog.estudouHoje ? "book-open" : "play" });
}

/** Conquistas como medalhas pequenas; nome, raridade e regra aparecem ao passar o mouse. */
function medalhas(parent: HTMLElement, ctx: Ctx) {
  const ok = ctx.conquistas.filter((c) => c.ok).length;
  const box = parent.createDiv({ cls: "erpg-medalhas" });
  box.createDiv({ cls: "erpg-rotulo", text: `Conquistas ${ok}/${ctx.conquistas.length}` });
  const fila = box.createDiv({ cls: "erpg-medalhas-fila" });
  for (const c of ctx.conquistas) {
    const desc = `${c.nome} · ${RARIDADE[c.raridade]}\n${c.desc}${c.ok ? "\n✓ Conquistado" : ""}`;
    const m = fila.createDiv({ cls: `erpg-medalha is-${c.raridade}${c.ok ? " is-ok" : ""}`, attr: { title: desc, "aria-label": desc } });
    icone(m, c.ok ? c.icone : "lock");
  }
}

// ---------------------------------------------------------------- Missão
export function missao(root: HTMLElement, ctx: Ctx) {
  const ativa = ctx.snap.missoes.map((m) => ({ m, f: m.fases.find((f) => f.tarefas.some((t) => !t.feita)) })).find((x) => x.f);
  const corpo = painel(root, "swords", "Missão", ativa ? `${ativa.m.nome} · Fase ${ativa.f!.num}` : undefined, "is-missao");

  if (!ctx.snap.missoes.length) {
    vazio(corpo, "Nenhuma missão.", "Crie uma nota com a propriedade tipo: missao, seções “## Fase 1: …” e tarefas “- [ ] …”.");
  } else if (!ativa || !ativa.f) {
    vazio(corpo, "Todas as missões concluídas.");
  } else {
    const { m, f } = ativa;
    corpo.createDiv({ cls: "erpg-missao-titulo", text: f.titulo || `Fase ${f.num}` });
    if (f.entrega) md(ctx, corpo.createDiv({ cls: "erpg-missao-entrega" }), `**Entrega:** ${f.entrega}`, m.caminho);

    const feitas = f.tarefas.filter((t) => t.feita).length;
    const prog = corpo.createDiv({ cls: "erpg-linha" });
    barra(prog, feitas / f.tarefas.length, "erpg-barra", "Progresso da fase");
    prog.createSpan({ cls: "erpg-num", text: `${feitas}/${f.tarefas.length}` });

    const ul = corpo.createEl("ul", { cls: "erpg-tarefas erpg-rola" });
    for (const t of f.tarefas) {
      const li = ul.createEl("li", { cls: t.feita ? "is-feita" : "" });
      const chk = li.createEl("button", { cls: "erpg-check", attr: { "aria-label": t.feita ? "Desfazer tarefa" : "Concluir tarefa", "aria-pressed": String(t.feita) } });
      icone(chk, "check");
      chk.addEventListener("click", () => ctx.acoes.alternarTarefa(m, t));
      md(ctx, li.createDiv({ cls: "erpg-tarefa-txt" }), semWikilinks(t.texto), m.caminho);
      li.createSpan({ cls: "erpg-num is-ouro", text: `+${ctx.settings.xp.tarefa}` });
    }

    const rodape = corpo.createDiv({ cls: "erpg-acoes" });
    botao(rodape, "Abrir missão", (ev) => ctx.acoes.abrirNota(m.caminho, ev.ctrlKey || ev.metaKey), { variante: "secundario", icone: "external-link", pequeno: true });
    const outras = ctx.snap.missoes.filter((x) => x !== m && x.fases.some((ff) => ff.tarefas.some((t) => !t.feita)));
    if (outras.length) rodape.createSpan({ cls: "erpg-dica", text: `Outras: ${outras.map((x) => x.nome).join(", ")}` });
  }

  // Próximo tópico sugerido (primeiro não feito das trilhas)
  const prox = proximoTopico(ctx.snap.trilhas);
  if (prox) {
    ornamento(corpo);
    corpo.createDiv({ cls: "erpg-subtitulo", text: "Próximo tópico" });
    topico(corpo, ctx, prox.trilha, prox.topico, prox.regiao);
  }
}

function proximoTopico(trilhas: Trilha[]) {
  for (const t of trilhas) for (const r of t.regioes) {
    if (r.nivelTitulo !== 1) continue;
    const tp = r.topicos.find((x) => !x.feito);
    if (tp) return { trilha: t.caminho, regiao: r.nome, topico: tp };
  }
  return null;
}

// ---------------------------------------------------------------- Pergunta do dia
export function oraculo(root: HTMLElement, ctx: Ctx) {
  const { snap, estado } = ctx;
  const corpo = painel(root, "sparkles", "Pergunta do dia", undefined, "is-oraculo");

  if (!snap.perguntas.length) {
    vazio(corpo, "Nenhuma pergunta ainda.", "Adicione callouts “> [!question]- Pergunta” com a resposta embaixo nas suas notas de estudo.");
    return;
  }

  // Muda à meia-noite; "Outra" sorteia
  // E se a lista de perguntas encolheu (nota apagada)? O índice volta pra pergunta do dia.
  if (estado.perguntaIdx === null || estado.perguntaIdx >= snap.perguntas.length) estado.perguntaIdx = indiceDoDia(snap.hoje, snap.perguntas.length);
  const p = snap.perguntas[estado.perguntaIdx];
  if (!p) return;
  pergunta(corpo, ctx, p.pergunta, p.resposta, p.caminho, p.nota, estado.mostrarResposta);
  const row = corpo.createDiv({ cls: "erpg-acoes" });
  botao(row, estado.mostrarResposta ? "Esconder" : "Ver resposta", () => { estado.mostrarResposta = !estado.mostrarResposta; ctx.acoes.redesenhar(); }, { icone: "eye", pequeno: true });
  if (snap.perguntas.length > 1) botao(row, "Outra", () => {
    let n = estado.perguntaIdx ?? 0;
    while (n === estado.perguntaIdx) n = Math.floor(Math.random() * snap.perguntas.length);
    estado.perguntaIdx = n; estado.mostrarResposta = false; ctx.acoes.redesenhar();
  }, { variante: "secundario", icone: "shuffle", pequeno: true });
}

function pergunta(corpo: HTMLElement, ctx: Ctx, q: string, a: string, caminho: string, nota: string, mostrar: boolean) {
  const origem = corpo.createEl("button", { cls: "erpg-origem", text: nota, attr: { "aria-label": `Abrir a nota ${nota}` } });
  origem.addEventListener("click", (ev) => ctx.acoes.abrirNota(caminho, ev.ctrlKey || ev.metaKey));
  const area = corpo.createDiv({ cls: "erpg-rola" });
  md(ctx, area.createDiv({ cls: "erpg-pergunta" }), q, caminho);
  if (mostrar) md(ctx, area.createDiv({ cls: "erpg-resposta" }), a, caminho);
}

// ---------------------------------------------------------------- Revisão espaçada
export function revisao(root: HTMLElement, ctx: Ctx) {
  const { snap, settings } = ctx;
  const infos = snap.notas.map((n) => ({ n, ...infoRevisao({ caixa: n.caixa, revisado: n.revisado }, snap.hoje, settings.intervalos) }));
  const fila = ordenarFila(infos.filter((x) => x.vencida));
  const corpo = painel(root, "repeat", "Revisar", fila.length ? `${fila.length} na fila` : undefined, "is-revisao");
  if (!snap.notas.length) {
    vazio(corpo, "Nenhuma nota de estudo encontrada.", "Notas com a propriedade nivel (escrito, praticado ou projeto) entram aqui.");
    return;
  }
  if (!fila.length) {
    const prox = infos.map((x) => x.proxima).filter((x): x is string => !!x).sort()[0];
    vazio(corpo, "Nada para revisar hoje.", prox ? `Próxima revisão ${relativo(prox, snap.hoje)}.` : undefined);
    return;
  }
  // A lista inteira fica disponível; se não couber no painel, ela rola por dentro.
  const lista = corpo.createDiv({ cls: "erpg-revisoes erpg-rola" });
  for (const x of fila) {
    const row = lista.createDiv({ cls: "erpg-revisao" });
    const info = row.createDiv({ cls: "erpg-revisao-info" });
    const nome = info.createEl("button", { cls: "erpg-link", text: x.n.label });
    nome.addEventListener("click", (ev) => ctx.acoes.abrirNota(x.n.caminho, ev.ctrlKey || ev.metaKey));
    info.createDiv({ cls: "erpg-meta", text: x.revisado ? `caixa ${x.caixa} · ${relativo(x.revisado, snap.hoje)}` : "nunca revisada" });
    const acts = row.createDiv({ cls: "erpg-acoes" });
    botao(acts, "Lembrei", () => ctx.acoes.revisar(x.n, true), { pequeno: true, titulo: "Volta mais tarde (intervalo maior)" });
    botao(acts, "Esqueci", () => ctx.acoes.revisar(x.n, false), { pequeno: true, variante: "secundario", titulo: "Volta amanhã" });
  }
}

// ---------------------------------------------------------------- Atividade (calendário)
export function cronica(root: HTMLElement, ctx: Ctx) {
  const { snap, settings } = ctx;
  const semanas = Math.max(4, Math.min(52, settings.semanasNoCalendario));
  const corpo = painel(root, "calendar-days", "Atividade", `${snap.diario.size} ${snap.diario.size === 1 ? "dia" : "dias"} de estudo`, "is-cronica");

  // Começa na segunda-feira de (semanas-1) semanas atrás.
  const dow = (new Date().getDay() + 6) % 7; // 0 = segunda
  const inicio = addDias(snap.hoje, -dow - (semanas - 1) * 7);
  const grade = corpo.createDiv({ cls: "erpg-grade", attr: { style: `--semanas:${semanas}` } });
  for (let k = 0; k < semanas * 7; k++) {
    const dia = addDias(inicio, k);
    const futuro = diffDias(snap.hoje, dia) > 0;
    const d = snap.diario.get(dia);
    const lv = !d ? 0 : d.minutos < 25 ? 1 : d.minutos < 50 ? 2 : 3;
    grade.createSpan({
      cls: `erpg-dia is-n${futuro ? "x" : lv}${dia === snap.hoje ? " is-hoje" : ""}`,
      attr: { title: `${dia}${d ? ` · ${d.minutos} min` : ""}` },
    });
  }
}

// ---------------------------------------------------------------- Trilhas (mapa compacto)
export function mapa(root: HTMLElement, ctx: Ctx) {
  const { snap, prog } = ctx;
  const corpo = painel(root, "map", "Trilhas", `${prog.topicosFeitos} de ${prog.topicosTotal} tópicos`, "is-mapa");
  if (!snap.trilhas.length) {
    vazio(corpo, "Nenhuma trilha.", "Crie uma nota com a propriedade tipo: trilha, seções com “#” e tópicos “- [ ] [[Nota]] — descrição”.");
    return;
  }

  const busca = corpo.createEl("button", { cls: "erpg-busca", attr: { "aria-label": "Buscar tópico" } });
  icone(busca, "search");
  busca.createSpan({ text: "Buscar tópico" });
  busca.addEventListener("click", () => ctx.acoes.abrirTopicos(null));

  const area = corpo.createDiv({ cls: "erpg-rola" });
  for (const t of snap.trilhas) {
    if (snap.trilhas.length > 1) area.createDiv({ cls: "erpg-rotulo", text: t.nome });
    const grid = area.createDiv({ cls: "erpg-regioes" });
    for (const r of t.regioes) {
      const feitos = r.topicos.filter((x) => x.feito).length;
      const b = grid.createEl("button", {
        cls: `erpg-regiao${feitos === r.topicos.length ? " is-conquistada" : ""}${r.destaque ? " is-destaque" : ""}`,
        attr: { title: `${r.nome}: ${feitos} de ${r.topicos.length}${r.desc ? `\n${r.desc}` : ""}` },
      });
      b.createSpan({ cls: "erpg-regiao-nome", text: r.nome });
      b.createSpan({ cls: "erpg-num", text: `${feitos}/${r.topicos.length}` });
      barra(b, feitos / r.topicos.length, "erpg-barra");
      b.addEventListener("click", () => ctx.acoes.abrirTopicos({ trilha: t.caminho, regiao: r.nome }));
    }
  }
}

/** Card de um tópico (usado no painel da missão e na janela de tópicos). */
export function topico(parent: HTMLElement, ctx: Ctx, trilha: string, tp: Topico, contexto?: string) {
  const card = parent.createDiv({ cls: `erpg-topico${tp.feito ? " is-feito" : ""}` });
  const chk = card.createEl("button", { cls: "erpg-check", attr: { "aria-label": tp.feito ? `Desmarcar ${tp.label}` : `Marcar ${tp.label} como praticado`, "aria-pressed": String(tp.feito) } });
  icone(chk, "check");
  chk.addEventListener("click", () => ctx.acoes.alternarTopico(trilha, tp));
  const corpo = card.createEl("button", { cls: "erpg-topico-corpo", attr: { "aria-label": tp.caminho ? `Abrir ${tp.label}` : `Criar a nota ${tp.label}` } });
  if (contexto) corpo.createDiv({ cls: "erpg-meta is-ouro", text: contexto });
  const nome = corpo.createDiv({ cls: "erpg-topico-nome", text: tp.label });
  if (!tp.caminho) nome.createSpan({ cls: "erpg-selo-novo", text: "sem nota" });
  if (tp.desc) corpo.createDiv({ cls: "erpg-topico-desc", text: tp.desc });
  const nota = tp.caminho ? ctx.snap.notas.find((n) => n.caminho === tp.caminho) : undefined;
  if (nota) corpo.createSpan({ cls: `erpg-nivel is-${nota.nivel}`, text: NOME_NIVEL[nota.nivel] });
  corpo.addEventListener("click", (ev) => ctx.acoes.abrirNota(tp.caminho ?? tp.alvo, ev.ctrlKey || ev.metaKey));
}

/** Lista de tópicos de uma região, ou o resultado de uma busca em todas as trilhas. */
export function listaTopicos(parent: HTMLElement, ctx: Ctx, alvo: { trilha: string; regiao: string } | null, busca: string) {
  const q = normalizar(busca.trim());
  const achados: { t: Trilha; r: string; tp: Topico }[] = [];
  for (const t of ctx.snap.trilhas) for (const r of t.regioes) {
    const naRegiao = alvo && t.caminho === alvo.trilha && r.nome === alvo.regiao;
    for (const tp of r.topicos) {
      if (q ? normalizar(`${tp.label} ${tp.desc}`).includes(q) : naRegiao) achados.push({ t, r: r.nome, tp });
    }
  }
  if (!achados.length) { vazio(parent, q ? "Nada encontrado." : "Essa região não existe mais."); return; }
  const g = parent.createDiv({ cls: "erpg-topicos" });
  achados.slice(0, 120).forEach((a) => topico(g, ctx, a.t.caminho, a.tp, q ? `${a.t.nome} · ${a.r}` : undefined));
}

function normalizar(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}
