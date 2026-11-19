// Menu lateral (no celular) e busca por nome de nota.
(() => {
  const raiz = document.documentElement.dataset.raiz || "";

  // ---------- menu ----------
  const botao = document.querySelector(".botao-menu");
  const veu = document.querySelector(".veu");
  const alternar = (abrir) => {
    document.body.classList.toggle("menu-aberto", abrir);
    botao.setAttribute("aria-expanded", String(abrir));
    botao.setAttribute("aria-label", abrir ? "Fechar o menu" : "Abrir o menu");
  };
  botao.addEventListener("click", () => alternar(!document.body.classList.contains("menu-aberto")));
  veu.addEventListener("click", () => alternar(false));
  document.addEventListener("keydown", (e) => e.key === "Escape" && alternar(false));
  document.querySelector('.lateral a[aria-current="page"]')?.scrollIntoView({ block: "center" });

  // ---------- busca ----------
  const campo = document.querySelector(".busca input");
  const lista = document.querySelector(".resultados");
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
    if (!termos.length) return (lista.hidden = true);
    const achadas = (await carregar())
      .filter((n) => termos.every((t) => n.chave.includes(t)))
      .sort((a, b) => normalizar(a.t).indexOf(termos[0]) - normalizar(b.t).indexOf(termos[0]) || a.t.localeCompare(b.t, "pt-BR"))
      .slice(0, 20);
    lista.replaceChildren(
      ...(achadas.length
        ? achadas.map((n) => el("li", {}, el("a", { href: raiz + n.u }, n.t, el("small", {}, n.s))))
        : [el("li", { className: "vazio" }, "Nenhuma nota com esse nome.")]),
    );
    lista.hidden = false;
  }

  campo.addEventListener("input", buscar);
  campo.addEventListener("focus", () => { carregar(); campo.value && buscar(); });
  campo.addEventListener("keydown", (e) => {
    const links = [...lista.querySelectorAll("a")];
    const i = links.indexOf(document.activeElement);
    if (e.key === "ArrowDown" && links.length) { e.preventDefault(); links[0].focus(); }
    if (e.key === "Enter" && links.length && i < 0) location.href = links[0].href;
    if (e.key === "Escape") { lista.hidden = true; campo.blur(); }
  });
  lista.addEventListener("keydown", (e) => {
    const links = [...lista.querySelectorAll("a")];
    const i = links.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); links[Math.min(i + 1, links.length - 1)].focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); i <= 0 ? campo.focus() : links[i - 1].focus(); }
    if (e.key === "Escape") { lista.hidden = true; campo.focus(); }
  });
  document.addEventListener("click", (e) => { if (!e.target.closest(".busca")) lista.hidden = true; });

  // "/" foca a busca (no PC)
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== campo && !e.target.closest("input, textarea")) {
      e.preventDefault();
      campo.focus();
    }
  });
})();
