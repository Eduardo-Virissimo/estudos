// Pixel art só fica nítida quando cada pixel do ícone cai num número INTEIRO de pixels da tela.
// Com zoom no Obsidian (Ctrl +/-) ou escala do Windows (125%, 150%…), 1px do CSS deixa de ser
// 1 pixel da tela: com zoom 109,5%, por exemplo, algumas linhas saem com 1px e outras com 2px,
// e o ícone parece "torto". Aqui calculamos quanto 1 pixel do ícone deve medir em CSS para
// virar sempre 1, 2, 3… pixels inteiros da tela. TypeScript puro (testável).

/** Tamanho, em px de CSS, de 1 pixel do ícone para a razão de pixels `dpr` (window.devicePixelRatio). */
export function pixelDoIcone(dpr: number): number {
  if (!Number.isFinite(dpr) || dpr <= 0) return 1;
  const pixelsDaTela = Math.max(1, Math.round(dpr)); // 1 pixel do ícone = quantos pixels da tela
  return pixelsDaTela / dpr;
}
