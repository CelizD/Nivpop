"use client";
import type { FlavorId } from "@/lib/types";
import { FLAVORS, FLAVOR_EMOJI, TEMPORADA } from "@/lib/flavors";
import { FLAVOR_HEX } from "@/lib/colors";

const ALL_IDS = Object.keys(FLAVORS) as FlavorId[];

interface Props {
  onSelect: (id: FlavorId) => void;
  onBack: () => void;
}

export default function CatalogScreen({ onSelect, onBack }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-7 pt-12 pb-6 flex-shrink-0">
        <p className="font-sans text-[9px] tracking-[0.5em] text-muted/60 uppercase mb-2">CATÁLOGO</p>
        <h2 className="font-display text-4xl italic text-paper">Los 16 sabores</h2>
      </div>

      <div className="flex-1 px-5 pb-24 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {ALL_IDS.map((id) => {
            const f   = FLAVORS[id];
            const hex = FLAVOR_HEX[id];
            return (
              <button
                key={id}
                onClick={() => onSelect(id)}
                className="text-left border border-paper/10 bg-paper/[0.02] hover:bg-paper/8 active:scale-[0.97] transition-all duration-100 px-4 py-5"
                style={{ borderTop: `2px solid ${hex}55` }}
              >
                {TEMPORADA.has(id) && (
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
