"use client";
import { useEffect, useState, useCallback } from "react";
import type { FlavorId, NivResult } from "@/types";
import { FLAVORS, FLAVOR_EMOJI } from "@/utils/flavors";
import { FLAVOR_HEX } from "@/utils/colors";
import { getResults, getResultCount } from "@/services/storage";

function useClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function computeSaborDelDia(): FlavorId | null {
  const results = getResults();
  const today = new Date().toLocaleDateString("es-MX", {
    day: "2-digit", month: "long", year: "numeric",
  });
  const todayOnes = results.filter((r) => r.fecha === today);
  if (!todayOnes.length) return null;
  const count: Record<string, number> = {};
  todayOnes.forEach((r) => { count[r.flavorId] = (count[r.flavorId] ?? 0) + 1; });
  const top = Object.entries(count).sort((a, b) => b[1] - a[1])[0];
  return (top?.[0] as FlavorId) ?? null;
}

export default function DisplayPage() {
  const time   = useClock();
  const [flavorId, setFlavorId]       = useState<FlavorId | null>(null);
  const [totalCount, setTotalCount]   = useState(0);
  const [recent, setRecent]           = useState<NivResult[]>([]);

  const refresh = useCallback(() => {
    setFlavorId(computeSaborDelDia());
    setTotalCount(getResultCount());
    setRecent(getResults().slice(0, 6));
  }, []);

  useEffect(() => {
    refresh();
    // Re-compute when a new result is saved (same tab) or admin changes something (other tab)
    const onNew = () => refresh();
    window.addEventListener("nivpop:nuevo", onNew);
    window.addEventListener("storage", onNew);
    // Fallback poll every 30 s
    const id = setInterval(refresh, 30_000);
    return () => {
      clearInterval(id);
      window.removeEventListener("nivpop:nuevo", onNew);
      window.removeEventListener("storage", onNew);
    };
  }, [refresh]);

  const f   = flavorId ? FLAVORS[flavorId] : null;
  const hex = flavorId ? FLAVOR_HEX[flavorId] : "#faf9f6";

  return (
    <div
      className="min-h-screen bg-ink text-paper flex flex-col items-center justify-center select-none overflow-hidden px-10 py-14"
      style={{ transition: "background-color 1.2s ease" }}
    >
      {/* Clock + brand */}
      <div className="absolute top-8 left-0 right-0 flex items-center justify-between px-10">
        <p className="font-sans text-[10px] tracking-[0.6em] text-muted/40 uppercase">
          NIV&apos;POP · HELADOS ARTESANALES
        </p>
        <p className="font-sans text-sm text-muted/40 tabular-nums">{time}</p>
      </div>

      {/* Sabor del día */}
      <div className="text-center">
        {f ? (
          <>
            <p className="font-sans text-[10px] tracking-[0.5em] uppercase mb-8" style={{ color: hex }}>
              SABOR DEL DÍA
            </p>
            <div className="text-[9rem] leading-none mb-6 animate-pulse-slow">
              {FLAVOR_EMOJI[flavorId!]}
            </div>
            <h1 className="font-display text-7xl font-light mb-2" style={{ color: hex }}>
              {f.name}
            </h1>
            <p className="font-display text-2xl italic text-paper/40">{f.persona}</p>
          </>
        ) : (
          <>
            <div className="text-[9rem] leading-none mb-6 opacity-20">🍦</div>
            <h1 className="font-display text-6xl font-light text-paper/30">
              Aún sin datos de hoy
            </h1>
          </>
        )}
      </div>

      {/* Stats row */}
      <div className="absolute bottom-10 left-0 right-0 px-10 flex items-end justify-between">
        {/* Total counter */}
        <div>
          <p className="font-display text-5xl font-light" style={{ color: hex }}>{totalCount}</p>
          <p className="font-sans text-[9px] tracking-[0.4em] text-muted/35 uppercase mt-1">
            Descubrimientos
          </p>
        </div>

        {/* Recent names ticker */}
        <div className="text-right max-w-xs">
          <p className="font-sans text-[9px] tracking-[0.4em] text-muted/30 uppercase mb-2">
            Últimas visitas
          </p>
          <div className="space-y-0.5">
            {recent.map((r) => (
              <p key={r.id} className="font-sans text-xs text-muted/40 truncate">
                {FLAVOR_EMOJI[r.flavorId]} {r.nombre1}{r.nombre2 ? ` & ${r.nombre2}` : ""}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Color bar at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 transition-colors duration-1000"
        style={{ backgroundColor: hex }}
      />
    </div>
  );
}
