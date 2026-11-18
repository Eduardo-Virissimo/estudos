// Converte o texto de um SVG de ícone em uma lista de caminhos "d", um por forma.
// Os ícones da Pixel Icon Library (HackerNoon) misturam <path>, <polygon> e <rect>;
// virando tudo "d", o desenho é feito do mesmo jeito, pelo DOM e sem innerHTML.
// TypeScript puro (sem Obsidian/DOM) para poder ser testado.

const FORMA = /<(path|polygon|rect)\b([^>]*?)\/?>/g;

function attr(atributos: string, nome: string): string | undefined {
  return new RegExp(`\\s${nome}="([^"]*)"`).exec(atributos)?.[1];
}

/** Lista de "d" do SVG. Formas com fill="none" (fundo transparente) ficam de fora. */
export function svgParaCaminhos(svg: string): string[] {
  const ds: string[] = [];
  for (const [, tag, a = ""] of svg.matchAll(FORMA)) {
    if (attr(a, "fill") === "none") continue;
    if (tag === "path") {
      const d = attr(a, "d");
      if (d) ds.push(d);
    } else if (tag === "polygon") {
      const n = (attr(a, "points") ?? "").trim().split(/[\s,]+/).filter(Boolean);
      if (n.length < 6 || n.length % 2) continue; // polígono precisa de 3+ pontos (x y)
      let d = `M${n[0]} ${n[1]}`;
      for (let i = 2; i < n.length; i += 2) d += `L${n[i]} ${n[i + 1]}`;
      ds.push(`${d}Z`);
    } else {
      const x = Number(attr(a, "x") ?? 0), y = Number(attr(a, "y") ?? 0);
      const w = Number(attr(a, "width")), h = Number(attr(a, "height"));
      if (![x, y, w, h].every(Number.isFinite) || w <= 0 || h <= 0) continue;
      ds.push(`M${x} ${y}h${w}v${h}h${-w}Z`);
    }
  }
  return ds;
}
