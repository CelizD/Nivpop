"use client";
import { useState, useEffect } from "react";
import type { FlavorId } from "@/lib/types";
import { FLAVORS, FLAVOR_EMOJI, TEMPORADA } from "@/lib/flavors";
import { FLAVOR_HEX } from "@/lib/colors";
import { getStock } from "@/lib/storage";

const ALL_IDS = Object.keys(FLAVORS) as FlavorId[];

type Filter = "all" | "agua" | "leche" | "temporada" | "sin-lacteos";

const FILTERS: Array<{ key: Filter; label: string }> = [
  { key: "all",         label: "Todos" },
  { key: "agua",        label: "En agua" },
  { key: "leche",       label: "En leche" },
  { key: "temporada",   label: "Temporada" },
  { key: "sin-lacteos", label: "Sin lácteos" },
];

interface Props {
  onSelect: (id: FlavorId) => void;
  onBack: () => void;
}

export default function CatalogScreen({ onSelect, onBack }: Props) {
  const [filter, setFilter]   = useState<Filter>("all");
  const [stock,  setStockMap] = useState<Record<string, boolean>>({});

  useEffect(() => { setStockMap(getStock()); }, []);

  const visible = ALL_IDS.filter((id) => {
    const f = FLAVORS[id];
    switch (filter) {
      case "agua":        return f.baseType === "agua" || f.baseType === "ambas";
      case "leche":       return f.baseType === "leche" || f.baseType === "ambas";
      case "temporada":   return TEMPORADA.has(id);
      case "sin-lacteos": return !f.allergens.lacteos;
      default:            return true;
    }
  });

  const hasStock = Object.keys(stock).length > 0;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-7 pt-12 pb-4 flex-shrink-0">
        <p className="font-sans text-[9px] tracking-[0.5em] text-muted/60 uppercase mb-2">CATÁLOGO</p>
        <h2 className="font-display text-4xl italic text-paper mb-5">Los {ALL_IDS.length} sabores</h2>

        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`font-sans text-[9px] tracking-[0.3em] uppercase px-3 py-1.5 border transition-all ${
                filter === f.key
                  ? "border-paper/50 text-paper bg-paper/10"
                  : "border-paper/15 text-muted/60 hover:border-paper/25"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-5 pb-24 overflow-y-auto">
        {visible.length === 0 && (
          <p className="font-sans text-sm text-muted/40 px-2 py-6">Ningún sabor coincide con este filtro.</p>
        )}
        <div className="grid grid-cols-2 gap-3">
          {visible.map((id) => {
            const f    = FLAVORS[id];
            const hex  = FLAVOR_HEX[id];
            const agotado = hasStock && stock[id] === false;
            return (
              <button
                key={id}
                onClick={() => !agotado && onSelect(id)}
                className={`relative text-left border border-paper/10 bg-paper/[0.02] transition-all duration-100 px-4 py-5 ${
                  agotado ? "opacity-40 cursor-not-allowed" : "hover:bg-paper/8 active:scale-[0.97]"
                }`}
                style={{ borderTop: `2px solid ${hex}55` }}
              >
                {agotado && (
                  <span className="absolute top-2 right-2 font-sans text-[7px] tracking-widest uppercase text-muted/60 border border-muted/20 px-1.5 py-0.5">
                    Agotado
                  </span>
                )}
                {TEMPORADA.has(id) && !agotado && (
                  <span className="font-sans text-[7px] tracking-widest text-muted/40 uppercase block mb-1">
                    temporada
                  </span>
                )}
                <span className="text-2xl block mb-2">{FLAVOR_EMOJI[id]}</span>
                <p className="font-sans text-xs font-medium text-paper/90 leading-tight mb-1">{f.name}</p>
                <p className="font-sans text-[10px] text-muted/55 leading-tight">{f.persona}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="sticky bottom-0 bg-ink px-7 py-4 border-t border-paper/10">
        <button
          onClick={onBack}
          className="font-sans text-xs text-muted/60 tracking-widest uppercase hover:text-muted transition-colors"
        >
          ← Atrás
        </button>
      </div>
    </div>
  );
}
