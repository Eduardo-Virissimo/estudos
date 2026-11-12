// As seções da Ficha do Herói. Cada função desenha uma parte e não sabe das outras.
// Quer uma seção nova? Escreva uma função aqui e chame em view.ts.

import { MarkdownRenderer } from "obsidian";
import { addDias, diffDias, relativo } from "../domain/dates.ts";
import { semWikilinks } from "../domain/parse.ts";
import { habilidades } from "../domain/progress.ts";
import { indiceDoDia } from "../domain/quiz.ts";
import { infoRevisao, ordenarFila } from "../domain/review.ts";
import type { Topico, Trilha } from "../domain/types.ts";
import type { Ctx } from "./context.ts";
import { barra, botao, icone, ornamento, painel, vazio } from "./dom.ts";

const NOME_NIVEL = { escrito: "escrito", praticado: "praticado", projeto: "em projeto" } as const;

function md(ctx: Ctx, el: HTMLElement, texto: string, origem: string) {
  void MarkdownRenderer.render(ctx.app, texto, el, origem, ctx.comp);
}

// ---------------------------------------------------------------- Ficha
export function ficha(root: HTMLElement, ctx: Ctx) {
  const { prog } = ctx;
  const sec = root.createEl("header", { cls: "erpg-ficha" });

  const brasao = sec.createDiv({ cls: "erpg-brasao", attr: { "aria-label": `Nível ${prog.nivel}` } });
  brasao.createSpan({ cls: "erpg-brasao-rot", text: "Nível" });
  brasao.createSpan({ cls: "erpg-brasao-num", text: String(prog.nivel) });

  const id = sec.createDiv({ cls: "erpg-ficha-id" });
  id.createDiv({ cls: "erpg-sobretitulo", text: "Ficha do herói" });
  id.createEl("h1", { cls: "erpg-titulo", text: prog.titulo });
  const xp = id.createDiv({ cls: "erpg-xp" });
  barra(xp, (prog.xp - prog.xpNivel) / (prog.xpProximo - prog.xpNivel), "erpg-barra is-xp", "Experiência até o próximo nível");
  xp.createSpan({ cls: "erpg-xp-num", text: `${prog.xp} / ${prog.xpProximo} XP` });

  const st = id.createDiv({ cls: "erpg-atributos" });
  const atributo = (ic: string, valor: string | number, rot: string, cls = "") => {
    const a = st.createDiv({ cls: `erpg-atributo ${cls}`.trim() });
    icone(a, ic);
    a.createSpan({ cls: "erpg-atributo-val", text: String(valor) });
    a.createSpan({ cls: "erpg-atributo-rot", text: rot });
  };
  atributo("flame", prog.sequencia, prog.sequencia === 1 ? "dia seguido" : "dias seguidos", prog.sequencia ? "is-chama" : "");
  atributo("scroll-text", prog.contagemNivel.escrito, "escritas");
  atributo("hammer", prog.contagemNivel.praticado, "praticadas");
  atributo("castle", prog.contagemNivel.projeto, "em projeto");
  atributo("trophy", `${ctx.conquistas.filter((c) => c.ok).length}/${ctx.conquistas.length}`, "troféus");

  const acao = sec.createDiv({ cls: "erpg-ficha-acao" });
  botao(acao, prog.estudouHoje ? "Abrir o diário de hoje" : "Começar a jornada de hoje", () => ctx.acoes.iniciarDia(), { icone: prog.estudouHoje ? "book-open" : "play" });
  acao.createDiv({ cls: "erpg-dica", text: prog.estudouHoje ? "Sessão de hoje registrada." : `Registrar o dia vale +${ctx.settings.xp.diario} XP e mantém a chama acesa.` });
}

// ---------------------------------------------------------------- Missão principal
export function missao(root: HTMLElement, ctx: Ctx) {
  const ativa = ctx.snap.missoes.map((m) => ({ m, f: m.fases.find((f) => f.tarefas.some((t) => !t.feita)) })).find((x) => x.f);
  const corpo = painel(root, "swords", "Missão principal", ativa ? `${ativa.m.nome} · Fase ${ativa.f!.num}` : undefined, "is-missao");

  if (!ctx.snap.missoes.length) {
    vazio(corpo, "Nenhuma missão no seu diário de missões.", "Crie uma nota com a propriedade tipo: missao, seções “## Fase 1: …” e tarefas “- [ ] …”.");
    return;
  }
  if (!ativa || !ativa.f) {
    vazio(corpo, "Todas as missões foram cumpridas. Hora de escrever uma nova!");
    return;
  }
  const { m, f } = ativa;
  corpo.createDiv({ cls: "erpg-missao-titulo", text: f.titulo || `Fase ${f.num}` });
  if (f.entrega) md(ctx, corpo.createDiv({ cls: "erpg-missao-entrega" }), `**Entrega:** ${f.entrega}`, m.caminho);

  const feitas = f.tarefas.filter((t) => t.feita).length;
  const prog = corpo.createDiv({ cls: "erpg-linha" });
  barra(prog, feitas / f.tarefas.length, "erpg-barra", "Progresso da fase");
  prog.createSpan({ cls: "erpg-num", text: `${feitas}/${f.tarefas.length}` });

  const ul = corpo.createEl("ul", { cls: "erpg-tarefas" });
  for (const t of f.tarefas) {
    const li = ul.createEl("li", { cls: t.feita ? "is-feita" : "" });
    const chk = li.createEl("button", { cls: "erpg-check", attr: { "aria-label": t.feita ? "Desfazer tarefa" : "Concluir tarefa", "aria-pressed": String(t.feita) } });
    icone(chk, "check");
    chk.addEventListener("click", () => ctx.acoes.alternarTarefa(m, t));
    md(ctx, li.createDiv({ cls: "erpg-tarefa-txt" }), semWikilinks(t.texto), m.caminho);
    li.createSpan({ cls: "erpg-num is-ouro", text: `+${ctx.settings.xp.tarefa}` });
  }
  botao(corpo, "Abrir o pergaminho da missão", (ev) => ctx.acoes.abrirNota(m.caminho, ev.ctrlKey || ev.metaKey), { variante: "secundario", icone: "scroll" });

  const outras = ctx.snap.missoes.filter((x) => x !== m && x.fases.some((ff) => ff.tarefas.some((t) => !t.feita)));
  if (outras.length) corpo.createDiv({ cls: "erpg-dica", text: `Missões secundárias: ${outras.map((x) => x.nome).join(", ")}` });

  // Próximo tópico sugerido (primeiro não feito das trilhas)
  const prox = proximoTopico(ctx.snap.trilhas);
  if (prox) {
    ornamento(corpo);
    corpo.createDiv({ cls: "erpg-subtitulo", text: "Próximo tópico do mapa" });
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

// ---------------------------------------------------------------- Oráculo (pergunta / treino)
export function oraculo(root: HTMLElement, ctx: Ctx) {
  const { snap, estado, settings } = ctx;
  const tr = estado.treino;
  const corpo = painel(root, "sparkles", "Desafio do oráculo", tr ? `Treino misto · ${tr.itens.length} perguntas de notas diferentes` : "Responda de cabeça antes de revelar", "is-oraculo");

  if (!snap.perguntas.length) {
    vazio(corpo, "O oráculo ainda não tem perguntas.", "Adicione callouts “> [!question]- Pergunta” com a resposta embaixo nas suas notas de estudo.");
    return;
  }

  if (tr) {
    if (tr.fim) {
      const fim = corpo.createDiv({ cls: "erpg-placar" });
      fim.createSpan({ cls: "erpg-placar-num", text: `${tr.acertos}` });
      fim.createSpan({ cls: "erpg-placar-de", text: `/ ${tr.itens.length}` });
      corpo.createEl("p", { cls: "erpg-texto", text: tr.acertos === tr.itens.length ? "Gabaritou! O oráculo se curva diante de você." : "As notas que você errou voltam amanhã na revisão." });
      const row = corpo.createDiv({ cls: "erpg-acoes" });
      botao(row, "Treinar de novo", () => ctx.acoes.iniciarTreino(), { icone: "repeat" });
      botao(row, "Voltar", () => { estado.treino = null; ctx.acoes.redesenhar(); }, { variante: "secundario" });
      return;
    }
    const p = tr.itens[tr.i];
    if (!p) return;
    const topo = corpo.createDiv({ cls: "erpg-linha" });
    topo.createSpan({ cls: "erpg-num", text: `Pergunta ${tr.i + 1} de ${tr.itens.length}` });
    const pontos = topo.createDiv({ cls: "erpg-pontos" });
    tr.itens.forEach((_, k) => pontos.createSpan({ cls: k < tr.i ? "is-passada" : k === tr.i ? "is-atual" : "" }));
    pergunta(corpo, ctx, p.pergunta, p.resposta, p.caminho, p.nota, tr.mostrar);
    const row = corpo.createDiv({ cls: "erpg-acoes" });
    if (!tr.mostrar) {
      botao(row, "Revelar resposta", () => { tr.mostrar = true; ctx.acoes.redesenhar(); }, { icone: "eye" });
      botao(row, "Abandonar treino", () => { estado.treino = null; ctx.acoes.redesenhar(); }, { variante: "discreto" });
    } else {
      botao(row, "Acertei", () => ctx.acoes.responderTreino(true), { icone: "check" });
      botao(row, "Errei", () => ctx.acoes.responderTreino(false), { variante: "secundario", icone: "x" });
    }
    return;
  }

  // Pergunta do dia (muda à meia-noite; "Outra" sorteia)
  if (estado.perguntaIdx === null || estado.perguntaIdx >= snap.perguntas.length) estado.perguntaIdx = indiceDoDia(snap.hoje, snap.perguntas.length);
  const p = snap.perguntas[estado.perguntaIdx];
  if (!p) return;
  pergunta(corpo, ctx, p.pergunta, p.resposta, p.caminho, p.nota, estado.mostrarResposta);
  const row = corpo.createDiv({ cls: "erpg-acoes" });
  botao(row, estado.mostrarResposta ? "Esconder resposta" : "Revelar resposta", () => { estado.mostrarResposta = !estado.mostrarResposta; ctx.acoes.redesenhar(); }, { icone: "eye" });
  if (snap.perguntas.length > 1) botao(row, "Outra pergunta", () => {
    let n = estado.perguntaIdx ?? 0;
    while (n === estado.perguntaIdx) n = Math.floor(Math.random() * snap.perguntas.length);
    estado.perguntaIdx = n; estado.mostrarResposta = false; ctx.acoes.redesenhar();
  }, { variante: "secundario", icone: "shuffle" });
  botao(row, `Treino misto (${Math.min(settings.perguntasPorTreino, snap.perguntas.length)})`, () => ctx.acoes.iniciarTreino(), { variante: "secundario", icone: "swords" });
}

function pergunta(corpo: HTMLElement, ctx: Ctx, q: string, a: string, caminho: string, nota: string, mostrar: boolean) {
  const origem = corpo.createEl("button", { cls: "erpg-origem", text: nota, attr: { "aria-label": `Abrir a nota ${nota}` } });
  origem.addEventListener("click", (ev) => ctx.acoes.abrirNota(caminho, ev.ctrlKey || ev.metaKey));
  md(ctx, corpo.createDiv({ cls: "erpg-pergunta" }), q, caminho);
  if (mostrar) md(ctx, corpo.createDiv({ cls: "erpg-resposta" }), a, caminho);
}

// ---------------------------------------------------------------- Revisão espaçada
export function revisao(root: HTMLElement, ctx: Ctx) {
  const { snap, settings } = ctx;
  const corpo = painel(root, "scroll-text", "Pergaminhos para revisar", "Lembrou → volta mais tarde · Esqueceu → volta amanhã", "is-revisao");
  if (!snap.notas.length) {
    vazio(corpo, "Nenhuma nota de estudo encontrada.", "Notas com a propriedade nivel (escrito, praticado ou projeto) entram aqui.");
    return;
  }
  const infos = snap.notas.map((n) => ({ n, ...infoRevisao({ caixa: n.caixa, revisado: n.revisado }, snap.hoje, settings.intervalos) }));
  const fila = ordenarFila(infos.filter((x) => x.vencida));
  if (!fila.length) {
    const prox = infos.map((x) => x.proxima).filter((x): x is string => !!x).sort()[0];
    vazio(corpo, "Nenhum pergaminho vencido hoje. Descanse, herói.", prox ? `Próxima revisão ${relativo(prox, snap.hoje)}.` : undefined);
    return;
  }
  const lista = corpo.createDiv({ cls: "erpg-revisoes" });
  for (const x of fila.slice(0, 6)) {
    const row = lista.createDiv({ cls: "erpg-revisao" });
    const info = row.createDiv({ cls: "erpg-revisao-info" });
    const nome = info.createEl("button", { cls: "erpg-link", text: x.n.label });
    nome.addEventListener("click", (ev) => ctx.acoes.abrirNota(x.n.caminho, ev.ctrlKey || ev.metaKey));
    const meta = [x.n.area, x.revisado ? `caixa ${x.caixa} · revisada ${relativo(x.revisado, snap.hoje)}` : "nunca revisada"].filter(Boolean).join(" · ");
    info.createDiv({ cls: "erpg-meta", text: meta });
    const acts = row.createDiv({ cls: "erpg-acoes" });
    botao(acts, "Lembrei", () => ctx.acoes.revisar(x.n, true), { pequeno: true, icone: "check" });
    botao(acts, "Esqueci", () => ctx.acoes.revisar(x.n, false), { pequeno: true, variante: "secundario" });
  }
  if (fila.length > 6) corpo.createDiv({ cls: "erpg-dica", text: `Mais ${fila.length - 6} na fila.` });
  corpo.createDiv({ cls: "erpg-dica", text: "Abra a nota, responda o “Me teste” sem olhar e só então escolha." });
}

// ---------------------------------------------------------------- Crônica (calendário)
export function cronica(root: HTMLElement, ctx: Ctx) {
  const { snap, settings, prog } = ctx;
  const semanas = Math.max(4, Math.min(52, settings.semanasNoCalendario));
  const corpo = painel(root, "calendar-days", "Crônica da jornada", `Últimas ${semanas} semanas`, "is-cronica");

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
      attr: { "aria-label": `${dia}${d ? ` · ${d.minutos} min` : ""}` },
    });
  }
  const leg = corpo.createDiv({ cls: "erpg-legenda" });
  leg.createSpan({ text: `${snap.diario.size} dias de estudo · sequência atual: ${prog.sequencia}` });
  const esc = leg.createSpan({ cls: "erpg-escala" });
  esc.createSpan({ text: "menos" });
  for (let i = 0; i < 4; i++) esc.createSpan({ cls: `erpg-dia is-n${i}` });
  esc.createSpan({ text: "mais" });
}

// ---------------------------------------------------------------- Mapa dos reinos
export function mapa(root: HTMLElement, ctx: Ctx) {
  const { snap, estado, prog } = ctx;
  const corpo = painel(root, "map", "Mapa dos reinos", `${prog.topicosFeitos} de ${prog.topicosTotal} tópicos conquistados`, "is-mapa");
  if (!snap.trilhas.length) {
    vazio(corpo, "Nenhum reino descoberto.", "Crie uma nota com a propriedade tipo: trilha, seções com “#” e tópicos “- [ ] [[Nota]] — descrição”.");
    return;
  }

  const busca = corpo.createDiv({ cls: "erpg-busca" });
  icone(busca, "search");
  const input = busca.createEl("input", { type: "search", attr: { placeholder: "Buscar tópico em todos os reinos", "aria-label": "Buscar tópico", spellcheck: "false" } });
  input.value = estado.busca;
  const resultado = corpo.createDiv();

  const desenharBusca = () => {
    resultado.empty();
    const q = normalizar(estado.busca);
    if (q) {
      const achados: { t: Trilha; r: string; tp: Topico }[] = [];
      for (const t of snap.trilhas) for (const r of t.regioes) for (const tp of r.topicos)
        if (normalizar(tp.label).includes(q) || normalizar(tp.desc).includes(q)) achados.push({ t, r: r.nome, tp });
      resultado.createDiv({ cls: "erpg-meta", text: `${achados.length} resultado(s)` });
      const g = resultado.createDiv({ cls: "erpg-topicos" });
      achados.slice(0, 60).forEach((a) => topico(g, ctx, a.t.caminho, a.tp, `${a.t.nome} · ${a.r}`));
      return;
    }
    for (const t of snap.trilhas) reino(resultado, ctx, t);
  };
  input.addEventListener("input", () => { estado.busca = input.value.trim(); desenharBusca(); });
  desenharBusca();
}

function reino(parent: HTMLElement, ctx: Ctx, t: Trilha) {
  const { estado } = ctx;
  const feitos = t.regioes.reduce((a, r) => a + r.topicos.filter((x) => x.feito).length, 0);
  const total = t.regioes.reduce((a, r) => a + r.topicos.length, 0);
  const cab = parent.createDiv({ cls: "erpg-reino-cab" });
  cab.createEl("h3", { text: t.nome });
  cab.createSpan({ cls: "erpg-num", text: `${feitos}/${total}` });

  const skills = new Map(habilidades(ctx.snap).filter((h) => h.trilha === t.nome).map((h) => [h.nome, h]));
  const grid = parent.createDiv({ cls: "erpg-regioes" });
  for (const r of t.regioes) {
    const chave = `${t.caminho}::${r.nome}`;
    const h = skills.get(r.nome);
    const aberta = estado.regiaoAberta === chave;
    const feitosR = r.topicos.filter((x) => x.feito).length;
    const b = grid.createEl("button", {
      cls: `erpg-regiao${aberta ? " is-aberta" : ""}${feitosR === r.topicos.length ? " is-conquistada" : ""}`,
      attr: { "aria-expanded": String(aberta) },
    });
    const nome = b.createDiv({ cls: "erpg-regiao-nome" });
    if (r.destaque) icone(nome, "star");
    nome.createSpan({ text: r.nome });
    const est = b.createDiv({ cls: "erpg-estrelas", attr: { "aria-label": `${h?.estrelas ?? 0} de 5 estrelas` } });
    for (let i = 0; i < 5; i++) est.createSpan({ cls: i < (h?.estrelas ?? 0) ? "is-cheia" : "" });
    b.createSpan({ cls: "erpg-num", text: `${feitosR}/${r.topicos.length}` });
    b.addEventListener("click", () => { estado.regiaoAberta = aberta ? null : chave; ctx.acoes.redesenhar(); });

    if (aberta) {
      const det = parent.createDiv({ cls: "erpg-regiao-det" });
      if (r.desc) det.createEl("p", { cls: "erpg-texto", text: r.desc });
      const g = det.createDiv({ cls: "erpg-topicos" });
      r.topicos.forEach((tp) => topico(g, ctx, t.caminho, tp));
    }
  }
}

function topico(parent: HTMLElement, ctx: Ctx, trilha: string, tp: Topico, contexto?: string) {
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

// ---------------------------------------------------------------- Troféus
export function trofeus(root: HTMLElement, ctx: Ctx) {
  const ok = ctx.conquistas.filter((c) => c.ok).length;
  const corpo = painel(root, "trophy", "Salão de troféus", `${ok} de ${ctx.conquistas.length} conquistados`, "is-trofeus");
  const grid = corpo.createDiv({ cls: "erpg-trofeus" });
  for (const c of ctx.conquistas) {
    const t = grid.createDiv({ cls: `erpg-trofeu${c.ok ? " is-ok" : ""}` });
    icone(t.createDiv({ cls: "erpg-medalha" }), c.ok ? c.icone : "lock");
    t.createDiv({ cls: "erpg-trofeu-nome", text: c.nome });
    t.createDiv({ cls: "erpg-trofeu-desc", text: c.desc });
  }

  const p = ctx.prog.partes;
  const linhas: [string, number][] = [["notas", p.notas], ["tópicos", p.topicos], ["diário", p.diario], ["revisões", p.revisao], ["treinos", p.treinos], ["missões", p.missoes]];
  corpo.createDiv({ cls: "erpg-meta", text: "De onde vem seu XP: " + linhas.map(([k, v]) => `${k} ${v}`).join(" · ") });
}

function normalizar(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}
