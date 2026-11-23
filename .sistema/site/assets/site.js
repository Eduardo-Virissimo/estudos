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

  const SAIDA_SEGURA = /^[\w./%-]+\.html$/;
  const SERIE_SEGURA = /^[a-z0-9.-]+$/;
  const fracao = () => {
    const total = document.documentElement.scrollHeight - innerHeight;
    return total > 0 ? Math.min(1, Math.max(0, scrollY / total)) : 1;
  };
  /** Barrinha de progresso (fio da coleção crescendo da esquerda). */
  const encher = (barra, f) => { const miolo = barra && $("span", barra); if (miolo) miolo.style.transform = `scaleX(${Math.min(1, Math.max(0, f))})`; };

  // ---------- notas lidas (guardadas no aparelho) ----------
  // Uma nota conta como lida quando o fim dela aparece na tela.
  const CHAVE_LIDAS = "estudos:lidas";
  let lidas = ler(CHAVE_LIDAS, {});
  if (!lidas || typeof lidas !== "object" || Array.isArray(lidas)) lidas = {};
  const base = new URL(raiz || "./", location.href).pathname;
  /** "programacao/02-fundamentos/funcoes/funcoes.html" de um link do sumário. */
  const saidaDe = (a) => {
    const p = new URL(a.href, location.href).pathname;
    try { return p.startsWith(base) ? decodeURIComponent(p.slice(base.length)) : ""; } catch { return ""; }
  };

  const metaCapitulo = $(".capitulo .meta");
  const mostrarLida = () => {
    if (!metaCapitulo || !lidas[saida] || $(".lida-selo", metaCapitulo)) return;
    metaCapitulo.append(el("span", { className: "lida-selo" }, el("span", { ariaHidden: "true", textContent: " · " }), "lida"));
  };
  if (saida) {
    mostrarLida();
    const fim = $(".nota")?.lastElementChild;
    if (fim && "IntersectionObserver" in window) {
      const olho = new IntersectionObserver((vistos) => {
        if (!vistos.some((v) => v.isIntersecting)) return;
        olho.disconnect();
        if (!lidas[saida]) { lidas[saida] = Date.now(); gravar(CHAVE_LIDAS, lidas); }
        mostrarLida();
      });
      // Espera o leitor começar a rolar: abrir uma nota não é o mesmo que ler até o fim.
      const comecar = () => { removeEventListener("scroll", comecar); olho.observe(fim); };
      if (fracao() >= 1) olho.observe(fim);
      else addEventListener("scroll", comecar, { passive: true });
    }
  }

  // ---------- continuar de onde parou (a nota, a seção e quanto já leu) ----------
  const CHAVE = "estudos:ultima";
  if (saida) {
    const info = {
      u: saida,
      t: $(".capitulo h1")?.textContent || document.title,
      s: html.dataset.serie || "",
      m: [$(".marca span")?.textContent, metaCapitulo?.textContent?.split(" · ")[0]].filter(Boolean).join(" · "),
      n: Number(html.dataset.min) || 0,
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
    const salvar = () => gravar(CHAVE, { ...info, h: secaoAtual(), p: Math.round(fracao() * 100) / 100 });
    salvar();
    let espera;
    addEventListener("scroll", () => { clearTimeout(espera); espera = setTimeout(salvar, 400); }, { passive: true });
    addEventListener("pagehide", salvar);
  }

  // ---------- sumário e estante: ✓ nas lidas, contagens "4/13" e barrinhas ----------
  for (const a of $$(".arvore a[href]")) if (lidas[saidaDe(a)]) a.classList.add("lida");
  const contar = (raizEl) => {
    const links = $$("a[href]", raizEl);
    return { total: links.length, lidas: links.filter((a) => a.classList.contains("lida")).length };
  };
  for (const d of $$(".arvore details")) {
    const { total, lidas: n } = contar(d);
    const conta = $(":scope > summary .conta", d);
    if (!n || !conta) continue;
    conta.textContent = `${n}/${total}`;
    $(":scope > summary", d).style.setProperty("--feito", `${(n / total) * 100}%`);
    $(":scope > summary", d).classList.add("com-lidas");
  }

  // ---------- página inicial ----------
  const colecoes = $$("main .colecao");
  if (colecoes.length) {
    let todas = 0, todasLidas = 0;
    for (const c of colecoes) {
      const { total, lidas: n } = contar($(".arvore", c));
      todas += total; todasLidas += n;
      const conta = $(".lombada .conta", c);
      if (conta && n) conta.textContent = `${n} de ${total} lidas`;
      const livro = $(`.estante .livro[data-serie="${c.dataset.serie}"]`);
      if (livro) {
        if (n) $(".livro-conta", livro).textContent = `${n}/${total}`;
        encher($(".barrinha", livro), total ? n / total : 0);
        livro.setAttribute("aria-label", `${$(".livro-nome", livro).textContent}: ${n} de ${total} notas lidas`);
      }
    }
    const placar = $(".placar-geral");
    if (placar && todasLidas) {
      $(".texto", placar).textContent = `${todasLidas} de ${todas} capítulos lidos`;
      encher($(".barrinha", placar), todasLidas / todas);
      placar.hidden = false;
    }

    // Cartão da capa: continuar a nota aberta; se ela já foi lida, o próximo capítulo dela;
    // sem histórico (ou com nota que não existe mais), o primeiro capítulo ainda não lido.
    const continuar = $(".continuar");
    const links = colecoes.flatMap((c) => $$(".arvore a[href]", c));
    const ultima = ler(CHAVE, null);
    const valida = ultima && typeof ultima.u === "string" && SAIDA_SEGURA.test(ultima.u);
    const linkUltima = valida ? links.find((a) => saidaDe(a) === ultima.u) : undefined;
    const proximaNaoLida = (depois) => {
      const c = depois?.closest(".colecao");
      const lista = c ? $$(".arvore a[href]", c) : links;
      const i = depois ? lista.indexOf(depois) : -1;
      return lista.slice(i + 1).find((a) => !a.classList.contains("lida")) ?? (depois ? undefined : links.find((a) => !a.classList.contains("lida")));
    };
    let cartao;
    if (linkUltima && !lidas[ultima.u]) {
      const secao = typeof ultima.h === "string" && ID_SEGURO.test(ultima.h) ? "#" + encodeURIComponent(ultima.h) : "";
      const p = typeof ultima.p === "number" ? Math.min(1, Math.max(0, ultima.p)) : 0;
      const min = typeof ultima.n === "number" && ultima.n > 0 ? Math.max(1, Math.round(ultima.n * (1 - p))) : 0;
      cartao = {
        href: raiz + ultima.u + secao, nome: ultima.t || linkUltima.textContent, meta: typeof ultima.m === "string" ? ultima.m : "",
        serie: ultima.s, verbo: "Continuar leitura", falta: min ? `faltam ${min} min` : "", p, link: linkUltima,
      };
    } else {
      const prox = proximaNaoLida(linkUltima);
      if (prox) {
        let secaoNome = prox.closest("details")?.querySelector(":scope > summary span")?.textContent || "";
        // Pasta com o mesmo nome da nota ("Roadmap 🗺️" › "Roadmap") não repete o nome na meta.
        const simples = (s) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();
        if (simples(secaoNome).startsWith(simples(prox.textContent))) secaoNome = "";
        const c = prox.closest(".colecao");
        cartao = {
          href: prox.href, nome: prox.textContent, meta: [$(".lombada span", c)?.textContent, secaoNome].filter(Boolean).join(" · "),
          serie: c?.dataset.serie, verbo: linkUltima ? "Próximo capítulo" : "Começar por aqui", falta: "", link: prox,
        };
      }
    }
    if (continuar && cartao) {
      const a = $("a", continuar);
      a.href = cartao.href;
      $(".nome", a).textContent = cartao.nome;
      $(".meta", a).textContent = cartao.meta;
      $(".verbo", a).textContent = cartao.verbo;
      $(".falta", a).textContent = cartao.falta;
      const barra = $(".barrinha", a);
      barra.hidden = cartao.p === undefined;
      encher(barra, cartao.p ?? 0);
      a.setAttribute("aria-label", `${cartao.verbo}: ${cartao.nome}${cartao.falta ? ", " + cartao.falta : ""}`);
      if (typeof cartao.serie === "string" && SERIE_SEGURA.test(cartao.serie)) continuar.dataset.serie = cartao.serie;
      continuar.hidden = false;
      cartao.link.classList.add("parou");
    }
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
