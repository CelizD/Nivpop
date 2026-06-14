"use client";
import { useState, useEffect, useCallback } from "react";
import type { NivResult, FlavorId } from "@/lib/types";
import { FLAVOR_EMOJI } from "@/lib/flavors";
import { getResults, getConfig } from "@/lib/storage";

const DEFAULT_PIN = "1234";
const RESULTS_KEY = "nivpop_results";
const CONFIG_KEY  = "nivpop_config";

function loadResults(): NivResult[] { return getResults(); }

export default function AdminPage() {
  const [pin, setPin]         = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [results, setResults]   = useState<NivResult[]>([]);
  const [tab, setTab]           = useState<"results" | "settings">("results");

  const [newPin, setNewPin]         = useState("");
  const [businessName, setBizName]  = useState("");
  const [saved, setSaved]           = useState(false);

  const refreshResults = useCallback(() => setResults(loadResults()), []);

  useEffect(() => {
    if (unlocked) {
      refreshResults();
      const cfg = getConfig();
      setBizName(cfg.businessName ?? "");
    }
  }, [unlocked, refreshResults]);

  function handlePin(e: React.FormEvent) {
    e.preventDefault();
    const correctPin = getConfig().adminPin ?? DEFAULT_PIN;
    if (pin === correctPin) { setUnlocked(true); setPinError(false); }
    else { setPinError(true); setPin(""); }
  }

  function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    const existing = getConfig();
    const updated = {
      ...existing,
      businessName: businessName.trim() || existing.businessName,
      ...(newPin.trim() ? { adminPin: newPin.trim() } : {}),
    };
    localStorage.setItem(CONFIG_KEY, JSON.stringify(updated));
    setNewPin("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleClearResults() {
    if (!confirm("¿Borrar todos los resultados? Esta acción no se puede deshacer.")) return;
    localStorage.removeItem(RESULTS_KEY);
    setResults([]);
  }

  // ── PIN screen ────────────────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-8">
        <div className="w-full max-w-xs">
          <h1 className="font-display text-5xl italic text-paper text-center mb-3">Admin</h1>
          <p className="font-sans text-[9px] tracking-[0.5em] text-muted/50 uppercase text-center mb-14">
            NIV&apos;POP
          </p>
          <form onSubmit={handlePin} className="space-y-6">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN"
              autoFocus
              className="w-full bg-transparent border-b border-paper/30 focus:border-paper/70 text-paper font-sans text-2xl py-3 outline-none placeholder:text-muted/30 text-center tracking-[0.6em]"
            />
            {pinError && (
              <p className="font-sans text-xs text-rose text-center">PIN incorrecto</p>
            )}
            <button
              type="submit"
              className="w-full font-sans text-[11px] tracking-[0.4em] uppercase text-ink bg-paper py-4 hover:bg-paper/90 active:scale-95 transition-all"
            >
              ENTRAR
            </button>
          </form>
          <div className="mt-10 text-center">
            <a
              href="/"
              className="font-sans text-xs text-muted/40 tracking-widest uppercase hover:text-muted/70 transition-colors"
            >
              ← Kiosco
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  const today = new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });
  const todayResults = results.filter((r) => r.fecha === today);

  const flavorCount: Record<string, number> = {};
  results.forEach((r) => { flavorCount[r.flavorId] = (flavorCount[r.flavorId] ?? 0) + 1; });
  const topEntry = Object.entries(flavorCount).sort((a, b) => b[1] - a[1])[0];

  const modeCount = { solo: 0, estado: 0, duo: 0 };
  results.forEach((r) => { modeCount[r.modo] = (modeCount[r.modo] ?? 0) + 1; });

  return (
    <div className="min-h-screen bg-ink text-paper font-sans">
      {/* Header */}
      <div className="border-b border-paper/10 px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl italic">Admin</h1>
          <p className="text-[9px] tracking-[0.5em] text-muted/50 uppercase mt-0.5">NIV&apos;POP</p>
        </div>
        <a
          href="/"
          className="font-sans text-[10px] tracking-[0.3em] uppercase text-muted/60 border border-paper/15 px-4 py-2 hover:border-paper/30 hover:text-muted transition-all"
        >
          ← Kiosco
        </a>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-paper/10 px-6">
        {(["results", "settings"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-sans text-[10px] tracking-[0.3em] uppercase py-4 pr-8 transition-colors border-b-2 -mb-px ${
              tab === t
                ? "border-paper/60 text-paper"
                : "border-transparent text-muted/50 hover:text-muted/80"
            }`}
          >
            {t === "results" ? "RESULTADOS" : "AJUSTES"}
          </button>
        ))}
      </div>

      <div className="px-6 py-8 max-w-xl mx-auto">
        {tab === "results" && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="border border-paper/10 px-4 py-5 text-center">
                <p className="font-display text-5xl font-light">{results.length}</p>
                <p className="text-[8px] tracking-widest text-muted/50 uppercase mt-1">Total</p>
              </div>
              <div className="border border-paper/10 px-4 py-5 text-center">
                <p className="font-display text-5xl font-light">{todayResults.length}</p>
                <p className="text-[8px] tracking-widest text-muted/50 uppercase mt-1">Hoy</p>
              </div>
              <div className="border border-paper/10 px-4 py-5 text-center">
                {topEntry ? (
                  <>
                    <p className="text-3xl">{FLAVOR_EMOJI[topEntry[0] as FlavorId] ?? "🍦"}</p>
                    <p className="text-[8px] tracking-widest text-muted/50 uppercase mt-1">
                      Popular
                    </p>
                  </>
                ) : (
                  <p className="text-muted/30 text-lg">—</p>
                )}
              </div>
            </div>

            {/* Mode breakdown */}
            <div className="border border-paper/10 px-5 py-4">
              <p className="text-[9px] tracking-[0.4em] text-muted/50 uppercase mb-3">POR MODO</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="font-display text-2xl">{modeCount.solo}</p>
                  <p className="text-[9px] text-muted/50">Personalidad</p>
                </div>
                <div>
                  <p className="font-display text-2xl">{modeCount.estado}</p>
                  <p className="text-[9px] text-muted/50">Estado</p>
                </div>
                <div>
                  <p className="font-display text-2xl">{modeCount.duo}</p>
                  <p className="text-[9px] text-muted/50">Dúo</p>
                </div>
              </div>
            </div>

            {/* Results list */}
            <div>
              <p className="text-[9px] tracking-[0.4em] text-muted/50 uppercase mb-4">
                ÚLTIMAS {Math.min(results.length, 50)} VISITAS
              </p>
              {results.length === 0 ? (
                <p className="text-sm text-muted/40">Aún no hay resultados.</p>
              ) : (
                <div className="space-y-2">
                  {results.slice(0, 50).map((r) => (
                    <div key={r.id} className="flex items-center gap-4 border border-paper/8 px-4 py-3">
                      <span className="text-lg flex-shrink-0">
                        {FLAVOR_EMOJI[r.flavorId as FlavorId] ?? "🍦"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-paper/80 truncate">
                          {r.nombre1}{r.nombre2 ? ` & ${r.nombre2}` : ""}
                        </p>
                        <p className="text-[10px] text-muted/50">
                          {r.sabor} · {r.modo}{r.compat ? ` · ${r.compat}%` : ""}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[10px] text-muted/40">{r.timeStr}</p>
                        <p className="text-[10px] text-muted/30 truncate max-w-[80px]">{r.fecha}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Danger */}
            {results.length > 0 && (
              <button
                onClick={handleClearResults}
                className="font-sans text-[10px] tracking-[0.3em] uppercase text-paper/40 border border-paper/12 px-5 py-3 hover:border-red-500/40 hover:text-red-400/70 transition-all"
              >
                BORRAR HISTORIAL
              </button>
            )}
          </div>
        )}

        {tab === "settings" && (
          <form onSubmit={handleSaveSettings} className="space-y-8">
            <div>
              <label className="text-[9px] tracking-[0.4em] text-muted/60 uppercase block mb-2">
                NOMBRE DEL NEGOCIO
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBizName(e.target.value)}
                placeholder="NIV'POP Helados Artesanales"
                className="w-full bg-transparent border-b border-paper/25 focus:border-paper/60 text-paper text-base py-2 outline-none placeholder:text-muted/25 transition-colors"
              />
            </div>

            <div>
              <label className="text-[9px] tracking-[0.4em] text-muted/60 uppercase block mb-2">
                NUEVO PIN (dejar vacío para no cambiar)
              </label>
              <input
                type="password"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="••••"
                maxLength={8}
                className="w-full bg-transparent border-b border-paper/25 focus:border-paper/60 text-paper text-base py-2 outline-none placeholder:text-muted/25 tracking-widest transition-colors"
              />
              <p className="text-[9px] text-muted/40 mt-1">PIN actual por defecto: 1234</p>
            </div>

            <button
              type="submit"
              className="font-sans text-[11px] tracking-[0.4em] uppercase text-ink bg-paper px-10 py-4 hover:bg-paper/90 active:scale-95 transition-all"
            >
              {saved ? "✓ GUARDADO" : "GUARDAR"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
