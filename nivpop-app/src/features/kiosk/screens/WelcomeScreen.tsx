"use client";
import { useEffect, useState } from "react";
import type { FlavorId } from "@/types";
import { FLAVOR_EMOJI } from "@/utils/flavors";
import { FLAVOR_HEX } from "@/utils/colors";
import { getResults, getResultCount, getStamps } from "@/services/storage";

const EMOJIS = ["🍓","🍦","🍃","🍫","🥭","💜","🍵","🍯","🫐","🍮","🍋","🌿","☕","🍌","🍷","🌸"];
const STAMP_GOAL = 5;

interface Props {
  onStart: () => void;
  onCatalog: () => void;
  onSurprise: () => void;
  onFolio: () => void;
}

function useFlavorDelDia(): FlavorId | null {
  const [flavor, setFlavor] = useState<FlavorId | null>(null);
  useEffect(() => {
    try {
      const results = getResults();
      const today = new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });
      const todayOnes = results.filter((r) => r.fecha === today);
      if (!todayOnes.length) return;
      const count: Record<string, number> = {};
      todayOnes.forEach((r) => { count[r.flavorId] = (count[r.flavorId] ?? 0) + 1; });
      const top = Object.entries(count).sort((a, b) => b[1] - a[1])[0];
      if (top) setFlavor(top[0] as FlavorId);
    } catch { /* ignore */ }
  }, []);
  return flavor;
}

export default function WelcomeScreen({ onStart, onCatalog, onSurprise, onFolio }: Props) {
  const flavorDelDia = useFlavorDelDia();
  const [totalCount, setTotalCount] = useState(0);
  const [stamps,     setStamps]     = useState(0);

  useEffect(() => {
    setTotalCount(getResultCount());
    setStamps(getStamps());
  }, []);

  const stampsLeft = STAMP_GOAL - (stamps % STAMP_GOAL);
  const hasReward  = stamps > 0 && stamps % STAMP_GOAL === 0;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-8 py-20 text-center overflow-hidden">
      {/* Fullscreen toggle */}
      <button
        onClick={() => {
          if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
          else document.exitFullscreen?.();
        }}
        className="absolute top-5 right-5 font-sans text-[9px] text-muted/25 hover:text-muted/50 transition-colors tracking-widest uppercase"
        title="Pantalla completa"
      >
        ⛶
      </button>

      {/* Folio lookup link */}
      <button
        onClick={onFolio}
        className="absolute top-5 left-5 font-sans text-[9px] text-muted/25 hover:text-muted/50 transition-colors tracking-widest uppercase"
      >
        BUSCAR FOLIO
      </button>

      <div className="mb-12">
        <h1 className="font-display text-8xl font-light tracking-[0.25em] text-paper mb-2">
          NIV&apos;POP
        </h1>
        <p className="font-sans text-[10px] tracking-[0.5em] text-muted uppercase">
          HELADOS ARTESANALES
        </p>
      </div>

      {/* Sabor del día */}
      {flavorDelDia && (
        <div className="mb-6 border border-paper/10 px-5 py-3 flex items-center gap-3">
          <span className="text-xl">{FLAVOR_EMOJI[flavorDelDia]}</span>
          <div className="text-left">
            <p className="font-sans text-[8px] tracking-[0.4em] uppercase" style={{ color: FLAVOR_HEX[flavorDelDia] }}>
              SABOR DEL DÍA
            </p>
            <p className="font-sans text-xs text-paper/70 mt-0.5">El más elegido hoy</p>
          </div>
        </div>
      )}

      {/* Visit counter */}
      {totalCount > 0 && (
        <p className="font-sans text-[10px] text-muted/35 tracking-widest uppercase mb-8">
          Ya <span className="text-paper/55">{totalCount.toLocaleString()}</span> personas descubrieron su sabor
        </p>
      )}

      <div className="mb-12">
        <p className="font-display text-3xl italic text-paper/80 mb-4 leading-snug">
          Descubre tu sabor de nieve
        </p>
        <p className="font-sans text-sm text-muted max-w-xs leading-relaxed mx-auto">
          Un test de personalidad para conocerte<br />a través de los sabores
        </p>
      </div>

      <button
        onClick={onStart}
        className="font-sans text-[11px] tracking-[0.4em] uppercase text-ink bg-paper px-16 py-5 hover:bg-paper/90 active:scale-95 transition-all duration-150"
      >
        COMENZAR
      </button>

      <div className="flex gap-8 mt-7">
        <button
          onClick={onSurprise}
          className="font-sans text-[10px] tracking-[0.3em] text-muted/60 uppercase hover:text-muted/90 transition-colors"
        >
          SORPRÉNDEME ✨
        </button>
        <button
          onClick={onCatalog}
          className="font-sans text-[10px] tracking-[0.3em] text-muted/40 uppercase hover:text-muted/70 transition-colors"
        >
          VER CATÁLOGO →
        </button>
      </div>

      {/* Stamp progress */}
      {stamps > 0 && !hasReward && (
        <div className="mt-10 flex flex-col items-center gap-2">
          <div className="flex gap-1.5">
            {Array.from({ length: STAMP_GOAL }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full border transition-colors ${
                  i < (stamps % STAMP_GOAL) ? "bg-paper/70 border-paper/70" : "border-paper/20"
                }`}
              />
            ))}
          </div>
          <p className="font-sans text-[9px] text-muted/30 tracking-widest uppercase">
            {stampsLeft} visita{stampsLeft !== 1 ? "s" : ""} para tu regalo
          </p>
        </div>
      )}

      {hasReward && (
        <div className="mt-10 border border-paper/20 px-6 py-4 text-center">
          <p className="font-sans text-[9px] tracking-[0.4em] text-paper/60 uppercase mb-1">¡Premio desbloqueado!</p>
          <p className="font-display text-xl italic text-paper/80">10% de descuento en tu próxima compra</p>
          <p className="font-sans text-[9px] text-muted/40 mt-1">Muestra esta pantalla al cajero</p>
        </div>
      )}

      <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none select-none">
        <p className="text-lg text-paper/10 tracking-widest">{EMOJIS.join("  ")}</p>
      </div>
    </div>
  );
}
