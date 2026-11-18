// Conversor dos SVGs de ícone (src/ui/svgPath.ts). Rodar: npm test
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { describe, it } from "node:test";
import { svgParaCaminhos } from "../src/ui/svgPath.ts";
import { pixelDoIcone } from "../src/ui/nitidez.ts";

describe("ícones (svg → caminhos)", () => {
  it("converte path, polygon e rect e ignora o fundo transparente", () => {
    const svg = `<svg viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/>
      <path d="M1,2h3v1H1Z"/><polygon points="12 11 13 11 13 22"/><rect x="5" y="2" width="14" height="1"/></svg>`;
    assert.deepEqual(svgParaCaminhos(svg), ["M1,2h3v1H1Z", "M12 11L13 11L13 22Z", "M5 2h14v1h-14Z"]);
  });

  it("descarta formas inválidas em vez de quebrar", () => {
    assert.deepEqual(svgParaCaminhos(`<polygon points="1 2 3"/><rect width="0" height="4"/><rect width="x" height="1"/>`), []);
  });

  it("todo ícone regular/solid da biblioteca vira pelo menos um caminho", () => {
    const base = new URL("../node_modules/@hackernoon/pixel-icon-library/icons/SVG/", import.meta.url);
    for (const pasta of ["regular", "solid"]) {
      const dir = new URL(`${pasta}/`, base);
      for (const arq of readdirSync(dir).filter((f) => f.endsWith(".svg"))) {
        assert.ok(svgParaCaminhos(readFileSync(new URL(arq, dir), "utf8")).length > 0, `${pasta}/${arq}`);
      }
    }
  });
});

describe("nitidez dos ícones (zoom)", () => {
  it("cada pixel do ícone vira um número inteiro de pixels da tela", () => {
    for (const dpr of [0.67, 0.8, 0.9, 1, 1.095, 1.2, 1.25, 1.5, 1.75, 2, 2.5, 3]) {
      const naTela = pixelDoIcone(dpr) * dpr;
      assert.ok(Math.abs(naTela - Math.round(naTela)) < 1e-9 && naTela >= 1, `dpr ${dpr} → ${naTela}`);
    }
  });

  it("sem zoom não muda nada, e valor inválido cai no padrão", () => {
    assert.equal(pixelDoIcone(1), 1);
    assert.equal(pixelDoIcone(2), 1);
    assert.equal(pixelDoIcone(Number.NaN), 1);
    assert.equal(pixelDoIcone(0), 1);
  });
});
