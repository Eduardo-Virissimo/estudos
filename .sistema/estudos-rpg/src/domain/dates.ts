// Datas como texto "YYYY-MM-DD" no fuso local. Evita bugs de UTC à meia-noite.

export function hojeISO(agora: Date = new Date()): string {
  return toISO(agora);
}

export function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

/** Aceita "2026-11-11", "2026-11-11T10:00", Date... Devolve null se inválido. */
export function parseISO(v: unknown): string | null {
  if (v == null || v === "") return null;
  const s = v instanceof Date ? toISO(v) : String(v).slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split("-").map(Number) as [number, number, number];
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d ? s : null;
}

export function addDias(iso: string, dias: number): string {
  const [y, m, d] = iso.split("-").map(Number) as [number, number, number];
  return toISO(new Date(y, m - 1, d + dias));
}

/** Dias de `a` até `b` (b - a). */
export function diffDias(a: string, b: string): number {
  const [y1, m1, d1] = a.split("-").map(Number) as [number, number, number];
  const [y2, m2, d2] = b.split("-").map(Number) as [number, number, number];
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86_400_000);
}

/** "hoje", "amanhã", "há 3 dias", "em 5 dias". */
export function relativo(iso: string, hoje: string): string {
  const n = diffDias(hoje, iso);
  if (n === 0) return "hoje";
  if (n === 1) return "amanhã";
  if (n === -1) return "ontem";
  return n > 0 ? `em ${n} dias` : `há ${-n} dias`;
}
