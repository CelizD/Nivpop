"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import type { NivResult, FlavorId } from "@/types";
import { FLAVORS, FLAVOR_EMOJI } from "@/utils/flavors";
import { FLAVOR_HEX } from "@/utils/colors";
import {
  getResults, getConfig, getKiosko, setKiosko, getStock, setStock,
  getSeasonal, setSeasonal, getQOverrides, setQOverrides, applyQOverrides,
} from "@/services/storage";
import { QP, QT } from "@/utils/questions";

const ALL_IDS   = Object.keys(FLAVORS) as FlavorId[];
const DEFAULT_PIN = "1234";
const FLAVORS_KEY = "nivpop_flavors";
const CONFIG_KEY  = "nivpop_config";

type Tab = "results" | "sabores" | "preguntas" | "ajustes";
type DateFilter = "all" | "today" | "week" | "month";

function dateStringsForLastDays(n: number): Set<string> {
  const s = new Set<string>();
  for (let i = 0; i < n; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    s.add(d.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" }));
  }
  return s;
}

function exportCSV(results: NivResult[]) {
  const hdr = ["ID","Folio","Fecha","Hora","Modo","FlavorId","Sabor","Nombre1","Nombre2","Compat"];
  const rows = results.map((r) => [r.id,r.folio??"",r.fecha,r.timeStr,r.modo,r.flavorId,r.sabor,r.nombre1,r.nombre2??"",r.compat??""]);
  const csv = [hdr,...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob(["﻿"+csv],{type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url;
  a.download = `nivpop-${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

function exportPDF(results: NivResult[], flavorCount: [string, number][], dateLabel: string) {
  const w = window.open("", "_blank");
  if (!w) return;
  const topRows = flavorCount.slice(0,8).map(([id, cnt]) =>
    `<tr><td>${FLAVOR_EMOJI[id as FlavorId] ?? ""} ${FLAVORS[id as FlavorId]?.name ?? id}</td><td>${cnt}</td></tr>`
  ).join("");
  const resultRows = results.slice(0,100).map((r) =>
    `<tr><td>${r.folio ?? r.id.slice(0,8)}</td><td>${r.nombre1}${r.nombre2 ? ` & ${r.nombre2}` : ""}</td><td>${FLAVORS[r.flavorId]?.name ?? r.flavorId}</td><td>${r.modo}</td><td>${r.fecha}</td><td>${r.timeStr}</td></tr>`
  ).join("");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>NIV'POP Reporte</title>
<style>
  body{font-family:Georgia,serif;margin:48px;color:#111;font-size:12px}
  h1{font-size:26px;font-weight:300;margin:0 0 4px}
  p.sub{font-size:11px;color:#666;margin:0 0 32px}
  h2{font-size:13px;font-weight:400;text-transform:uppercase;letter-spacing:.3em;margin:28px 0 12px;color:#444}
  table{width:100%;border-collapse:collapse;margin-bottom:24px}
  th{text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.25em;padding:6px 0;border-bottom:1px solid #ccc;color:#666}
  td{padding:7px 0;border-bottom:1px solid #eee;font-size:12px}
  .stat{display:inline-block;text-align:center;margin-right:32px}
  .stat .n{font-size:32px;font-weight:300}
  .stat .l{font-size:10px;text-transform:uppercase;letter-spacing:.3em;color:#888}
</style></head><body>
<h1>NIV'POP — Reporte de Resultados</h1>
<p class="sub">${dateLabel} &middot; Generado ${new Date().toLocaleDateString("es-MX",{day:"2-digit",month:"long",year:"numeric"})}</p>
<div>
  <div class="stat"><div class="n">${results.length}</div><div class="l">Total</div></div>
  <div class="stat"><div class="n">${results.filter(r=>r.modo!=="duo").length}</div><div class="l">Solo</div></div>
  <div class="stat"><div class="n">${results.filter(r=>r.modo==="duo").length}</div><div class="l">Dúos</div></div>
</div>
<h2>Sabores más elegidos</h2>
<table><thead><tr><th>Sabor</th><th>Visitas</th></tr></thead><tbody>${topRows}</tbody></table>
<h2>Listado de resultados</h2>
<table><thead><tr><th>Folio</th><th>Nombre</th><th>Sabor</th><th>Modo</th><th>Fecha</th><th>Hora</th></tr></thead><tbody>${resultRows}</tbody></table>
<script>window.print()</script></body></html>`);
  w.document.close();
}

export default function AdminPage() {
  const [pin, setPin]           = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [tab, setTab]           = useState<Tab>("results");
  const [results, setResults]   = useState<NivResult[]>([]);
  const [paused,  setPaused]    = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const restoreRef = useRef<HTMLInputElement>(null);

  const [bizName, setBizName] = useState("");
  const [newPin,  setNewPin]  = useState("");

  const [flavorCfg,  setFlavorCfg]  = useState<Array<{ id: FlavorId; activo: boolean }>>([]);
  const [stockMap,   setStockMap]   = useState<Record<FlavorId, boolean>>({} as Record<FlavorId, boolean>);
  const [seasonal,   setSeasonal_]  = useState<Record<string, { temporal: boolean; hasta?: string }>>({});

  // Question overrides (p and t separately)
  const [qOverP, setQOverP] = useState<Record<number, { q?: string; o?: Record<number, string> }>>({});
  const [qOverT, setQOverT] = useState<Record<number, { q?: string; o?: Record<number, string> }>>({});
  const [qTab,   setQTab]   = useState<"p" | "t">("p");
  const [welcomeQR, setWelcomeQR] = useState("");

  const refresh = useCallback(() => {
    setResults(getResults());
    setPaused(!!getKiosko().pausado);
    setBizName(getConfig().businessName ?? "");
    const rawFl = localStorage.getItem(FLAVORS_KEY);
    setFlavorCfg(rawFl ? JSON.parse(rawFl) : ALL_IDS.map((id) => ({ id, activo: true })));
    const st = getStock();
    const init = {} as Record<FlavorId, boolean>;
    ALL_IDS.forEach((id) => { init[id] = st[id] !== false; });
    setStockMap(init);
    setSeasonal_(getSeasonal());
    const ov = getQOverrides();
    setQOverP(ov.p ?? {});
    setQOverT(ov.t ?? {});
  }, []);

  useEffect(() => { if (unlocked) refresh(); }, [unlocked, refresh]);

  // Generate welcome QR once unlocked
  useEffect(() => {
    if (!unlocked) return;
    const url = window.location.origin;
    import("qrcode").then(({ default: QRCode }) => {
      QRCode.toDataURL(url, { width: 200, margin: 1, color: { dark: "#16120d", light: "#faf9f6" } })
        .then(setWelcomeQR).catch(() => {});
    }).catch(() => {});
  }, [unlocked]);

  function flash(msg: string) { setStatusMsg(msg); setTimeout(() => setStatusMsg(""), 2500); }

  function handlePin(e: React.FormEvent) {
    e.preventDefault();
    if (pin === (getConfig().adminPin ?? DEFAULT_PIN)) { setUnlocked(true); setPinError(false); }
    else { setPinError(true); setPin(""); }
  }

  if (!unlocked) return (
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
          <button type="submit" className="w-full font-sans text-[11px] tracking-[0.4em] uppercase text-ink bg-paper py-4 hover:bg-paper/90 active:scale-95 transition-all">ENTRAR</button>
        </form>
        <div className="mt-10 text-center">
          <a href="/" className="font-sans text-xs text-muted/40 tracking-widest uppercase hover:text-muted/70 transition-colors">← Kiosco</a>
        </div>
      </div>
    </div>
  );

  // ── Filtered results ───────────────────────────────────────────────────────
  const today   = new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });
  const weekSet = dateStringsForLastDays(7);
  const monSet  = dateStringsForLastDays(31);

  const displayed = results.filter((r) => {
    if (dateFilter === "today") return r.fecha === today;
    if (dateFilter === "week")  return weekSet.has(r.fecha);
    if (dateFilter === "month") return monSet.has(r.fecha);
    return true;
  });

  const flavorCount: Record<string, number> = {};
  displayed.forEach((r) => { flavorCount[r.flavorId] = (flavorCount[r.flavorId] ?? 0) + 1; });
  const sortedFlavors = Object.entries(flavorCount).sort((a, b) => b[1] - a[1]);
  const topMax = sortedFlavors[0]?.[1] ?? 1;

  const modeCount = { solo: 0, estado: 0, duo: 0 };
  displayed.forEach((r) => { modeCount[r.modo as keyof typeof modeCount] = (modeCount[r.modo as keyof typeof modeCount] ?? 0) + 1; });

  const hourly: Record<number, number> = {};
  displayed.forEach((r) => { hourly[r.hora] = (hourly[r.hora] ?? 0) + 1; });
  const maxHourly = Math.max(...Object.values(hourly), 1);
  const activeHours = Array.from({ length: 24 }, (_, i) => i).filter((h) => hourly[h] > 0);

  // Peak insights
  const WEEKDAYS = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
  const dayCount: Record<number, number> = {};
  displayed.forEach((r) => {
    const ts = parseInt(r.id.split("-")[0]);
    if (!isNaN(ts)) {
      const d = new Date(ts).getDay();
      dayCount[d] = (dayCount[d] ?? 0) + 1;
    }
  });
  const topHourEntry  = Object.entries(hourly).sort((a, b) => b[1] - a[1])[0];
  const topDayEntry   = Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0];
  const peakHour      = topHourEntry ? `${topHourEntry[0]}:00 h (${topHourEntry[1]} visitas)` : null;
  const peakDay       = topDayEntry  ? `${WEEKDAYS[parseInt(topDayEntry[0])]} (${topDayEntry[1]} visitas)` : null;

  const dateLabel = dateFilter === "today" ? "Hoy" : dateFilter === "week" ? "Últimos 7 días" : dateFilter === "month" ? "Últimos 30 días" : "Todos los tiempos";

  // ── Flavor/stock toggles ──────────────────────────────────────────────────
  function toggleFlavor(id: FlavorId) {
    const updated = flavorCfg.map((f) => f.id === id ? { ...f, activo: !f.activo } : f);
    if (!updated.some((f) => f.activo)) return;
    setFlavorCfg(updated);
    localStorage.setItem(FLAVORS_KEY, JSON.stringify(updated));
  }
  function toggleStock(id: FlavorId) {
    const updated = { ...stockMap, [id]: !stockMap[id] };
    setStockMap(updated); setStock(updated as Record<string, boolean>);
  }
  function toggleSeasonal(id: FlavorId) {
    const cur = seasonal[id] ?? { temporal: false };
    const next = { ...seasonal, [id]: { ...cur, temporal: !cur.temporal } };
    setSeasonal_(next); setSeasonal(next);
  }
  function setSeasonalDate(id: FlavorId, hasta: string) {
    const next = { ...seasonal, [id]: { ...(seasonal[id] ?? { temporal: true }), hasta } };
    setSeasonal_(next); setSeasonal(next);
  }

  // ── Pause ─────────────────────────────────────────────────────────────────
  function togglePause() {
    const next = !paused; setPaused(next); setKiosko({ ...getKiosko(), pausado: next });
  }

  // ── Settings ──────────────────────────────────────────────────────────────
  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const cfg = { ...getConfig(), ...(bizName.trim() ? { businessName: bizName.trim() } : {}), ...(newPin.trim() ? { adminPin: newPin.trim() } : {}) };
    localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
    setNewPin(""); flash("✓ Guardado");
  }

  // ── Backup / Restore ──────────────────────────────────────────────────────
  function handleBackup() {
    const data = {
      exported_at: new Date().toISOString(),
      results: getResults(), config: getConfig(), kiosko: getKiosko(), stock: getStock(),
      seasonal: getSeasonal(), q_overrides: getQOverrides(),
      flavors: (() => { try { return JSON.parse(localStorage.getItem(FLAVORS_KEY) ?? "null"); } catch { return null; } })(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `nivpop-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click(); URL.revokeObjectURL(url);
  }

  function handleRestoreFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target?.result as string);
        if (d.results)      localStorage.setItem("nivpop_results",      JSON.stringify(d.results));
        if (d.config)       localStorage.setItem(CONFIG_KEY,            JSON.stringify(d.config));
        if (d.kiosko)       localStorage.setItem("nivpop_kiosko",       JSON.stringify(d.kiosko));
        if (d.flavors)      localStorage.setItem(FLAVORS_KEY,           JSON.stringify(d.flavors));
        if (d.stock)        localStorage.setItem("nivpop_stock",        JSON.stringify(d.stock));
        if (d.seasonal)     localStorage.setItem("nivpop_seasonal",     JSON.stringify(d.seasonal));
        if (d.q_overrides)  localStorage.setItem("nivpop_q_overrides",  JSON.stringify(d.q_overrides));
        refresh(); flash("✓ Backup restaurado");
      } catch { alert("Error leyendo el archivo."); }
    };
    reader.readAsText(file); e.target.value = "";
  }

  // ── Question overrides ────────────────────────────────────────────────────
  function updateQText(type: "p" | "t", qIdx: number, text: string) {
    if (type === "p") {
      const next = { ...qOverP, [qIdx]: { ...qOverP[qIdx], q: text || undefined } };
      setQOverP(next);
      setQOverrides({ p: next, t: qOverT });
    } else {
      const next = { ...qOverT, [qIdx]: { ...qOverT[qIdx], q: text || undefined } };
      setQOverT(next);
      setQOverrides({ p: qOverP, t: next });
    }
  }
  function updateOptText(type: "p" | "t", qIdx: number, oIdx: number, text: string) {
    function buildOptNext(base: typeof qOverP) {
      const prev = base[qIdx] ?? {};
      const prevO: Record<number, string> = { ...(prev.o ?? {}) };
      if (text) prevO[oIdx] = text; else delete prevO[oIdx];
      return { ...base, [qIdx]: { ...prev, o: prevO } };
    }
    if (type === "p") {
      const next = buildOptNext(qOverP);
      setQOverP(next);
      setQOverrides({ p: next, t: qOverT });
    } else {
      const next = buildOptNext(qOverT);
      setQOverT(next);
      setQOverrides({ p: qOverP, t: next });
    }
  }
  function resetQOverrides() {
    setQOverP({}); setQOverT({});
    setQOverrides({ p: {}, t: {} });
    flash("✓ Preguntas restablecidas");
  }

  const curQBase  = qTab === "p" ? QP : QT;
  const curQOver  = qTab === "p" ? qOverP : qOverT;
  const curQFinal = applyQOverrides(curQBase, curQOver);

  // ── UI helpers ────────────────────────────────────────────────────────────
  const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
    <button type="button" onClick={onClick}
      className={`w-9 h-5 rounded-full transition-colors flex items-center flex-shrink-0 ${on ? "bg-paper/40" : "bg-paper/12"}`}
    >
      <div className={`w-3.5 h-3.5 rounded-full bg-paper transition-transform mx-0.5 ${on ? "translate-x-4" : "translate-x-0"}`} />
    </button>
  );

  const TABS: Array<{ key: Tab; label: string }> = [
    { key: "results",   label: "RESULTADOS" },
    { key: "sabores",   label: "SABORES" },
    { key: "preguntas", label: "PREGUNTAS" },
    { key: "ajustes",   label: "AJUSTES" },
  ];

  const DATE_FILTERS: Array<{ key: DateFilter; label: string }> = [
    { key: "all", label: "Todo" }, { key: "today", label: "Hoy" },
    { key: "week", label: "7 días" }, { key: "month", label: "30 días" },
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
          {paused && <span className="font-sans text-[9px] tracking-widest uppercase text-rose/80 border border-rose/30 px-2.5 py-1">PAUSADO</span>}
          <a href="/display" target="_blank" className="font-sans text-[9px] text-muted/35 hover:text-muted/70 border border-paper/10 px-3 py-2 transition-all" title="Pantalla TV">📺</a>
          <button onClick={() => { if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.(); }}
            className="font-sans text-[9px] text-muted/35 hover:text-muted/70 border border-paper/10 px-3 py-2 transition-all">⛶</button>
          <a href="/" className="font-sans text-[10px] tracking-[0.3em] uppercase text-muted/50 border border-paper/15 px-4 py-2 hover:border-paper/30 hover:text-muted transition-all">← Kiosco</a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-paper/10 px-6 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`font-sans text-[10px] tracking-[0.3em] uppercase py-4 pr-7 flex-shrink-0 transition-colors border-b-2 -mb-px ${
              tab === t.key ? "border-paper/60 text-paper" : "border-transparent text-muted/45 hover:text-muted/80"
            }`}
          >{t.label}</button>
        ))}
      </div>

      <div className="px-6 py-8 max-w-2xl mx-auto">

        {/* ── RESULTADOS ── */}
        {tab === "results" && (
          <div className="space-y-8">
            {/* Date filter */}
            <div className="flex gap-2 flex-wrap">
              {DATE_FILTERS.map((f) => (
                <button key={f.key} onClick={() => setDateFilter(f.key)}
                  className={`font-sans text-[9px] tracking-[0.3em] uppercase px-3 py-1.5 border transition-all ${
                    dateFilter === f.key ? "border-paper/50 text-paper bg-paper/10" : "border-paper/15 text-muted/55 hover:border-paper/25"
                  }`}
                >{f.label}</button>
              ))}
              <button onClick={() => exportCSV(displayed)}
                className="ml-auto font-sans text-[9px] tracking-[0.3em] uppercase text-muted/50 border border-paper/15 px-3 py-1.5 hover:border-paper/30 hover:text-muted transition-all"
              >CSV</button>
              <button onClick={() => exportPDF(displayed, sortedFlavors, dateLabel)}
                className="font-sans text-[9px] tracking-[0.3em] uppercase text-muted/50 border border-paper/15 px-3 py-1.5 hover:border-paper/30 hover:text-muted transition-all"
              >PDF</button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[{v:displayed.length,l:"Total"},{v:modeCount.solo+modeCount.estado,l:"Solo"},{v:modeCount.duo,l:"Dúos"}].map((s) => (
                <div key={s.l} className="border border-paper/10 px-4 py-5 text-center">
                  <p className="font-display text-5xl font-light">{s.v}</p>
                  <p className="text-[8px] tracking-widest text-muted/50 uppercase mt-1">{s.l}</p>
                </div>
              ))}
            </div>

            {/* Flavor bar chart */}
            {sortedFlavors.length > 0 && (
              <div>
                <p className="text-[9px] tracking-[0.4em] text-muted/50 uppercase mb-4">SABORES MÁS ELEGIDOS</p>
                <div className="space-y-2.5">
                  {sortedFlavors.slice(0, 8).map(([id, cnt]) => (
                    <div key={id} className="flex items-center gap-3">
                      <span className="text-base w-6 text-center flex-shrink-0">{FLAVOR_EMOJI[id as FlavorId] ?? "🍦"}</span>
                      <div className="flex-1 bg-paper/5 h-2 rounded-sm overflow-hidden">
                        <div className="h-full rounded-sm transition-all duration-700"
                          style={{ width: `${(cnt/topMax)*100}%`, backgroundColor: FLAVOR_HEX[id as FlavorId] }} />
                      </div>
                      <span className="text-[10px] text-muted/45 w-4 text-right">{cnt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hourly */}
            {activeHours.length > 0 && (
              <div>
                <p className="text-[9px] tracking-[0.4em] text-muted/50 uppercase mb-4">ACTIVIDAD POR HORA</p>
                <div className="flex items-end gap-1 h-16">
                  {Array.from({length:24},(_,h)=>h).map((h) => (
                    <div key={h} className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full bg-paper/25 rounded-sm"
                        style={{ height: `${Math.round(((hourly[h]??0)/maxHourly)*52)}px`, minHeight: hourly[h] ? "3px" : "0" }} />
                      {hourly[h] ? <span className="text-[7px] text-muted/35">{h}h</span> : <span className="text-[7px] text-transparent">-</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Peak insights */}
            {(peakHour || peakDay) && (
              <div className="grid grid-cols-2 gap-3">
                {peakHour && (
                  <div className="border border-paper/10 px-4 py-4">
                    <p className="text-[8px] tracking-widest text-muted/50 uppercase mb-1">HORA PICO</p>
                    <p className="text-sm text-paper/80">{peakHour}</p>
                  </div>
                )}
                {peakDay && (
                  <div className="border border-paper/10 px-4 py-4">
                    <p className="text-[8px] tracking-widest text-muted/50 uppercase mb-1">DÍA MÁS ACTIVO</p>
                    <p className="text-sm text-paper/80">{peakDay}</p>
                  </div>
                )}
              </div>
            )}

            {/* Results list */}
            <div>
              <p className="text-[9px] tracking-[0.4em] text-muted/50 uppercase mb-4">ÚLTIMAS {Math.min(displayed.length, 50)}</p>
              {displayed.length === 0
                ? <p className="text-sm text-muted/35">Sin resultados en este período.</p>
                : (
                  <div className="space-y-2">
                    {displayed.slice(0,50).map((r) => (
                      <div key={r.id} className="flex items-center gap-3 border border-paper/8 px-4 py-3">
                        <span className="text-base flex-shrink-0">{FLAVOR_EMOJI[r.flavorId as FlavorId]??""}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-paper/80 truncate">{r.nombre1}{r.nombre2?` & ${r.nombre2}`:""}</p>
                          <p className="text-[10px] text-muted/40">{r.sabor} · {r.modo}{r.compat?` · ${r.compat}%`:""}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          {r.folio && <p className="text-[9px] text-muted/30 tracking-wide">{r.folio}</p>}
                          <p className="text-[10px] text-muted/35">{r.timeStr}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              }
            </div>

            {results.length > 0 && (
              <button onClick={() => { if(confirm("¿Borrar todo el historial?")) { localStorage.removeItem("nivpop_results"); setResults([]); } }}
                className="font-sans text-[10px] tracking-[0.3em] uppercase text-paper/30 border border-paper/10 px-5 py-3 hover:border-red-500/40 hover:text-red-400/55 transition-all"
              >BORRAR HISTORIAL</button>
            )}
          </div>
        )}

        {/* ── SABORES ── */}
        {tab === "sabores" && (
          <div className="space-y-10">
            {/* Quiz active */}
            <div>
              <p className="text-[9px] tracking-[0.4em] text-muted/50 uppercase mb-1">ACTIVOS EN EL QUIZ</p>
              <p className="text-[10px] text-muted/35 mb-5">Los inactivos no aparecen en los resultados del test.</p>
              <div className="space-y-2">
                {ALL_IDS.map((id) => {
                  const on = flavorCfg.find((c)=>c.id===id)?.activo ?? true;
                  return (
                    <div key={id} className="flex items-center gap-4 border border-paper/8 px-4 py-3 cursor-pointer hover:bg-paper/[0.03]" onClick={()=>toggleFlavor(id)}>
                      <span className="text-lg">{FLAVOR_EMOJI[id]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-paper/80">{FLAVORS[id].name}</p>
                        <p className="text-[10px] text-muted/40">{FLAVORS[id].persona}</p>
                      </div>
                      <Toggle on={on} onClick={()=>toggleFlavor(id)} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stock */}
            <div>
              <p className="text-[9px] tracking-[0.4em] text-muted/50 uppercase mb-1">DISPONIBILIDAD HOY</p>
              <p className="text-[10px] text-muted/35 mb-5">Los no disponibles se muestran como &quot;Agotado&quot; en el catálogo.</p>
              <div className="space-y-2">
                {ALL_IDS.map((id) => {
                  const avail = stockMap[id] !== false;
                  return (
                    <div key={id} className="flex items-center gap-4 border border-paper/8 px-4 py-3 cursor-pointer hover:bg-paper/[0.03]" onClick={()=>toggleStock(id)}>
                      <span className="text-lg">{FLAVOR_EMOJI[id]}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${avail?"text-paper/80":"text-muted/40"}`}>{FLAVORS[id].name}</p>
                        {!avail && <p className="text-[10px] text-muted/35">Agotado</p>}
                      </div>
                      <Toggle on={avail} onClick={()=>toggleStock(id)} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Seasonal */}
            <div>
              <p className="text-[9px] tracking-[0.4em] text-muted/50 uppercase mb-1">SABORES DE TEMPORADA</p>
              <p className="text-[10px] text-muted/35 mb-5">Márcalos con badge de temporada y fecha de fin opcional.</p>
              <div className="space-y-2">
                {ALL_IDS.map((id) => {
                  const s = seasonal[id] ?? { temporal: false };
                  return (
                    <div key={id} className="border border-paper/8 px-4 py-3">
                      <div className="flex items-center gap-4 cursor-pointer" onClick={()=>toggleSeasonal(id)}>
                        <span className="text-lg">{FLAVOR_EMOJI[id]}</span>
                        <div className="flex-1">
                          <p className="text-sm text-paper/80">{FLAVORS[id].name}</p>
                          {s.temporal && s.hasta && (
                            <p className="text-[10px] text-muted/40">Hasta: {s.hasta}</p>
                          )}
                        </div>
                        <Toggle on={!!s.temporal} onClick={()=>toggleSeasonal(id)} />
                      </div>
                      {s.temporal && (
                        <div className="mt-3 flex items-center gap-3">
                          <label className="text-[9px] tracking-[0.3em] text-muted/40 uppercase flex-shrink-0">HASTA</label>
                          <input
                            type="date"
                            value={s.hasta ?? ""}
                            onChange={(e) => setSeasonalDate(id, e.target.value)}
                            className="bg-transparent border-b border-paper/20 text-paper/70 text-xs py-1 focus:outline-none focus:border-paper/40 transition-colors"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── PREGUNTAS ── */}
        {tab === "preguntas" && (
          <div className="space-y-6">
            <div>
              <p className="text-[9px] tracking-[0.4em] text-muted/50 uppercase mb-1">EDITOR DE PREGUNTAS</p>
              <p className="text-[10px] text-muted/35 mb-6">
                Edita el texto de las preguntas y opciones. Los cambios se guardan automáticamente. Los puntajes no se modifican.
              </p>
            </div>

            {/* Type toggle */}
            <div className="flex gap-2 mb-4">
              {(["p","t"] as const).map((t) => (
                <button key={t} onClick={() => setQTab(t)}
                  className={`font-sans text-[10px] tracking-[0.3em] uppercase px-4 py-2 border transition-all ${
                    qTab === t ? "border-paper/50 text-paper bg-paper/10" : "border-paper/15 text-muted/45 hover:border-paper/25"
                  }`}
                >
                  {t === "p" ? "PERSONALIDAD (13)" : "ESTADO DE ÁNIMO (9)"}
                </button>
              ))}
              <button onClick={resetQOverrides}
                className="ml-auto font-sans text-[9px] tracking-widest uppercase text-paper/30 border border-paper/10 px-3 py-2 hover:border-paper/25 hover:text-paper/50 transition-all"
              >RESTABLECER</button>
            </div>

            <div className="space-y-6">
              {curQFinal.map((q, qi) => {
                const baseQ = curQBase[qi];
                const isQEdited = !!curQOver[qi]?.q;
                return (
                  <div key={qi} className="border border-paper/10 p-5 space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="font-sans text-[9px] text-muted/35 mt-2 flex-shrink-0 tabular-nums">{qi+1}</span>
                      <div className="flex-1">
                        <input
                          value={curQOver[qi]?.q ?? baseQ.q}
                          onChange={(e) => updateQText(qTab, qi, e.target.value)}
                          className={`w-full bg-transparent border-b py-1 font-sans text-sm text-paper focus:outline-none transition-colors ${
                            isQEdited ? "border-paper/50 focus:border-paper/70" : "border-paper/15 focus:border-paper/35"
                          }`}
                          placeholder={baseQ.q}
                        />
                        {isQEdited && (
                          <p className="text-[9px] text-muted/35 mt-1">Original: {baseQ.q}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 pl-5">
                      {q.o.map((opt, oi) => {
                        const isOEdited = !!curQOver[qi]?.o?.[oi];
                        return (
                          <div key={oi} className="flex items-center gap-2">
                            <span className="font-sans text-[9px] text-muted/25 flex-shrink-0 tabular-nums w-4">{oi+1}</span>
                            <input
                              value={curQOver[qi]?.o?.[oi] ?? curQBase[qi].o[oi].t}
                              onChange={(e) => updateOptText(qTab, qi, oi, e.target.value)}
                              className={`flex-1 bg-transparent border-b py-1 font-sans text-xs text-paper/75 focus:outline-none transition-colors ${
                                isOEdited ? "border-paper/40 focus:border-paper/60" : "border-paper/10 focus:border-paper/25"
                              }`}
                              placeholder={curQBase[qi].o[oi].t}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── AJUSTES ── */}
        {tab === "ajustes" && (
          <div className="space-y-10">
            <form onSubmit={handleSave} className="space-y-8">
              {/* Pause */}
              <div className="flex items-center justify-between border border-paper/10 px-5 py-4">
                <div>
                  <p className="text-sm text-paper/80 mb-0.5">Pausar kiosco</p>
                  <p className="text-[10px] text-muted/40">Muestra &quot;Volvemos enseguida&quot; en pantalla</p>
                </div>
                <button type="button" onClick={togglePause}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center flex-shrink-0 ml-4 ${paused?"bg-rose/60":"bg-paper/20"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-paper transition-transform mx-1 ${paused?"translate-x-5":"translate-x-0"}`} />
                </button>
              </div>

              {/* Auto-print */}
              <div className="flex items-center justify-between border border-paper/10 px-5 py-4">
                <div>
                  <p className="text-sm text-paper/80 mb-0.5">Auto-imprimir ticket</p>
                  <p className="text-[10px] text-muted/40">Imprime automáticamente al llegar al ticket</p>
                </div>
                <Toggle
                  on={!!getKiosko().autoPrint}
                  onClick={() => setKiosko({ ...getKiosko(), autoPrint: !getKiosko().autoPrint })}
                />
              </div>

              <div>
                <label className="text-[9px] tracking-[0.4em] text-muted/60 uppercase block mb-2">NOMBRE DEL NEGOCIO</label>
                <input type="text" value={bizName} onChange={(e)=>setBizName(e.target.value)}
                  placeholder="NIV'POP Helados Artesanales"
                  className="w-full bg-transparent border-b border-paper/25 focus:border-paper/60 text-paper text-base py-2 outline-none placeholder:text-muted/25 transition-colors"
                />
              </div>

              <div>
                <label className="text-[9px] tracking-[0.4em] text-muted/60 uppercase block mb-2">NUEVO PIN DE ADMIN</label>
                <input type="password" value={newPin} onChange={(e)=>setNewPin(e.target.value)}
                  placeholder="Dejar vacío para no cambiar" maxLength={8}
                  className="w-full bg-transparent border-b border-paper/25 focus:border-paper/60 text-paper text-base py-2 outline-none placeholder:text-muted/25 tracking-[0.3em] transition-colors"
                />
                <p className="text-[9px] text-muted/30 mt-1">PIN actual: {getConfig().adminPin ?? "1234 (por defecto)"}</p>
              </div>

              <button type="submit"
                className="font-sans text-[11px] tracking-[0.4em] uppercase text-ink bg-paper px-10 py-4 hover:bg-paper/90 active:scale-95 transition-all"
              >{statusMsg || "GUARDAR CAMBIOS"}</button>
            </form>

            {/* Welcome QR */}
            {welcomeQR && (
              <div className="border-t border-paper/10 pt-8">
                <p className="text-[9px] tracking-[0.4em] text-muted/50 uppercase mb-1">QR DE BIENVENIDA</p>
                <p className="text-[10px] text-muted/35 mb-5">Imprime y coloca en el mostrador para que los clientes abran el kiosco en su celular.</p>
                <div className="flex flex-col items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={welcomeQR} alt="QR kiosco" className="w-36 h-36 border border-paper/15 p-2" />
                  <p className="font-sans text-xs text-muted/40 text-center">{window.location.origin}</p>
                  <button
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = welcomeQR;
                      a.download = "nivpop-qr-bienvenida.png";
                      a.click();
                    }}
                    className="font-sans text-[10px] tracking-[0.3em] uppercase text-muted/50 border border-paper/15 px-5 py-2.5 hover:border-paper/30 hover:text-muted transition-all"
                  >
                    DESCARGAR QR
                  </button>
                </div>
              </div>
            )}

            {/* Backup / Restore */}
            <div className="border-t border-paper/10 pt-8 space-y-4">
              <p className="text-[9px] tracking-[0.4em] text-muted/50 uppercase mb-4">BACKUP & RESTAURAR</p>
              <button onClick={handleBackup}
                className="w-full font-sans text-[11px] tracking-[0.3em] uppercase text-paper/70 border border-paper/20 py-4 hover:border-paper/40 active:scale-95 transition-all"
              >DESCARGAR BACKUP (JSON)</button>
              <button type="button" onClick={()=>restoreRef.current?.click()}
                className="w-full font-sans text-[11px] tracking-[0.3em] uppercase text-paper/40 border border-paper/12 py-4 hover:border-paper/25 hover:text-paper/60 active:scale-95 transition-all"
              >RESTAURAR DESDE BACKUP</button>
              <input ref={restoreRef} type="file" accept=".json" onChange={handleRestoreFile} className="hidden" />
              {statusMsg && <p className="font-sans text-xs text-muted/60 text-center">{statusMsg}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
