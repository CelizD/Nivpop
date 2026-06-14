import type { NivResult, FlavorId } from "./types";

const KEYS = {
  results: "nivpop_results",
  flavors:  "nivpop_flavors",
  config:   "nivpop_config",
  kiosko:   "nivpop_kiosko",
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
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* storage full */ }
}

export function getResults(): NivResult[] {
  return get<NivResult[]>(KEYS.results, []);
}

export function saveResult(r: Omit<NivResult, "id" | "fecha" | "hora" | "min" | "timeStr">): NivResult {
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
  return record;
}

export function getConfig() {
  return get<{ adminPin?: string; businessName?: string }>(KEYS.config, {});
}

export function getKiosko() {
  return get<{ pausado?: boolean; brillo?: number; autoPrint?: boolean }>(KEYS.kiosko, {});
}

export function getActiveFlavors(): FlavorId[] | null {
  const stored = get<Array<{ id: string; activo: boolean }> | null>(KEYS.flavors, null);
  if (!stored || !stored.length) return null;
  return stored.filter((f) => f.activo).map((f) => f.id as FlavorId);
}

export function setKiosko(k: { pausado?: boolean; brillo?: number; autoPrint?: boolean }) {
  set(KEYS.kiosko, k);
}

export function getStock(): Record<string, boolean> {
  return get<Record<string, boolean>>("nivpop_stock", {});
}

export function setStock(stock: Record<string, boolean>) {
  set("nivpop_stock", stock);
}

export function clearResults() {
  set(KEYS.results, []);
}
