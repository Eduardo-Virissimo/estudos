// Pergunta do dia: a mesma o dia todo, muda no dia seguinte.

export function indiceDoDia(hoje: string, total: number): number {
  if (total <= 0) return -1;
  let h = 0;
  for (const ch of hoje) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % total;
}
