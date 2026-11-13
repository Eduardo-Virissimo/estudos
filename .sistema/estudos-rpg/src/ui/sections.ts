// As seções da Ficha. Cada função desenha uma parte e não sabe das outras.
// O encaixe na tela (sem rolagem) é feito em view.ts + styles.css.

import { MarkdownRenderer } from "obsidian";
import { addDias, diaDaSemana, diffDias, relativo } from "../domain/dates.ts";
import type { Conquista } from "../domain/progress.ts";
import { aposLembrar, infoRevisao, ordenarFila } from "../domain/review.ts";
import type { Topico, Trilha } from "../domain/types.ts";
import type { Ctx } from "./context.ts";
import { barra, botao, icone, ornamento, painel, vazio } from "./dom.ts";

const NOME_NIVEL = { escrito: "escrito", praticado: "praticado", projeto: "em projeto" } as const;
const RARIDADE = { comum: "Comum", raro: "Raro", epico: "Épico", lendario: "Lendário" } as const;

function md(ctx: Ctx, el: HTMLElement, texto: string, origem: string) {
  void MarkdownRenderer.render(ctx.app, texto, el, origem, ctx.comp);
}

/** "mm:ss" (ou "h:mm:ss" depois de uma hora). */
function relogio(ms: number): string {
  const t = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
  const dois = (n: number) => String(n).padStart(2, "0");
  return h ? `${h}:${dois(m)}:${dois(s)}` : `${dois(m)}:${dois(s)}`;
}

/** Atualiza os cronômetros visíveis sem redesenhar a ficha (chamado a cada segundo). */
export function tique(root: HTMLElement, inicio: number | null) {
  if (!inicio) return;
  const txt = relogio(Date.now() - inicio);
  root.querySelectorAll<HTMLElement>("[data-erpg-timer]").forEach((el) => { if (el.textContent !== txt) el.textContent = txt; });
}

// ---------------------------------------------------------------- Faixa do topo
export function ficha(root: HTMLElement, ctx: Ctx) {
  const { prog, settings } = ctx;
  const sec = root.createEl("header", { cls: "erpg-ficha" });

  const brasao = sec.createDiv({ cls: "erpg-brasao", attr: { "aria-label": `Nível ${prog.nivel}` } });
  brasao.createSpan({ cls: "erpg-brasao-rot", text: "Nv" });
  brasao.createSpan({ cls: "erpg-brasao-num", text: String(prog.nivel) });

  const id = sec.createDiv({ cls: "erpg-ficha-id" });
  id.createEl("h1", { cls: "erpg-titulo", text: prog.titulo });
  const p = prog.partes;
  const origemXP = `De onde vem o XP — notas ${p.notas} · tópicos ${p.topicos} · dias ${p.diario} · tempo ${p.estudo} · revisões ${p.revisao}`;
  const xp = id.createDiv({ cls: "erpg-xp", attr: { title: origemXP } });
  barra(xp, (prog.xp - prog.xpNivel) / (prog.xpProximo - prog.xpNivel), "erpg-barra is-xp", "Experiência até o próximo nível");
  xp.createSpan({ cls: "erpg-xp-num", text: `${prog.xp} / ${prog.xpProximo} XP` });

  const st = id.createDiv({ cls: "erpg-atributos" });
  const atributo = (ic: string, valor: string | number, rot: string, cls = "", dica = `${valor} ${rot}`) => {
    const a = st.createDiv({ cls: `erpg-atributo ${cls}`.trim(), attr: { title: dica } });
    icone(a, ic);
    a.createSpan({ cls: "erpg-atributo-val", text: String(valor) });
    a.createSpan({ cls: "erpg-atributo-rot", text: rot });
    return a;
  };
  atributo("flame", prog.sequencia, prog.sequencia === 1 ? "dia seguido" : "dias seguidos", prog.sequencia ? "is-chama" : "", `Sequência atual: ${prog.sequencia} · recorde: ${prog.maiorSequencia}`);
  if (settings.metaSemanalMin > 0) {
    const ok = prog.minutosSemana >= settings.metaSemanalMin;
    const a = atributo("clock", `${prog.minutosSemana}/${settings.metaSemanalMin}`, "min na semana", `is-meta${ok ? " is-ok" : ""}`, `Meta semanal: ${prog.minutosSemana} de ${settings.metaSemanalMin} min · hoje ${prog.minutosHoje} min`);
    barra(a, prog.minutosSemana / settings.metaSemanalMin, "erpg-barra is-meta", "Meta semanal de minutos");
  }
  atributo("scroll-text", prog.contagemNivel.escrito, "escritas");
  atributo("hammer", prog.contagemNivel.praticado, "praticadas");
  atributo("castle", prog.contagemNivel.projeto, "em projeto");

  medalhas(sec, ctx);
  sessao(sec.createDiv({ cls: "erpg-ficha-acao" }), ctx);
}

/** Botões da sessão de estudo: iniciar, ou o cronômetro rodando com encerrar/descartar. */
function sessao(acao: HTMLElement, ctx: Ctx) {
  const inicio = ctx.acoes.sessaoInicio();
  const { xp } = ctx.settings;
  if (inicio) {
    acao.addClass("is-rodando");
    const b = botao(acao, "Encerrar", () => ctx.acoes.encerrarSessao(), { icone: "square", titulo: `Encerrar e somar os minutos no diário (+${xp.dezMinutos} XP a cada 10 min)` });
    b.createSpan({ cls: "erpg-timer", attr: { "data-erpg-timer": "" }, text: relogio(Date.now() - inicio) });
    botao(acao, "", () => {
      if (Date.now() - inicio >= 60_000 && !window.confirm("Descartar a sessão? Os minutos não vão contar.")) return;
      return ctx.acoes.descartarSessao();
    }, { icone: "x", variante: "discreto", pequeno: true, titulo: "Descartar a sessão (não conta)" });
  } else {
    botao(acao, "Iniciar sessão", () => ctx.acoes.iniciarSessao(), { icone: "timer", titulo: `Cronometra o estudo · +${xp.dezMinutos} XP a cada 10 min${ctx.prog.estudouHoje ? "" : ` e +${xp.diario} XP pelo dia`}` });
  }
  botao(acao, "", () => ctx.acoes.abrirDiario(), { icone: "book-open", variante: "secundario", pequeno: true, titulo: "Abrir o diário de hoje" });
}

function descConquista(c: Conquista): string {
  return `${c.nome} · ${RARIDADE[c.raridade]}\n${c.desc}\n${c.ok ? "✓ Conquistado" : `Progresso: ${c.atual}/${c.meta}`}`;
}

/** Conquistas como medalhas pequenas que "enchem" conforme o progresso. Clicar abre a lista completa. */
function medalhas(parent: HTMLElement, ctx: Ctx) {
  const ok = ctx.conquistas.filter((c) => c.ok).length;
  const box = parent.createEl("button", { cls: "erpg-medalhas", attr: { "aria-label": `Conquistas: ${ok} de ${ctx.conquistas.length}. Abrir a lista.` } });
  box.addEventListener("click", () => ctx.acoes.abrirConquistas());
  box.createDiv({ cls: "erpg-rotulo", text: `Conquistas ${ok}/${ctx.conquistas.length}` });
  const fila = box.createDiv({ cls: "erpg-medalhas-fila" });
  for (const c of ctx.conquistas) {
    const m = fila.createDiv({ cls: `erpg-medalha is-${c.raridade}${c.ok ? " is-ok" : ""}`, attr: { title: descConquista(c) } });
    m.style.setProperty("--p", `${Math.round((c.atual / c.meta) * 100)}%`);
    icone(m, c.ok ? c.icone : "lock");
  }
}

/** Lista completa das conquistas, por raridade (usada na janela de conquistas). */
export function listaConquistas(parent: HTMLElement, ctx: Ctx) {
  const ordem = ["comum", "raro", "epico", "lendario"] as const;
  const grade = parent.createDiv({ cls: "erpg-conquistas" });
  for (const r of ordem) {
    for (const c of ctx.conquistas.filter((x) => x.raridade === r)) {
      const card = grade.createDiv({ cls: `erpg-conquista is-${c.raridade}${c.ok ? " is-ok" : ""}` });
      const m = card.createDiv({ cls: `erpg-medalha is-${c.raridade}${c.ok ? " is-ok" : ""}` });
      m.style.setProperty("--p", `${Math.round((c.atual / c.meta) * 100)}%`);
      icone(m, c.icone);
      const info = card.createDiv({ cls: "erpg-conquista-info" });
      const topo = info.createDiv({ cls: "erpg-conquista-topo" });
      topo.createSpan({ cls: "erpg-conquista-nome", text: c.nome });
      topo.createSpan({ cls: "erpg-meta is-ouro", text: RARIDADE[c.raridade] });
      info.createDiv({ cls: "erpg-meta", text: c.desc });
      const linha = info.createDiv({ cls: "erpg-linha" });
      barra(linha, c.atual / c.meta, "erpg-barra", `Progresso de ${c.nome}`);
      linha.createSpan({ cls: `erpg-num${c.ok ? " is-ouro" : ""}`, text: c.ok ? "✓" : `${c.atual}/${c.meta}` });
    }
  }
}

// ---------------------------------------------------------------- Próximos passos
/** O próximo tópico de CADA trilha, com o progresso dela. Clicar no nome troca a aba do mapa. */
export function proximos(root: HTMLElement, ctx: Ctx) {
  const { snap } = ctx;
  const corpo = painel(root, "compass", "Próximos passos", undefined, "is-proximos");
  if (!snap.trilhas.length) {
    vazio(corpo, "Nenhuma trilha.", "Crie uma nota com a propriedade tipo: trilha, seções com “#” e tópicos “- [ ] [[Nota]] — descrição”.");
    return;
  }
  const area = corpo.createDiv({ cls: "erpg-rola erpg-proximos" });
  for (const t of snap.trilhas) {
    const todos = t.regioes.flatMap((r) => r.topicos);
    const feitos = todos.filter((x) => x.feito).length;
    const bloco = area.createDiv({ cls: "erpg-proximo" });
    const cab = bloco.createDiv({ cls: "erpg-linha" });
    const nome = cab.createEl("button", { cls: "erpg-origem", text: t.nome, attr: { "aria-label": `Ver a trilha ${t.nome} no mapa` } });
    nome.addEventListener("click", () => { ctx.estado.trilha = t.caminho; ctx.acoes.redesenhar(); });
    barra(cab, todos.length ? feitos / todos.length : 0, "erpg-barra", `Progresso em ${t.nome}`);
    cab.createSpan({ cls: "erpg-num", text: `${feitos}/${todos.length}` });
    const prox = proximoTopico(t);
    if (prox) topico(bloco, ctx, t.caminho, prox.topico, prox.regiao);
    else vazio(bloco, "Trilha completa! 🏆");
  }
}

/** Primeiro tópico não feito da trilha, na ordem em que aparece (regiões # e ##). */
function proximoTopico(t: Trilha) {
  for (const r of t.regioes) {
    const tp = r.topicos.find((x) => !x.feito);
    if (tp) return { regiao: r.nome, topico: tp };
  }
  return null;
}

// ---------------------------------------------------------------- Revisão espaçada (com as perguntas das notas)
export function revisao(root: HTMLElement, ctx: Ctx) {
  const { snap, settings, estado } = ctx;
  const infos = snap.notas.map((n) => ({ n, ...infoRevisao({ caixa: n.caixa, revisado: n.revisado }, snap.hoje, settings.intervalos) }));
  const fila = ordenarFila(infos.filter((x) => x.vencida));
  const qtdPerguntas = (caminho: string) => snap.perguntas.filter((p) => p.caminho === caminho).length;

  // E se a nota em revisão saiu da fila (revisada em outro lugar, apagada)? Volta para a lista.
  const pos = estado.revisando ? fila.findIndex((x) => x.n.caminho === estado.revisando) : -1;
  if (estado.revisando && pos < 0) estado.revisando = null;

  const sub = !fila.length ? undefined : pos >= 0 ? `${pos + 1} de ${fila.length} na fila` : `${fila.length} na fila`;
  const corpo = painel(root, "repeat", "Revisar", sub, "is-revisao");
  if (!snap.notas.length) {
    vazio(corpo, "Nenhuma nota de estudo encontrada.", "Notas com a propriedade nivel (escrito, praticado ou projeto) entram aqui.");
    return;
  }
  if (!fila.length) {
    const prox = infos.map((x) => x.proxima).filter((x): x is string => !!x).sort()[0];
    vazio(corpo, "Nada para revisar hoje.", prox ? `Próxima revisão ${relativo(prox, snap.hoje)}.` : undefined);
    return;
  }

  // ---- Modo revisão: uma nota por vez, com as perguntas dela
  const atual = pos >= 0 ? fila[pos] : undefined;
  if (atual) {
    const n = atual.n;
    const proxima = fila[pos + 1]?.n.caminho ?? null;
    const perguntas = snap.perguntas.filter((p) => p.caminho === n.caminho);

    const origem = corpo.createEl("button", { cls: "erpg-origem", text: n.label, attr: { "aria-label": `Abrir a nota ${n.label}` } });
    origem.addEventListener("click", (ev) => ctx.acoes.abrirNota(n.caminho, ev.ctrlKey || ev.metaKey));
    corpo.createDiv({ cls: "erpg-meta", text: atual.revisado ? `caixa ${atual.caixa} · revisada ${relativo(atual.revisado, snap.hoje)}` : "primeira revisão" });

    if (perguntas.length) {
      const i = Math.min(estado.perguntaIdx, perguntas.length - 1);
      const p = perguntas[i]!;
      const area = corpo.createDiv({ cls: "erpg-rola erpg-cartao" });
      area.createDiv({ cls: "erpg-subtitulo", text: `Pergunta ${i + 1} de ${perguntas.length}` });
      md(ctx, area.createDiv({ cls: "erpg-pergunta" }), p.pergunta, n.caminho);
      if (estado.mostrarResposta) md(ctx, area.createDiv({ cls: "erpg-resposta" }), p.resposta, n.caminho);
      const row = corpo.createDiv({ cls: "erpg-acoes" });
      botao(row, estado.mostrarResposta ? "Esconder" : "Ver resposta", () => { estado.mostrarResposta = !estado.mostrarResposta; ctx.acoes.redesenhar(); }, { icone: "eye", pequeno: true, variante: "secundario" });
      if (i < perguntas.length - 1) botao(row, "Próxima pergunta", () => { estado.perguntaIdx = i + 1; estado.mostrarResposta = false; ctx.acoes.redesenhar(); }, { icone: "arrow-right", pequeno: true, variante: "secundario" });
    } else {
      const v = corpo.createDiv({ cls: "erpg-rola erpg-cartao" });
      vazio(v, "Essa nota não tem perguntas.", "Abra, releia e diga se lembrou. Para se testar aqui, adicione na nota callouts “> [!question]- Pergunta” com a resposta embaixo.");
      botao(corpo.createDiv({ cls: "erpg-acoes" }), "Abrir nota", (ev) => ctx.acoes.abrirNota(n.caminho, ev.ctrlKey || ev.metaKey), { icone: "external-link", pequeno: true, variante: "secundario" });
    }

    ornamento(corpo);
    const caixaSeLembrar = aposLembrar({ caixa: n.caixa, revisado: n.revisado }, settings.intervalos);
    const dias = settings.intervalos[caixaSeLembrar] ?? "?";
    const fim = corpo.createDiv({ cls: "erpg-acoes erpg-veredito" });
    botao(fim, `Lembrei · ${dias}d`, () => ctx.acoes.revisar(n, true, proxima), { icone: "check", titulo: `Sobe para a caixa ${caixaSeLembrar}: volta em ${dias} dia(s)` });
    botao(fim, "Esqueci · 1d", () => ctx.acoes.revisar(n, false, proxima), { icone: "rotate-ccw", variante: "secundario", titulo: "Volta para a caixa 1: revisa amanhã" });
    if (proxima) botao(fim, "Pular", () => ctx.acoes.revisarNota(proxima), { variante: "discreto", pequeno: true, titulo: "Deixa esta para depois (continua na fila)" });
    botao(fim, "Fila", () => ctx.acoes.revisarNota(null), { icone: "list", variante: "discreto", pequeno: true, titulo: "Voltar para a lista" });
    return;
  }

  // ---- Lista da fila
  const topo = corpo.createDiv({ cls: "erpg-acoes" });
  const total = fila.reduce((a, x) => a + qtdPerguntas(x.n.caminho), 0);
  botao(topo, "Começar revisão", () => ctx.acoes.revisarNota(fila[0]!.n.caminho), { icone: "play" });
  if (total) topo.createSpan({ cls: "erpg-dica", text: `${total} ${total === 1 ? "pergunta" : "perguntas"} pra se testar` });

  const lista = corpo.createDiv({ cls: "erpg-revisoes erpg-rola" });
  for (const x of fila) {
    const row = lista.createDiv({ cls: "erpg-revisao" });
    const info = row.createDiv({ cls: "erpg-revisao-info" });
    const nome = info.createEl("button", { cls: "erpg-link", text: x.n.label });
    nome.addEventListener("click", (ev) => ctx.acoes.abrirNota(x.n.caminho, ev.ctrlKey || ev.metaKey));
    const q = qtdPerguntas(x.n.caminho);
    const quando = x.revisado ? `caixa ${x.caixa} · ${relativo(x.revisado, snap.hoje)}` : "nunca revisada";
    info.createDiv({ cls: "erpg-meta", text: q ? `${quando} · ${q} ${q === 1 ? "pergunta" : "perguntas"}` : quando });
    botao(row.createDiv({ cls: "erpg-acoes" }), "Revisar", () => ctx.acoes.revisarNota(x.n.caminho), { pequeno: true, variante: "secundario" });
  }
}

// ---------------------------------------------------------------- Atividade (calendário)
export function cronica(root: HTMLElement, ctx: Ctx) {
  const { snap, settings } = ctx;
  const semanas = Math.max(4, Math.min(52, settings.semanasNoCalendario));
  const corpo = painel(root, "calendar-days", "Atividade", `${snap.diario.size} ${snap.diario.size === 1 ? "dia" : "dias"} de estudo`, "is-cronica");

  // Começa na segunda-feira de (semanas-1) semanas atrás.
  const inicio = addDias(snap.hoje, -diaDaSemana(snap.hoje) - (semanas - 1) * 7);
  const grade = corpo.createDiv({ cls: "erpg-grade", attr: { style: `--semanas:${semanas}` } });
  for (let k = 0; k < semanas * 7; k++) {
    const dia = addDias(inicio, k);
    const futuro = diffDias(snap.hoje, dia) > 0;
    const d = snap.diario.get(dia);
    // Faixas configuráveis: cada faixa ultrapassada sobe um tom (até 3).
    const lv = !d ? 0 : Math.min(3, 1 + settings.faixasCalendario.filter((f) => d.minutos >= f).length);
    grade.createSpan({
      cls: `erpg-dia is-n${futuro ? "x" : lv}${dia === snap.hoje ? " is-hoje" : ""}`,
      attr: { title: `${dia}${d ? ` · ${d.minutos} min` : ""}` },
    });
  }
}

// ---------------------------------------------------------------- Trilhas (mapa compacto)
export function mapa(root: HTMLElement, ctx: Ctx) {
  const { snap, estado } = ctx;
  // E se a trilha escolhida sumiu (renomeada/apagada)? Volta para a primeira.
  const ativa = snap.trilhas.find((t) => t.caminho === estado.trilha) ?? snap.trilhas[0];
  const conta = (t: Trilha) => { const x = t.regioes.flatMap((r) => r.topicos); return [x.filter((y) => y.feito).length, x.length] as const; };
  const [f, n] = ativa ? conta(ativa) : [0, 0];
  const corpo = painel(root, "map", "Trilhas", ativa ? `${f} de ${n} tópicos` : undefined, "is-mapa");
  if (!ativa) {
    vazio(corpo, "Nenhuma trilha.", "Crie uma nota com a propriedade tipo: trilha, seções com “#” e tópicos “- [ ] [[Nota]] — descrição”.");
    return;
  }

  // Uma aba por trilha: cada área de estudo fica separada.
  if (snap.trilhas.length > 1) {
    const abas = corpo.createDiv({ cls: "erpg-abas", attr: { role: "tablist" } });
    for (const t of snap.trilhas) {
      const [tf, tn] = conta(t);
      const sel = t === ativa;
      const aba = abas.createEl("button", { cls: `erpg-aba${sel ? " is-ativa" : ""}`, attr: { role: "tab", "aria-selected": String(sel) } });
      aba.createSpan({ text: t.nome });
      aba.createSpan({ cls: "erpg-num", text: `${tn ? Math.round((tf / tn) * 100) : 0}%` });
      aba.addEventListener("click", () => { estado.trilha = t.caminho; ctx.acoes.redesenhar(); });
    }
  }

  const ferramentas = corpo.createDiv({ cls: "erpg-acoes" });
  const busca = ferramentas.createEl("button", { cls: "erpg-busca", attr: { "aria-label": "Buscar tópico" } });
  icone(busca, "search");
  busca.createSpan({ text: "Buscar tópico" });
  busca.addEventListener("click", () => ctx.acoes.abrirTopicos(null));
  botao(ferramentas, "", (ev) => ctx.acoes.abrirNota(ativa.caminho, ev.ctrlKey || ev.metaKey), { icone: "external-link", variante: "secundario", pequeno: true, titulo: `Abrir a nota da trilha ${ativa.nome}` });

  // Regiões agrupadas pelo título `#` acima delas (estágios). Trilha sem estágios = um grupo só.
  const rola = corpo.createDiv({ cls: "erpg-rola" });
  let grid: HTMLElement | null = null;
  let grupoAtual: string | null = null;
  for (const r of ativa.regioes) {
    const g = r.nivelTitulo === 2 ? r.grupo : "";
    if (!grid || g !== grupoAtual) {
      grupoAtual = g;
      if (g) rola.createDiv({ cls: "erpg-rotulo", text: g });
      grid = rola.createDiv({ cls: "erpg-regioes" });
    }
    const feitos = r.topicos.filter((x) => x.feito).length;
    const b = grid.createEl("button", {
      cls: `erpg-regiao${feitos === r.topicos.length ? " is-conquistada" : ""}${r.destaque ? " is-destaque" : ""}`,
      attr: { title: `${r.nome}: ${feitos} de ${r.topicos.length}${r.desc ? `
${r.desc}` : ""}` },
    });
    b.createSpan({ cls: "erpg-regiao-nome", text: r.nome });
    b.createSpan({ cls: "erpg-num", text: `${feitos}/${r.topicos.length}` });
    barra(b, feitos / r.topicos.length, "erpg-barra");
    b.addEventListener("click", () => ctx.acoes.abrirTopicos({ trilha: ativa.caminho, regiao: r.nome }));
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
