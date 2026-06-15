import type { NivResult, FlavorId, FlavorScores } from "./types";

const KEYS = {
  results:  "nivpop_results",
  flavors:  "nivpop_flavors",
  config:   "nivpop_config",
  kiosko:   "nivpop_kiosko",
  stock:    "nivpop_stock",
  stamps:   "nivpop_stamps",
  seasonal: "nivpop_seasonal",
  qover:    "nivpop_q_overrides",
} as const;

function get<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function set(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage full */ }
}

// ── Results ───────────────────────────────────────────────────────────────────

export function getResults(): NivResult[] {
  return get<NivResult[]>(KEYS.results, []);
}

export function getResultCount(): number {
  return get<NivResult[]>(KEYS.results, []).length;
}

export function saveResult(
  r: Omit<NivResult, "id" | "fecha" | "hora" | "min" | "timeStr">,
): NivResult {
  const now = new Date();
  const record: NivResult = {
    ...r,
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    fecha: now.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" }),
    hora: now.getHours(),
    min: now.getMinutes(),
    timeStr: `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`,
  };
  const all = getResults();
  set(KEYS.results, [record, ...all]);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("nivpop:nuevo", { detail: record }));
  }
  // Fire-and-forget Supabase save
  saveResultToSupabase(record).catch(() => {});
  return record;
}

async function saveResultToSupabase(r: NivResult) {
  const { supabase } = await import("./supabase");
  if (!supabase) return;
  const now = new Date();
  const row: Record<string, unknown> = {
    folio: r.folio ?? r.id,
    modo:  r.modo,
    fecha: now.toISOString().slice(0, 10),
    hora:  r.hora,
  };
  if (r.modo !== "duo") {
    row.nombre = r.nombre1;
    row.sabor  = r.flavorId;
  } else {
    row.nombre1 = r.nombre1;
    row.nombre2 = r.nombre2;
    row.sabor1  = r.flavorId;
    row.compat  = r.compat;
  }
  await supabase.from("nivpop_resultados").insert(row);
}

export function clearResults() {
  set(KEYS.results, []);
}

// ── Config ────────────────────────────────────────────────────────────────────

export function getConfig() {
  return get<{ adminPin?: string; businessName?: string }>(KEYS.config, {});
}

// ── Kiosko ────────────────────────────────────────────────────────────────────

export function getKiosko() {
  return get<{ pausado?: boolean; brillo?: number; autoPrint?: boolean }>(KEYS.kiosko, {});
}

export function setKiosko(k: { pausado?: boolean; brillo?: number; autoPrint?: boolean }) {
  set(KEYS.kiosko, k);
}

// ── Flavors ───────────────────────────────────────────────────────────────────

export function getActiveFlavors(): FlavorId[] | null {
  const stored = get<Array<{ id: string; activo: boolean }> | null>(KEYS.flavors, null);
  if (!stored || !stored.length) return null;
  return stored.filter((f) => f.activo).map((f) => f.id as FlavorId);
}

// ── Stock ─────────────────────────────────────────────────────────────────────

export function getStock(): Record<string, boolean> {
  return get<Record<string, boolean>>(KEYS.stock, {});
}

export function setStock(stock: Record<string, boolean>) {
  set(KEYS.stock, stock);
}

// ── Stamps (loyalty) ──────────────────────────────────────────────────────────

export function getStamps(): number {
  return get<number>(KEYS.stamps, 0);
}

export function addStamp(): number {
  const next = getStamps() + 1;
  set(KEYS.stamps, next);
  return next;
}

export function resetStamps() {
  set(KEYS.stamps, 0);
}

// ── Seasonal flavors ─────────────────────────────────────────────────────────

export interface SeasonalFlag {
  temporal: boolean;
  hasta?: string; // 'YYYY-MM-DD', undefined = no expiry
}

export function getSeasonal(): Record<string, SeasonalFlag> {
  return get<Record<string, SeasonalFlag>>(KEYS.seasonal, {});
}

export function setSeasonal(s: Record<string, SeasonalFlag>) {
  set(KEYS.seasonal, s);
}

export function isSeasonalExpired(id: string): boolean {
  const s = getSeasonal()[id];
  if (!s?.temporal || !s.hasta) return false;
  return new Date().toISOString().slice(0, 10) > s.hasta;
}

// ── Question overrides ────────────────────────────────────────────────────────

export interface QOverride {
  q?: string;
  o?: Record<number, string>;
}

export type QOverrides = {
  p?: Record<number, QOverride>;
  t?: Record<number, QOverride>;
};

export function getQOverrides(): QOverrides {
  return get<QOverrides>(KEYS.qover, {});
}

export function setQOverrides(o: QOverrides) {
  set(KEYS.qover, o);
}

export function applyQOverrides<T extends { q: string; o: Array<{ t: string }> }>(
  questions: T[],
  overrides: Record<number, QOverride> | undefined,
): T[] {
  if (!overrides) return questions;
  return questions.map((q, i) => {
    const ov = overrides[i];
    if (!ov) return q;
    return {
      ...q,
      q: ov.q ?? q.q,
      o: q.o.map((opt, j) => ({ ...opt, t: ov.o?.[j] ?? opt.t })),
    };
  });
}

// ── Folio lookup ──────────────────────────────────────────────────────────────

export function findByFolio(folio: string): NivResult | null {
  const all = getResults();
  const q = folio.trim().toUpperCase();
  return all.find((r) => (r.folio ?? "").toUpperCase() === q) ?? null;
}

export function findByName(name: string): NivResult[] {
  const all = getResults();
  const q = name.trim().toLowerCase();
  return all.filter((r) => r.nombre1.toLowerCase().includes(q) || (r.nombre2 ?? "").toLowerCase().includes(q));
}

// ── Scores (passed through for Supabase) ─────────────────────────────────────

export function saveResultWithScores(
  r: Omit<NivResult, "id" | "fecha" | "hora" | "min" | "timeStr">,
  scores?: FlavorScores,
  scores1?: FlavorScores,
  scores2?: FlavorScores,
): NivResult {
  const record = saveResult(r);
  // Enrich the Supabase row with scores (best-effort)
  if ((scores || scores1) && typeof window !== "undefined") {
    import("./supabase").then(({ supabase }) => {
      if (!supabase) return;
      const patch: Record<string, unknown> = {};
      if (scores)  patch.scores  = scores;
      if (scores1) patch.scores1 = scores1;
      if (scores2) patch.scores2 = scores2;
      supabase.from("nivpop_resultados").update(patch).eq("folio", record.folio ?? record.id).then(() => {});
    }).catch(() => {});
  }
  return record;
}
