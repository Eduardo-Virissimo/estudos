// Folha do sumário, busca, faixa do topo, revisão das perguntas e "continuar de onde parou".
// Tudo que é guardado fica só neste aparelho (localStorage).
(() => {
  const html = document.documentElement;
  const raiz = html.dataset.raiz || "";
  const saida = html.dataset.saida || "";
  const $ = (s, de = document) => de.querySelector(s);
  const $$ = (s, de = document) => [...de.querySelectorAll(s)];
  const ler = (chave, padrao) => { try { return JSON.parse(localStorage.getItem(chave) || "null") ?? padrao; } catch { return padrao; } };
  const gravar = (chave, valor) => { try { localStorage.setItem(chave, JSON.stringify(valor)); } catch {} };
  const el = (tag, props, ...filhos) => {
    const e = Object.assign(document.createElement(tag), props);
    e.append(...filhos);
    return e;
  };
  const ID_SEGURO = /^[\p{L}\p{N}_-]+$/u;

  // ---------- continuar de onde parou (a nota e a seção) ----------
  const CHAVE = "estudos:ultima";
  if (saida) {
    const base = {
      u: saida,
      t: $(".capitulo h1")?.textContent || document.title,
      s: html.dataset.serie || "",
      m: [$(".marca span")?.textContent, $(".capitulo .meta")?.textContent?.split(" · ")[0]].filter(Boolean).join(" · "),
    };
    // A seção mais próxima acima do topo da tela é o "onde parei".
    const secaoAtual = () => {
      let id = "";
      for (const h of $$(".nota h2[id], .nota h3[id]")) {
        if (h.getBoundingClientRect().top > 120) break;
        id = h.id;
      }
      return id;
    };
    const salvar = () => gravar(CHAVE, { ...base, h: secaoAtual() });
    salvar();
    let espera;
    addEventListener("scroll", () => { clearTimeout(espera); espera = setTimeout(salvar, 400); }, { passive: true });
    addEventListener("pagehide", salvar);
  }
  const continuar = $(".continuar");
  const ultima = ler(CHAVE, null);
  if (continuar && ultima && typeof ultima.u === "string" && /^[\w./%-]+\.html$/.test(ultima.u)) {
    const a = $("a", continuar);
    const secao = typeof ultima.h === "string" && ID_SEGURO.test(ultima.h) ? "#" + encodeURIComponent(ultima.h) : "";
    a.href = raiz + ultima.u + secao;
    $(".nome", a).textContent = ultima.t || ultima.u;
    $(".meta", a).textContent = typeof ultima.m === "string" ? ultima.m : "";
    a.setAttribute("aria-label", `Continuar de onde parou: ${$(".nome", a).textContent}`);
    if (typeof ultima.s === "string" && /^[a-z0-9.-]+$/.test(ultima.s)) continuar.dataset.serie = ultima.s;
    continuar.hidden = false;
    const alvo = new URL(raiz + ultima.u, location.href).href;
    for (const link of $$("main .arvore a[href]")) if (link.href === alvo) link.classList.add("parou");
  }

  // ---------- link pra uma seção dentro de um bloco fechado (estágios do Roadmap) ----------
  function abrirAlvo() {
    let alvo;
    try { alvo = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
    if (!alvo) return;
    for (let d = alvo; d; d = d.parentElement?.closest("details")) if (d.tagName === "DETAILS") d.open = true;
    requestAnimationFrame(() => alvo.scrollIntoView());
  }
  addEventListener("hashchange", abrirAlvo);
  abrirAlvo();

  // ---------- folha do sumário ----------
  const folha = $("#folha");
  const botaoSumario = $(".b-sumario");
  const fechar = $(".fechar-sumario");
  const campo = $(".busca input", folha);
  const limpar = $(".limpar-busca", folha);
  let aberta = false;
  let quemAbriu = botaoSumario;

  function abrirFolha(comBusca, origem) {
    quemAbriu = origem || botaoSumario;
    if (!aberta) {
      aberta = true;
      folha.hidden = false;
      document.body.classList.add("folha-aberta");
      botaoSumario.setAttribute("aria-expanded", "true");
      history.pushState({ folha: true }, "");
    }
    if (comBusca) {
      campo.focus(); // dentro do toque, pra o teclado do celular abrir
      carregar();
    } else {
      const atual = $('a[aria-current="page"]', folha);
      requestAnimationFrame(() => {
        atual?.scrollIntoView({ block: "center" });
        fechar.focus({ preventScroll: true });
      });
    }
  }

  function fecharFolha(daHistoria) {
    if (!aberta) return;
    aberta = false;
    folha.hidden = true;
    document.body.classList.remove("folha-aberta");
    botaoSumario.setAttribute("aria-expanded", "false");
    quemAbriu?.focus({ preventScroll: true });
    if (!daHistoria && history.state?.folha) history.back();
  }

  botaoSumario.addEventListener("click", (e) => abrirFolha(false, e.currentTarget));
  $(".b-buscar").addEventListener("click", (e) => abrirFolha(true, e.currentTarget));
  fechar.addEventListener("click", () => fecharFolha(false));
  addEventListener("popstate", () => fecharFolha(true)); // botão "voltar" do celular fecha a folha
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") fecharFolha(false); });
  folha.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || !aberta) return;
    e.preventDefault();
    aberta = false;
    location.replace(a.href);
  });

  // ---------- busca (notas e seções) ----------
  const lista = $(".resultados", folha);
  const normalizar = (s) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
  let itens = null;
  const carregar = () =>
    (itens ??= fetch(raiz + "assets/busca.json")
      .then((r) => r.json())
      .then((todos) => todos.map((n) => ({ ...n, chave: normalizar(n.t + " " + n.s), titulo: normalizar(n.t) })))
      .catch(() => []));

  /** Texto com os trechos que bateram com a busca marcados. */
  function marcado(texto, termos) {
    const norm = normalizar(texto);
    const marcas = new Array(texto.length).fill(false);
    for (const t of termos) for (let i = norm.indexOf(t); i >= 0; i = norm.indexOf(t, i + 1)) marcas.fill(true, i, i + t.length);
    // normalizar() mantém o tamanho da string em português (letra + acento vira uma letra só)
    if (norm.length !== texto.length) return [texto];
    const partes = [];
    for (let i = 0; i < texto.length; ) {
      let j = i;
      while (j < texto.length && marcas[j] === marcas[i]) j++;
      partes.push(marcas[i] ? el("mark", { textContent: texto.slice(i, j) }) : texto.slice(i, j));
      i = j;
    }
    return partes;
  }

  async function buscar() {
    const termos = normalizar(campo.value.trim()).split(/\s+/).filter(Boolean);
    folha.classList.toggle("buscando", termos.length > 0);
    limpar.hidden = !campo.value;
    if (!termos.length) return (lista.hidden = true);
    const achadas = (await carregar())
      .filter((n) => termos.every((t) => n.chave.includes(t)))
      .sort((a, b) => {
        const pa = a.titulo.indexOf(termos[0]), pb = b.titulo.indexOf(termos[0]);
        return (pa < 0) - (pb < 0) || (a.k || 0) - (b.k || 0) || pa - pb || a.t.localeCompare(b.t, "pt-BR");
      })
      .slice(0, 40);
    lista.replaceChildren(
      ...(achadas.length
        ? achadas.map((n) =>
            el("li", {}, el("a", { href: raiz + n.u, className: n.k ? "secao" : "" }, el("span", {}, ...marcado(n.t, termos)), el("small", {}, n.k ? `seção em ${n.s}` : n.s))),
          )
        : [el("li", { className: "vazio" }, `Nada com “${campo.value.trim()}”. Tente uma palavra do título ou de uma seção.`)]),
    );
    lista.hidden = false;
    lista.scrollTop = 0;
  }

  campo.addEventListener("input", buscar);
  campo.addEventListener("focus", carregar);
  campo.addEventListener("keydown", (e) => {
    const primeiro = $("a", lista);
    if (e.key === "Enter" && primeiro && !lista.hidden) { e.preventDefault(); primeiro.click(); }
  });
  limpar.addEventListener("click", () => { campo.value = ""; buscar(); campo.focus(); });

  // ---------- faixa do topo: some ao descer, volta ao subir ----------
  const topo = $(".topo");
  const progresso = $(".progresso");
  let ultimoY = scrollY;
  let pedido = false;
  const aoRolar = () => {
    pedido = false;
    const y = scrollY;
    if (topo) {
      if (y > ultimoY + 8 && y > 120) topo.classList.add("escondido");
      else if (y < ultimoY - 8 || y < 60) topo.classList.remove("escondido");
    }
    if (Math.abs(y - ultimoY) > 8) ultimoY = y;
    if (progresso) {
      const total = document.documentElement.scrollHeight - innerHeight;
      progresso.style.transform = `scaleX(${total > 0 ? Math.min(1, y / total) : 0})`;
    }
  };
  addEventListener("scroll", () => { if (!pedido) { pedido = true; requestAnimationFrame(aoRolar); } }, { passive: true });
  aoRolar();
  topo?.addEventListener("focusin", () => topo.classList.remove("escondido"));

  // ---------- revisão: Acertei / Rever em cada pergunta ----------
  const fichas = $$(".nota .ficha");
  const botaoRevisar = $(".b-revisar");
  if (fichas.length && saida) {
    const CHAVE_REV = "estudos:rev:" + saida;
    const estados = ler(CHAVE_REV, {});
    const chaveDe = (f) => normalizar($(".ficha-pergunta", f)?.textContent || "").slice(0, 120);

    // Placar logo abaixo do título da seção das perguntas.
    let titulo = fichas[0].previousElementSibling;
    while (titulo && !/^H[23]$/.test(titulo.tagName)) titulo = titulo.previousElementSibling;
    const placar = el("p", { className: "placar" });
    (titulo ?? fichas[0]).after(placar);
    if (!titulo) fichas[0].before(placar);
    const alvoRevisao = titulo ?? fichas[0];

    const atualizar = () => {
      const certas = fichas.filter((f) => estados[chaveDe(f)] === "ok").length;
      const rever = fichas.filter((f) => estados[chaveDe(f)] === "rever").length;
      placar.textContent =
        certas + rever === 0
          ? `${fichas.length} perguntas. Responda de cabeça antes de abrir.`
          : `${certas} de ${fichas.length} certas${rever ? ` · ${rever} pra rever` : ""}`;
      if (botaoRevisar) $(".b-conta", botaoRevisar).textContent = `${certas}/${fichas.length}`;
    };

    for (const f of fichas) {
      const chave = chaveDe(f);
      if (estados[chave]) f.dataset.estado = estados[chave];
      const resposta = $(":scope > details.resposta, details.resposta", f);
      const acoes = el(
        "div",
        { className: "ficha-acoes", hidden: !resposta?.open },
        el("button", { type: "button", className: "acertei", textContent: "Acertei" }),
        el("button", { type: "button", className: "rever", textContent: "Rever depois" }),
      );
      f.append(acoes);
      resposta?.addEventListener("toggle", () => { acoes.hidden = !resposta.open; });
      acoes.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        const novo = b.classList.contains("acertei") ? "ok" : "rever";
        if (estados[chave] === novo) delete estados[chave];
        else estados[chave] = novo;
        if (estados[chave]) f.dataset.estado = estados[chave];
        else delete f.dataset.estado;
        gravar(CHAVE_REV, estados);
        atualizar();
        if (resposta && estados[chave]) resposta.open = false;
      });
    }
    atualizar();

    if (botaoRevisar) {
      botaoRevisar.hidden = false;
      botaoRevisar.addEventListener("click", () => {
        const pendente = fichas.find((f) => estados[chaveDe(f)] !== "ok") ?? fichas[0];
        const ePrimeira = pendente === fichas[0];
        (ePrimeira ? alvoRevisao : pendente).scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
        pendente.classList.add("piscando");
        setTimeout(() => pendente.classList.remove("piscando"), 900);
      });
    }
  }
})();
