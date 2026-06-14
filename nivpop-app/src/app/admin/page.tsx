"use client";
import { useState, useEffect, useCallback } from "react";
import type { NivResult, FlavorId } from "@/lib/types";
import { FLAVORS, FLAVOR_EMOJI } from "@/lib/flavors";
import { FLAVOR_HEX } from "@/lib/colors";
import { getResults, getConfig, getKiosko, setKiosko, getStock, setStock } from "@/lib/storage";

const ALL_IDS = Object.keys(FLAVORS) as FlavorId[];
const DEFAULT_PIN   = "1234";
const FLAVORS_KEY   = "nivpop_flavors";
const CONFIG_KEY    = "nivpop_config";

type Tab = "results" | "sabores" | "ajustes";

// ── helpers ──────────────────────────────────────────────────────────────────
function exportCSV(results: NivResult[]) {
  const headers = ["ID","Fecha","Hora","Modo","FlavorId","Sabor","Nombre1","Nombre2","Compatibilidad"];
  const rows = results.map((r) => [
    r.id, r.fecha, r.timeStr, r.modo, r.flavorId, r.sabor,
    r.nombre1, r.nombre2 ?? "", r.compat ?? "",
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `nivpop-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── component ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [pin, setPin]           = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [tab, setTab]           = useState<Tab>("results");

  const [results, setResults]   = useState<NivResult[]>([]);
  const [paused,  setPaused]    = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  // settings form
  const [businessName, setBizName] = useState("");
  const [newPin,  setNewPin]        = useState("");

  // flavor toggles
  const [flavorCfg, setFlavorCfg] = useState<Array<{ id: FlavorId; activo: boolean }>>([]);
  // stock toggles
  const [stockMap, setStockMap]   = useState<Record<FlavorId, boolean>>({} as Record<FlavorId, boolean>);

  const refresh = useCallback(() => {
    setResults(getResults());
    const k = getKiosko();
    setPaused(!!k.pausado);
    const cfg = getConfig();
    setBizName(cfg.businessName ?? "");

    const rawFl = localStorage.getItem(FLAVORS_KEY);
    if (rawFl) {
      setFlavorCfg(JSON.parse(rawFl));
    } else {
      setFlavorCfg(ALL_IDS.map((id) => ({ id, activo: true })));
    }

    const rawSt = getStock();
    const stockInit: Record<FlavorId, boolean> = {} as Record<FlavorId, boolean>;
    ALL_IDS.forEach((id) => { stockInit[id] = rawSt[id] !== false; });
    setStockMap(stockInit);
  }, []);

  useEffect(() => { if (unlocked) refresh(); }, [unlocked, refresh]);

  // ── PIN ────────────────────────────────────────────────────────────────────
  function handlePin(e: React.FormEvent) {
    e.preventDefault();
    const correct = getConfig().adminPin ?? DEFAULT_PIN;
    if (pin === correct) { setUnlocked(true); setPinError(false); }
    else { setPinError(true); setPin(""); }
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-8">
        <div className="w-full max-w-xs">
          <h1 className="font-display text-5xl italic text-paper text-center mb-2">Admin</h1>
          <p className="font-sans text-[9px] tracking-[0.5em] text-muted/40 uppercase text-center mb-14">NIV&apos;POP</p>
          <form onSubmit={handlePin} className="space-y-6">
            <input type="password" value={pin} onChange={(e) => setPin(e.target.value)}
              placeholder="PIN" autoFocus
              className="w-full bg-transparent border-b border-paper/30 focus:border-paper/70 text-paper font-sans text-2xl py-3 outline-none placeholder:text-muted/30 text-center tracking-[0.6em]"
            />
            {pinError && <p className="font-sans text-xs text-rose text-center">PIN incorrecto</p>}
            <button type="submit"
              className="w-full font-sans text-[11px] tracking-[0.4em] uppercase text-ink bg-paper py-4 hover:bg-paper/90 active:scale-95 transition-all"
            >ENTRAR</button>
          </form>
          <div className="mt-10 text-center">
            <a href="/" className="font-sans text-xs text-muted/40 tracking-widest uppercase hover:text-muted/70 transition-colors">← Kiosco</a>
          </div>
        </div>
      </div>
    );
  }

  // ── stats ──────────────────────────────────────────────────────────────────
  const today = new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });
  const todayR = results.filter((r) => r.fecha === today);

  const flavorCount: Record<string, number> = {};
  results.forEach((r) => { flavorCount[r.flavorId] = (flavorCount[r.flavorId] ?? 0) + 1; });
  const sortedFlavors = Object.entries(flavorCount).sort((a, b) => b[1] - a[1]);
  const topMax = sortedFlavors[0]?.[1] ?? 1;

  const modeCount = { solo: 0, estado: 0, duo: 0 };
  results.forEach((r) => { modeCount[r.modo as keyof typeof modeCount] = (modeCount[r.modo as keyof typeof modeCount] ?? 0) + 1; });

  // ── flavor toggle ──────────────────────────────────────────────────────────
  function toggleFlavor(id: FlavorId) {
    const updated = flavorCfg.map((f) => f.id === id ? { ...f, activo: !f.activo } : f);
    // ensure at least 1 active
    if (!updated.some((f) => f.activo)) return;
    setFlavorCfg(updated);
    localStorage.setItem(FLAVORS_KEY, JSON.stringify(updated));
  }

  // ── stock toggle ───────────────────────────────────────────────────────────
  function toggleStock(id: FlavorId) {
    const updated = { ...stockMap, [id]: !stockMap[id] };
    setStockMap(updated);
    setStock(updated as Record<string, boolean>);
  }

  // ── pause toggle ───────────────────────────────────────────────────────────
  function togglePause() {
    const next = !paused;
    setPaused(next);
    setKiosko({ ...getKiosko(), pausado: next });
  }

  // ── settings save ──────────────────────────────────────────────────────────
  function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    const existing = getConfig();
    const updated  = {
      ...existing,
      ...(businessName.trim() ? { businessName: businessName.trim() } : {}),
      ...(newPin.trim()       ? { adminPin: newPin.trim() } : {}),
    };
    localStorage.setItem(CONFIG_KEY, JSON.stringify(updated));
    setNewPin("");
    setSavedMsg("✓ GUARDADO");
    setTimeout(() => setSavedMsg(""), 2000);
  }

  // ── clear results ──────────────────────────────────────────────────────────
  function handleClear() {
    if (!confirm("¿Borrar todos los resultados? No se puede deshacer.")) return;
    localStorage.removeItem("nivpop_results");
    setResults([]);
  }

  // ── render ─────────────────────────────────────────────────────────────────
  const TABS: Array<{ key: Tab; label: string }> = [
    { key: "results", label: "RESULTADOS" },
    { key: "sabores", label: "SABORES" },
    { key: "ajustes", label: "AJUSTES" },
  ];

  return (
    <div className="min-h-screen bg-ink text-paper font-sans">
      {/* Header */}
      <div className="border-b border-paper/10 px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl italic">Admin</h1>
          <p className="text-[9px] tracking-[0.5em] text-muted/40 uppercase mt-0.5">NIV&apos;POP</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
              else document.exitFullscreen?.();
            }}
            className="font-sans text-[9px] tracking-[0.3em] uppercase text-muted/40 hover:text-muted/80 border border-paper/12 px-3 py-2 transition-all"
          >
            ⛶
          </button>
          <a href="/" className="font-sans text-[10px] tracking-[0.3em] uppercase text-muted/50 border border-paper/15 px-4 py-2 hover:border-paper/30 hover:text-muted transition-all">
            ← Kiosco
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-paper/10 px-6">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`font-sans text-[10px] tracking-[0.3em] uppercase py-4 pr-8 transition-colors border-b-2 -mb-px ${
              tab === t.key ? "border-paper/60 text-paper" : "border-transparent text-muted/45 hover:text-muted/80"
            }`}
          >{t.label}</button>
        ))}
      </div>

      <div className="px-6 py-8 max-w-xl mx-auto">

        {/* ── RESULTADOS ────────────────────────────────────────────────────── */}
        {tab === "results" && (
          <div className="space-y-8">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { v: results.length, l: "Total" },
                { v: todayR.length,  l: "Hoy" },
                { v: `${modeCount.duo}`, l: "Dúos" },
              ].map((s) => (
                <div key={s.l} className="border border-paper/10 px-4 py-5 text-center">
                  <p className="font-display text-5xl font-light">{s.v}</p>
                  <p className="text-[8px] tracking-widest text-muted/50 uppercase mt-1">{s.l}</p>
                </div>
              ))}
            </div>

            {/* Bar chart */}
            {sortedFlavors.length > 0 && (
              <div>
                <p className="text-[9px] tracking-[0.4em] text-muted/50 uppercase mb-4">RANKING DE SABORES</p>
                <div className="space-y-2.5">
                  {sortedFlavors.slice(0, 8).map(([id, cnt]) => (
                    <div key={id} className="flex items-center gap-3">
                      <span className="text-base w-6 text-center flex-shrink-0">{FLAVOR_EMOJI[id as FlavorId] ?? "🍦"}</span>
                      <div className="flex-1 bg-paper/5 h-2 rounded-sm overflow-hidden">
                        <div
                          className="h-full rounded-sm transition-all duration-700"
                          style={{ width: `${(cnt / topMax) * 100}%`, backgroundColor: FLAVOR_HEX[id as FlavorId] ?? "#fff" }}
                        />
                      </div>
                      <span className="text-[10px] text-muted/50 w-5 text-right flex-shrink-0">{cnt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[9px] tracking-[0.4em] text-muted/50 uppercase">ÚLTIMAS VISITAS</p>
                {results.length > 0 && (
                  <button onClick={() => exportCSV(results)}
                    className="font-sans text-[9px] tracking-[0.3em] uppercase text-muted/50 border border-paper/15 px-3 py-1.5 hover:border-paper/30 hover:text-muted transition-all"
                  >EXPORTAR CSV</button>
                )}
              </div>
              {results.length === 0 ? (
                <p className="text-sm text-muted/35">Aún no hay resultados.</p>
              ) : (
                <div className="space-y-2">
                  {results.slice(0, 50).map((r) => (
                    <div key={r.id} className="flex items-center gap-3 border border-paper/8 px-4 py-3">
                      <span className="text-base flex-shrink-0">{FLAVOR_EMOJI[r.flavorId as FlavorId] ?? "🍦"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-paper/80 truncate">
                          {r.nombre1}{r.nombre2 ? ` & ${r.nombre2}` : ""}
                        </p>
                        <p className="text-[10px] text-muted/45">
                          {r.sabor} · {r.modo}{r.compat ? ` · ${r.compat}%` : ""}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[10px] text-muted/40">{r.timeStr}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {results.length > 0 && (
              <button onClick={handleClear}
                className="font-sans text-[10px] tracking-[0.3em] uppercase text-paper/35 border border-paper/10 px-5 py-3 hover:border-red-500/40 hover:text-red-400/60 transition-all"
              >BORRAR HISTORIAL</button>
            )}
          </div>
        )}

        {/* ── SABORES ───────────────────────────────────────────────────────── */}
        {tab === "sabores" && (
          <div className="space-y-8">
            {/* Active flavors */}
            <div>
              <p className="text-[9px] tracking-[0.4em] text-muted/50 uppercase mb-1">SABORES ACTIVOS EN EL QUIZ</p>
              <p className="text-[10px] text-muted/35 mb-5">Los desactivados no aparecen en los resultados del test.</p>
              <div className="space-y-2">
                {ALL_IDS.map((id) => {
                  const f = FLAVORS[id];
                  const entry = flavorCfg.find((c) => c.id === id);
                  const active = entry?.activo ?? true;
                  return (
                    <div key={id}
                      className="flex items-center gap-4 border border-paper/8 px-4 py-3 cursor-pointer hover:bg-paper/[0.03] transition-colors"
                      onClick={() => toggleFlavor(id)}
                    >
                      <span className="text-lg">{FLAVOR_EMOJI[id]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-paper/80">{f.name}</p>
                        <p className="text-[10px] text-muted/45">{f.persona}</p>
                      </div>
                      <div className={`w-9 h-5 rounded-full transition-colors flex-shrink-0 flex items-center ${active ? "bg-paper/40" : "bg-paper/10"}`}>
                        <div className={`w-3.5 h-3.5 rounded-full bg-paper transition-transform mx-0.5 ${active ? "translate-x-4" : "translate-x-0"}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stock / disponibilidad */}
            <div>
              <p className="text-[9px] tracking-[0.4em] text-muted/50 uppercase mb-1">DISPONIBILIDAD HOY</p>
              <p className="text-[10px] text-muted/35 mb-5">Los sabores no disponibles aparecen como &quot;Agotado&quot; en el catálogo.</p>
              <div className="space-y-2">
                {ALL_IDS.map((id) => {
                  const f = FLAVORS[id];
                  const avail = stockMap[id] !== false;
                  return (
                    <div key={id}
                      className="flex items-center gap-4 border border-paper/8 px-4 py-3 cursor-pointer hover:bg-paper/[0.03] transition-colors"
                      onClick={() => toggleStock(id)}
                    >
                      <span className="text-lg">{FLAVOR_EMOJI[id]}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${avail ? "text-paper/80" : "text-muted/40"}`}>{f.name}</p>
                        {!avail && <p className="text-[10px] text-muted/35">Agotado</p>}
                      </div>
                      <div className={`w-9 h-5 rounded-full transition-colors flex-shrink-0 flex items-center ${avail ? "bg-paper/40" : "bg-paper/10"}`}>
                        <div className={`w-3.5 h-3.5 rounded-full bg-paper transition-transform mx-0.5 ${avail ? "translate-x-4" : "translate-x-0"}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── AJUSTES ───────────────────────────────────────────────────────── */}
        {tab === "ajustes" && (
          <form onSubmit={handleSaveSettings} className="space-y-8">
            {/* Pause */}
            <div className="flex items-center justify-between border border-paper/10 px-5 py-4">
              <div>
                <p className="text-sm text-paper/80 mb-0.5">Pausar kiosco</p>
                <p className="text-[10px] text-muted/45">Muestra &quot;Volvemos enseguida&quot; en pantalla</p>
              </div>
              <button
                type="button"
                onClick={togglePause}
                className={`w-11 h-6 rounded-full transition-colors flex items-center flex-shrink-0 ml-4 ${paused ? "bg-rose/60" : "bg-paper/20"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-paper transition-transform mx-1 ${paused ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>

            <div>
              <label className="text-[9px] tracking-[0.4em] text-muted/60 uppercase block mb-2">NOMBRE DEL NEGOCIO</label>
              <input type="text" value={businessName} onChange={(e) => setBizName(e.target.value)}
                placeholder="NIV'POP Helados Artesanales"
                className="w-full bg-transparent border-b border-paper/25 focus:border-paper/60 text-paper text-base py-2 outline-none placeholder:text-muted/25 transition-colors"
              />
            </div>

            <div>
              <label className="text-[9px] tracking-[0.4em] text-muted/60 uppercase block mb-2">NUEVO PIN DE ADMIN</label>
              <input type="password" value={newPin} onChange={(e) => setNewPin(e.target.value)}
                placeholder="Dejar vacío para no cambiar" maxLength={8}
                className="w-full bg-transparent border-b border-paper/25 focus:border-paper/60 text-paper text-base py-2 outline-none placeholder:text-muted/25 tracking-[0.3em] transition-colors"
              />
              <p className="text-[9px] text-muted/35 mt-1">PIN actual: {getConfig().adminPin ?? "1234 (por defecto)"}</p>
            </div>

            <button type="submit"
              className="font-sans text-[11px] tracking-[0.4em] uppercase text-ink bg-paper px-10 py-4 hover:bg-paper/90 active:scale-95 transition-all"
            >
              {savedMsg || "GUARDAR CAMBIOS"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
