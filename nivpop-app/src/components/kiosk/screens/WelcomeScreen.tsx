"use client";
import { useEffect, useState } from "react";
import type { FlavorId } from "@/lib/types";
import { FLAVOR_EMOJI } from "@/lib/flavors";
import { FLAVOR_HEX } from "@/lib/colors";

const EMOJIS = ["🍓","🍦","🍃","🍫","🥭","💜","🍵","🍯","🫐","🍮","🍋","🌿","☕","🍌","🍷","🌸"];

interface Props {
  onStart: () => void;
  onCatalog: () => void;
  onSurprise: () => void;
}

function useFlavorDelDia(): FlavorId | null {
  const [flavor, setFlavor] = useState<FlavorId | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("nivpop_results");
      if (!raw) return;
      const results: Array<{ fecha: string; flavorId: string }> = JSON.parse(raw);
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

export default function WelcomeScreen({ onStart, onCatalog, onSurprise }: Props) {
  const flavorDelDia = useFlavorDelDia();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-8 py-20 text-center overflow-hidden">
      {/* Fullscreen hint top-right */}
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

      <div className="mb-14">
        <h1 className="font-display text-8xl font-light tracking-[0.25em] text-paper mb-2">
          NIV&apos;POP
        </h1>
        <p className="font-sans text-[10px] tracking-[0.5em] text-muted uppercase">
          HELADOS ARTESANALES
        </p>
      </div>

      {/* Sabor del día */}
      {flavorDelDia && (
        <div className="mb-8 border border-paper/10 px-5 py-3 flex items-center gap-3">
          <span className="text-xl">{FLAVOR_EMOJI[flavorDelDia]}</span>
          <div className="text-left">
            <p className="font-sans text-[8px] tracking-[0.4em] uppercase" style={{ color: FLAVOR_HEX[flavorDelDia] }}>
              SABOR DEL DÍA
            </p>
            <p className="font-sans text-xs text-paper/70 mt-0.5">El más elegido hoy</p>
          </div>
        </div>
      )}

      <div className="mb-14">
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

      <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none select-none">
        <p className="text-lg text-paper/10 tracking-widest">{EMOJIS.join("  ")}</p>
      </div>
    </div>
  );
}
