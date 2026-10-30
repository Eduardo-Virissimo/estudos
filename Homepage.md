---
cssclasses:
  - estudos-home
---
```dataviewjs
const ROADMAP_NAME = "Roadmap";            // nome da nota do roadmap
const STORE_KEY = "estudos-home-secao";    // lembra a última seção aberta
const MAX_SEARCH = 90;

const norm = s => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pct = (d, t) => t ? (d / t * 100).toFixed(1).replace(".", ",") : "0,0";
function cleanHeading(t) {
  return t.replace(/^(?:[0-9#*]\uFE0F?\u20E3\s*)+/u, "")
    .replace(/\p{Extended_Pictographic}|\uFE0F|\u200D|\u20E3/gu, "").trim();
}
function cleanFolder(n) {
  return n.replace(/\p{Extended_Pictographic}|\uFE0F|\u200D/gu, "").replace(/^\s*\d+\s*-\s*/, "").trim();
}

const ICON_CHECK = '<svg class="es-ico-check" viewBox="0 0 24 24"><polyline points="5 12 10 17 19 7"/></svg>';
const ICON_FILE = '<svg class="es-card-ico" viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><polyline points="14 3 14 8 19 8"/></svg>';
const ICON_NEW = '<svg class="es-card-ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke-dasharray="3 3"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>';

const ICON_STAR = '<svg class="es-star" viewBox="0 0 24 24"><polygon points="12 2.5 14.9 8.8 21.7 9.5 16.6 14.1 18 20.8 12 17.4 6 20.8 7.4 14.1 2.3 9.5 9.1 8.8"/></svg>';

const files = app.vault.getMarkdownFiles();
const roadmap = files.find(f => f.basename === ROADMAP_NAME && /roadmap/i.test((f.parent && f.parent.name) || ""))
  || files.find(f => f.basename === ROADMAP_NAME);

const readmeByFolder = new Map();
files.forEach(f => {
  if (f.basename.toLowerCase() === "readme" && f.parent) readmeByFolder.set(norm(cleanFolder(f.parent.name)), f);
});

function parse(text) {
  const lines = text.split(/\r?\n/);
  const sections = [];
  let cur = null;
  lines.forEach((line, idx) => {
    let m = line.match(/^(#{1,2})\s+(.*)$/);
    if (m) {
      cur = { name: cleanHeading(m[2]), level: m[1].length, featured: /⭐/.test(m[2]), ordered: /🧭/.test(m[2]), desc: "", items: [] };
      sections.push(cur);
      return;
    }
    if (!cur) return;
    m = line.match(/^>\s?(.*)$/);
    if (m) {
      if (!cur.desc && cur.items.length === 0) cur.desc = m[1].trim();
      return;
    }
    m = line.match(/^\s*-\s\[([ xX])\]\s+(.*)$/);
    if (!m) return;
    const rest = m[2];
    const lm = rest.match(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/);
    if (!lm) return;
    const target = lm[1].trim();
    let label = lm[2] ? lm[2].trim() : target.split("/").pop();
    if (label.toLowerCase() === "readme") {
      const parts = target.split("/");
      label = parts[parts.length - 2] || label;
    }
    const after = rest.slice(rest.indexOf(lm[0]) + lm[0].length);
    const dash = after.indexOf("—");
    const desc = (dash >= 0 ? after.slice(dash + 1) : after).replace(/[`*]/g, "").trim();
    const dest = app.metadataCache.getFirstLinkpathDest(target, roadmap.path);
    const readme = readmeByFolder.get(norm(label));
    cur.items.push({
      label: label, target: target, desc: desc, done: m[1].toLowerCase() === "x",
      line: idx, raw: line, path: dest ? dest.path : (readme ? readme.path : null)
    });
  });
  return sections.filter(s => s.items.length > 0);
}

async function run() {
  const text = await app.vault.cachedRead(roadmap);
  const sections = parse(text);
  const state = { sel: 0, q: "", f: "all" };
  const saved = app.loadLocalStorage(STORE_KEY);
  const si = sections.findIndex(s => s.name === saved);
  if (si >= 0) state.sel = si;

  dv.container.innerHTML =
    '<div class="estudos-page">'
    + '<div class="es-rail">'
    + '<div class="es-brand"><div class="es-wordmark">Estudos<i>.</i></div><div class="es-tagline">roadmap de programação</div></div>'
    + '<label class="es-search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>'
    + '<input type="text" placeholder="Buscar tópicos" spellcheck="false"><kbd>/</kbd></label>'
    + '<div class="es-global"></div>'
    + '<div class="es-list"></div>'
    + "</div>"
    + '<div class="es-main"></div>'
    + "</div>";

  const root = dv.container;
  const elGlobal = root.querySelector(".es-global");
  const elList = root.querySelector(".es-list");
  const elMain = root.querySelector(".es-main");
  const input = root.querySelector(".es-search input");

  const count = s => s.items.filter(i => i.done).length;

  function renderGlobal() {
    let t = 0, d = 0;
    sections.forEach(s => { t += s.items.length; d += count(s); });
    elGlobal.innerHTML = '<span class="es-g-label">Progresso geral</span>'
      + '<div class="es-g-row"><strong>' + pct(d, t) + '%</strong><span>' + d + " de " + t + " tópicos</span></div>"
      + '<span class="es-g-bar"><b style="width:' + (t ? d / t * 100 : 0) + '%"></b></span>';
  }

  function renderList() {
    const keep = elList.scrollTop;
    const item = (s, i) => {
      const d = count(s), t = s.items.length, complete = d === t;
      const cls = "es-item" + (i === state.sel && !state.q ? " is-active" : "") + (complete ? " is-complete" : "");
      return '<button class="' + cls + '" data-s="' + i + '"><span class="es-item-name">'
        + (s.featured ? ICON_STAR : "") + esc(s.name) + "</span>"
        + (complete ? ICON_CHECK : '<span class="es-item-meta">' + d + "/" + t + "</span>") + "</button>";
    };
    const groups = [
      ["Em destaque", sections.filter(s => s.featured)],
      ["Roadmap", sections.filter(s => !s.featured && s.level === 1)],
      ["Transversais", sections.filter(s => !s.featured && s.level === 2)]
    ];
    let html = "";
    groups.forEach(g => {
      if (!g[1].length) return;
      html += '<div class="es-group">' + g[0] + "</div>";
      g[1].forEach(s => { html += item(s, sections.indexOf(s)); });
    });
    elList.innerHTML = html;
    elList.scrollTop = keep;
  }

  function card(it, s, i, showSection, step, next) {
    const cls = "es-card" + (it.done ? " is-done" : "") + (step ? " is-step" : "") + (next ? " is-next" : "") + (it.path ? "" : " is-missing");
    const tip = next ? "Próximo passo da trilha" : it.path ? "Abrir nota" : "Ainda sem nota. Clique para criar.";
    return '<div class="' + cls + '" tabindex="0" role="link" data-s="' + s + '" data-i="' + i + '" title="' + tip + '">'
      + '<button class="es-tick" data-s="' + s + '" data-i="' + i + '" aria-label="Marcar como estudado" title="Marcar como estudado"><svg viewBox="0 0 24 24"><polyline points="5 12 10 17 19 7"/></svg></button>'
      + '<div class="es-card-body">'
      + (step ? '<div class="es-card-step"><span class="es-step-num">' + String(step).padStart(2, "0") + "</span>" + (next ? '<svg class="es-step-go" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></svg>' : "") + "</div>" : "")
      + (showSection ? '<div class="es-card-sec">' + esc(sections[s].name) + "</div>" : "")
      + '<div class="es-card-title"><span>' + esc(it.label) + "</span>" + (it.path ? ICON_FILE : ICON_NEW) + "</div>"
      + (it.desc ? '<div class="es-card-desc">' + esc(it.desc) + "</div>" : "")
      + "</div></div>";
  }

  function ring(d, t) {
    const c = 2 * Math.PI * 30;
    const off = c * (1 - (t ? d / t : 0));
    return '<div class="es-ring"><svg viewBox="0 0 72 72"><circle class="es-ring-bg" cx="36" cy="36" r="30"/>'
      + '<circle class="es-ring-fg" cx="36" cy="36" r="30" stroke-dasharray="' + c.toFixed(2) + '" stroke-dashoffset="' + off.toFixed(2) + '"/></svg>'
      + '<span class="es-ring-text">' + Math.round(t ? d / t * 100 : 0) + "%</span></div>";
  }

  function renderMain(keepScroll) {
    const old = elMain.querySelector(".es-cards");
    const top = keepScroll && old ? old.scrollTop : 0;
    let head = "", body = "", filters = "";
    if (state.q) {
      const q = norm(state.q);
      const found = [];
      sections.forEach((s, a) => s.items.forEach((it, b) => {
        if (norm(it.label).includes(q) || norm(it.desc).includes(q)) found.push([it, a, b]);
      }));
      head = '<div class="es-head"><div class="es-head-text"><div class="es-eyebrow">Busca</div><div class="es-title">Resultados</div>'
        + '<div class="es-sub">' + found.length + " tópico(s) para “" + esc(state.q) + "”</div></div></div>";
      body = found.slice(0, MAX_SEARCH).map(f => card(f[0], f[1], f[2], true)).join("")
        || '<div class="es-empty">Nenhum tópico encontrado.</div>';
    } else {
      const s = sections[state.sel];
      const d = count(s), t = s.items.length;
      head = '<div class="es-head"><div class="es-head-text"><div class="es-eyebrow">' + (s.ordered ? "Trilha de estudo" : s.featured ? "Em destaque" : s.level === 2 ? "Transversal" : "Roadmap") + "</div>"
        + '<div class="es-title">' + esc(s.name) + "</div>" + (s.desc ? '<div class="es-sub">' + esc(s.desc) + "</div>" : "") + "</div>"
        + '<div class="es-prog"><div class="es-prog-text"><strong>' + d + " de " + t + "</strong><span>estudados</span></div>" + ring(d, t) + "</div></div>";
      filters = '<div class="es-filters">'
        + [["all", "Todos", t], ["todo", "Pendentes", t - d], ["done", "Estudados", d]].map(p =>
          '<button class="es-pill' + (state.f === p[0] ? " is-active" : "") + '" data-f="' + p[0] + '">' + p[1] + "<span>" + p[2] + "</span></button>"
        ).join("") + "</div>";
      const list = s.items.map((it, ii) => [it, ii])
        .filter(p => state.f === "all" || (state.f === "done" ? p[0].done : !p[0].done));
      const nextI = s.ordered ? s.items.findIndex(x => !x.done) : -1;
      body = list.map(p => card(p[0], state.sel, p[1], false, s.ordered ? p[1] + 1 : 0, p[1] === nextI)).join("")
        || '<div class="es-empty">' + (state.f === "done" ? "Nada estudado ainda nesta seção." : "Tudo estudado por aqui.") + "</div>";
    }
    elMain.innerHTML = head + filters + '<div class="es-cards">' + body + "</div>";
    const nu = elMain.querySelector(".es-cards");
    if (nu) nu.scrollTop = top;
  }

  async function toggle(it) {
    let changed = false;
    await app.vault.process(roadmap, data => {
      const lines = data.split("\n");
      const cur = lines[it.line];
      if (cur === undefined || cur.replace(/\r$/, "") !== it.raw) return data;
      lines[it.line] = it.done ? cur.replace(/\[[xX]\]/, "[ ]") : cur.replace(/\[ \]/, "[x]");
      changed = true;
      return lines.join("\n");
    });
    if (changed) {
      it.done = !it.done;
      it.raw = it.done ? it.raw.replace(/\[ \]/, "[x]") : it.raw.replace(/\[[xX]\]/, "[ ]");
    }
  }

  function openCard(c, newTab) {
    const it = sections[c.dataset.s].items[c.dataset.i];
    app.workspace.openLinkText(it.path || it.target, roadmap.path, newTab);
  }

  root.addEventListener("click", async e => {
    const pill = e.target.closest(".es-pill");
    if (pill) {
      state.f = pill.dataset.f;
      renderMain(false);
      return;
    }
    const item = e.target.closest(".es-item");
    if (item) {
      state.sel = Number(item.dataset.s);
      state.q = "";
      input.value = "";
      app.saveLocalStorage(STORE_KEY, sections[state.sel].name);
      renderList();
      renderMain(false);
      return;
    }
    const tick = e.target.closest(".es-tick");
    if (tick) {
      e.stopPropagation();
      await toggle(sections[tick.dataset.s].items[tick.dataset.i]);
      renderGlobal();
      renderList();
      renderMain(true);
      return;
    }
    const c = e.target.closest(".es-card");
    if (c) openCard(c, e.ctrlKey || e.metaKey);
  });

  root.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    const c = e.target.closest(".es-card");
    if (c && e.target === c) openCard(c, false);
  });

  input.addEventListener("input", () => {
    state.q = input.value.trim();
    renderList();
    renderMain(false);
  });

  input.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    input.value = "";
    state.q = "";
    input.blur();
    renderList();
    renderMain(false);
  });

  const onKey = e => {
    if (!root.isConnected) { document.removeEventListener("keydown", onKey); return; }
    if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey || root.offsetParent === null) return;
    const a = document.activeElement;
    if (a && (/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) || a.isContentEditable)) return;
    e.preventDefault();
    input.focus();
  };
  document.addEventListener("keydown", onKey);

  // Ajusta a altura da página à área real da nota (assim só o menu lateral rola)
  const page = root.querySelector(".estudos-page");
  const host = root.closest(".view-content");
  let ro = null;
  function fit() {
    if (!host || !page) return;
    if (!root.isConnected) { if (ro) ro.disconnect(); return; }
    const pr = page.getBoundingClientRect();
    const hr = host.getBoundingClientRect();
    page.style.height = Math.max(320, host.clientHeight - (pr.top - hr.top)) + "px";
    page.style.width = Math.max(480, host.clientWidth - (pr.left - hr.left)) + "px";
  }
  if (host && window.ResizeObserver) {
    ro = new ResizeObserver(fit);
    ro.observe(host);
  }
  fit();

  renderGlobal();
  renderList();
  renderMain(false);
  const active = elList.querySelector(".is-active");
  if (active) elList.scrollTop = Math.max(0, active.offsetTop - elList.clientHeight / 2);
}

if (!roadmap) {
  dv.paragraph('Não encontrei a nota "' + ROADMAP_NAME + '". Ajuste ROADMAP_NAME no começo do script.');
} else {
  await run();
}
```
