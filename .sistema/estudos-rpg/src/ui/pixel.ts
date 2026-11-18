// Ícones em pixel art da Pixel Icon Library, do HackerNoon (MIT, grade 24×24):
// https://pixeliconlibrary.com · https://github.com/hackernoon/pixel-icon-library
// O esbuild embute cada .svg como texto (loader "text"); só os importados aqui entram no main.js.
// A cor vem do currentColor. Ícone que não estiver no mapa cai no Lucide do Obsidian (ver dom.ts).
//
// Trocar ou adicionar um ícone: escolha o nome no site (ou em
// node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid), importe abaixo
// e aponte o nome usado no código para ele em ICONES.

import { svgParaCaminhos } from "./svgPath.ts";
import arrowRight from "@hackernoon/pixel-icon-library/icons/SVG/solid/arrow-right-solid.svg";
import bolt from "@hackernoon/pixel-icon-library/icons/SVG/solid/bolt-solid.svg";
import book from "@hackernoon/pixel-icon-library/icons/SVG/solid/book-solid.svg";
import bulletList from "@hackernoon/pixel-icon-library/icons/SVG/solid/bullet-list-solid.svg";
import calendario from "@hackernoon/pixel-icon-library/icons/SVG/solid/calender-solid.svg";
import check from "@hackernoon/pixel-icon-library/icons/SVG/solid/check-solid.svg";
import clock from "@hackernoon/pixel-icon-library/icons/SVG/solid/clock-solid.svg";
import crown from "@hackernoon/pixel-icon-library/icons/SVG/solid/crown-solid.svg";
import externalLink from "@hackernoon/pixel-icon-library/icons/SVG/solid/external-link-solid.svg";
import eye from "@hackernoon/pixel-icon-library/icons/SVG/solid/eye-solid.svg";
import fire from "@hackernoon/pixel-icon-library/icons/SVG/solid/fire-solid.svg";
import flagCheckered from "@hackernoon/pixel-icon-library/icons/SVG/solid/flag-checkered-solid.svg";
import laptopCode from "@hackernoon/pixel-icon-library/icons/SVG/solid/laptop-code-solid.svg";
import lightbulb from "@hackernoon/pixel-icon-library/icons/SVG/solid/lightbulb-solid.svg";
import locationPin from "@hackernoon/pixel-icon-library/icons/SVG/solid/location-pin-solid.svg";
import lock from "@hackernoon/pixel-icon-library/icons/SVG/solid/lock-solid.svg";
import penNib from "@hackernoon/pixel-icon-library/icons/SVG/solid/pen-nib-solid.svg";
import pencilRuler from "@hackernoon/pixel-icon-library/icons/SVG/solid/pencil-ruler-solid.svg";
import play from "@hackernoon/pixel-icon-library/icons/SVG/solid/play-solid.svg";
import questionCircle from "@hackernoon/pixel-icon-library/icons/SVG/solid/question-circle-solid.svg";
import refresh from "@hackernoon/pixel-icon-library/icons/SVG/solid/refresh-solid.svg";
import save from "@hackernoon/pixel-icon-library/icons/SVG/solid/save-solid.svg";
import search from "@hackernoon/pixel-icon-library/icons/SVG/solid/search-solid.svg";
import seedlings from "@hackernoon/pixel-icon-library/icons/SVG/solid/seedlings-solid.svg";
import sitemap from "@hackernoon/pixel-icon-library/icons/SVG/solid/sitemap-solid.svg";
import sun from "@hackernoon/pixel-icon-library/icons/SVG/solid/sun-solid.svg";
import times from "@hackernoon/pixel-icon-library/icons/SVG/solid/times-solid.svg";
import translate from "@hackernoon/pixel-icon-library/icons/SVG/solid/translate-solid.svg";
import trophy from "@hackernoon/pixel-icon-library/icons/SVG/solid/trophy-solid.svg";

/** Tamanho da grade dos ícones. Só fica nítido em múltiplos disso (24px, 48px…). */
export const GRADE = 24;

// Chave = nome usado no código (o mesmo do Lucide, para o fallback continuar fazendo sentido).
const ICONES: Record<string, string> = {
  // conquistas
  sprout: seedlings,
  flame: fire,
  "flame-kindling": bolt,
  hammer: pencilRuler,
  "book-open": book,
  compass: locationPin,
  clock,
  languages: translate,
  castle: laptopCode,
  flag: flagCheckered,
  brain: lightbulb,
  sun,
  crown,
  lock,
  // atributos e painéis
  "scroll-text": penNib,
  repeat: questionCircle,
  "calendar-days": calendario,
  map: sitemap,
  trophy, // barra lateral e aba da ficha
  // botões
  play,
  save,
  x: times,
  check,
  eye,
  "arrow-right": arrowRight,
  "external-link": externalLink,
  "rotate-ccw": refresh,
  list: bulletList,
  search,
};

// Convertido para caminhos "d" uma vez, na primeira vez que o ícone é pedido.
const cache = new Map<string, string[]>();
function caminhos(nome: string): string[] | undefined {
  const svg = ICONES[nome];
  if (svg === undefined) return undefined;
  let ds = cache.get(nome);
  if (!ds) cache.set(nome, (ds = svgParaCaminhos(svg)));
  return ds;
}

/** O SVG do ícone no formato que o addIcon do Obsidian espera (viewBox 0 0 100 100). */
export function svgParaObsidian(nome: string): string | undefined {
  const ds = caminhos(nome);
  if (!ds) return undefined;
  const escala = 100 / GRADE;
  return `<g transform="scale(${escala})" fill="currentColor" stroke="none" shape-rendering="crispEdges">${ds.map((d) => `<path d="${d}"/>`).join("")}</g>`;
}

const SVG = "http://www.w3.org/2000/svg";

/** Desenha o ícone em pixel dentro de `el`. Devolve false se o nome não existe no conjunto. */
export function desenharPixel(el: HTMLElement, nome: string): boolean {
  const ds = caminhos(nome);
  if (!ds) return false;
  const svg = document.createElementNS(SVG, "svg");
  svg.setAttribute("viewBox", `0 0 ${GRADE} ${GRADE}`);
  svg.setAttribute("shape-rendering", "crispEdges");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("erpg-px");
  for (const d of ds) {
    const path = document.createElementNS(SVG, "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", "currentColor");
    svg.appendChild(path);
  }
  el.appendChild(svg);
  return true;
}
