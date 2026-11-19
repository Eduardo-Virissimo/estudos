// Folha do sumário, busca, barra de leitura e "continuar lendo".
(() => {
  const html = document.documentElement;
  const raiz = html.dataset.raiz || "";
  const $ = (s) => document.querySelector(s);

  // ---------- guardar a última nota lida (só neste aparelho) ----------
  const CHAVE = "estudos:ultima";
  const guardar = (valor) => { try { localStorage.setItem(CHAVE, JSON.stringify(valor)); } catch {} };
  const lerGuardado = () => { try { return JSON.parse(localStorage.getItem(CHAVE) || "null"); } catch { return null; } };

  if (html.dataset.saida) {
    guardar({
      u: html.dataset.saida,
      t: $(".capitulo h1")?.textContent || document.title,
      s: html.dataset.serie || "",
      m: [$(".marca")?.textContent, $(".capitulo .meta")?.textContent?.split(" · ")[0]].filter(Boolean).join(" · "),
    });
  }
  const continuar = $(".continuar");
  const ultima = lerGuardado();
  if (continuar && ultima && typeof ultima.u === "string" && /^[\w./%-]+\.html$/.test(ultima.u)) {
    const a = continuar.querySelector("a");
    a.href = raiz + ultima.u;
    a.querySelector(".nome").textContent = ultima.t || ultima.u;
    a.querySelector(".meta").textContent = typeof ultima.m === "string" ? ultima.m : "";
    a.setAttribute("aria-label", `Continuar de onde parou: ${a.querySelector(".nome").textContent}`);
    if (typeof ultima.s === "string" && /^[a-z0-9.-]+$/.test(ultima.s)) continuar.dataset.serie = ultima.s;
    continuar.hidden = false;
    // A fitinha de "onde você parou" também aparece na estante, no link da nota.
    const alvo = new URL(raiz + ultima.u, location.href).href;
    for (const link of document.querySelectorAll("main .arvore a[href]")) {
      if (link.href === alvo) link.classList.add("parou");
    }
  }

  // ---------- folha do sumário ----------
  const folha = $("#folha");
  const abrir = $(".abrir-sumario");
  const fechar = $(".fechar-sumario");
  let aberta = false;

  function abrirFolha() {
    if (aberta) return;
    aberta = true;
    folha.hidden = false;
    document.body.classList.add("folha-aberta");
    abrir.setAttribute("aria-expanded", "true");
    history.pushState({ folha: true }, "");
    const atual = folha.querySelector('a[aria-current="page"]');
    requestAnimationFrame(() => {
      atual?.scrollIntoView({ block: "center" });
      fechar.focus({ preventScroll: true });
    });
  }

  function fecharFolha(daHistoria) {
    if (!aberta) return;
    aberta = false;
    folha.hidden = true;
    document.body.classList.remove("folha-aberta");
    abrir.setAttribute("aria-expanded", "false");
    abrir.focus({ preventScroll: true });
    if (!daHistoria && history.state?.folha) history.back();
  }

  abrir.addEventListener("click", abrirFolha);
  fechar.addEventListener("click", () => fecharFolha(false));
  addEventListener("popstate", () => fecharFolha(true)); // botão "voltar" do celular fecha a folha
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") fecharFolha(false); });
  // Ao tocar num link da folha, ela some antes de navegar (sem deixar estado sobrando no histórico).
  folha.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || !aberta) return;
    e.preventDefault();
    aberta = false;
    location.replace(a.href);
  });

  // ---------- busca ----------
  const campo = folha.querySelector(".busca input");
  const lista = folha.querySelector(".resultados");
  const normalizar = (s) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
  let notas = null;
  const carregar = () =>
    (notas ??= fetch(raiz + "assets/busca.json")
      .then((r) => r.json())
      .then((itens) => itens.map((n) => ({ ...n, chave: normalizar(n.t + " " + n.s) })))
      .catch(() => []));

  const el = (tag, props, ...filhos) => {
    const e = Object.assign(document.createElement(tag), props);
    e.append(...filhos);
    return e;
  };

  async function buscar() {
    const termos = normalizar(campo.value.trim()).split(/\s+/).filter(Boolean);
    folha.classList.toggle("buscando", termos.length > 0);
    if (!termos.length) return (lista.hidden = true);
    const achadas = (await carregar())
      .filter((n) => termos.every((t) => n.chave.includes(t)))
      .sort((a, b) => {
        const pa = normalizar(a.t).indexOf(termos[0]), pb = normalizar(b.t).indexOf(termos[0]);
        return (pa < 0) - (pb < 0) || pa - pb || a.t.localeCompare(b.t, "pt-BR");
      })
      .slice(0, 30);
    lista.replaceChildren(
      ...(achadas.length
        ? achadas.map((n) => el("li", {}, el("a", { href: raiz + n.u }, n.t, el("small", {}, n.s))))
        : [el("li", { className: "vazio" }, "Nenhuma nota com esse nome. Tente outra palavra.")]),
    );
    lista.hidden = false;
  }

  campo.addEventListener("input", buscar);
  campo.addEventListener("focus", carregar);
  campo.addEventListener("keydown", (e) => {
    const primeiro = lista.querySelector("a");
    if (e.key === "Enter" && primeiro) { e.preventDefault(); primeiro.click(); }
  });

  // ---------- barra de leitura ----------
  const barra = $(".progresso");
  if (barra && html.dataset.saida) {
    let pedido = false;
    const atualizar = () => {
      pedido = false;
      const total = document.documentElement.scrollHeight - innerHeight;
      barra.style.transform = `scaleX(${total > 0 ? Math.min(1, scrollY / total) : 0})`;
    };
    addEventListener("scroll", () => { if (!pedido) { pedido = true; requestAnimationFrame(atualizar); } }, { passive: true });
    atualizar();
  }
})();
