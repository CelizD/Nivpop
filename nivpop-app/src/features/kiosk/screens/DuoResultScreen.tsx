"use client";
import type { KioskState } from "@/types";
import { FLAVORS, FLAVOR_EMOJI, DUO_ALL, DUO_TIP, VINCULOS } from "@/utils/flavors";
import { FLAVOR_HEX } from "@/utils/colors";
import { calcTopFlavors } from "@/utils/quiz";

interface Props {
  state: KioskState;
  onTicket: () => void;
  onShare: () => void;
  onReset: () => void;
}

export default function DuoResultScreen({ state, onTicket, onShare, onReset }: Props) {
  const { dRKey, dN1, dN2, dVin, lastCompat, dScores } = state;
  const f = FLAVORS[dRKey];
  const hex = FLAVOR_HEX[dRKey];
  const emoji = FLAVOR_EMOJI[dRKey];
  const vinLabel = dVin ? VINCULOS[dVin]?.label : "";

  const topFlavors = calcTopFlavors(dScores, 3);
  const runners    = topFlavors.slice(1).filter((id) => id !== dRKey);

  return (
    <div className="flex flex-col min-h-screen overflow-y-auto">
      {/* Header */}
      <div className="flex-shrink-0 px-7 pt-14 pb-10" style={{ borderBottom: `1px solid ${hex}40` }}>
        <p className="font-sans text-[9px] tracking-[0.5em] text-muted/60 uppercase mb-6">
          {dN1} & {dN2} {vinLabel ? `— ${vinLabel}` : ""}
        </p>
        <div className="text-6xl mb-5">{emoji}</div>
        <h1 className="font-display text-5xl font-light text-paper leading-tight mb-1" style={{ color: hex }}>
          {f.name}
        </h1>
        <p className="font-display text-xl italic text-paper/60">Su sabor compartido</p>
      </div>

      <div className="flex-1 px-7 py-8 space-y-10 pb-20">
        {/* Compatibility */}
        <div className="text-center py-6 border border-paper/10">
          <p className="font-sans text-[9px] tracking-[0.5em] text-muted/60 uppercase mb-3">COMPATIBILIDAD</p>
          <p className="font-display text-7xl font-light" style={{ color: hex }}>
            {lastCompat}<span className="text-4xl">%</span>
          </p>
        </div>

        {/* Alliance name */}
        {DUO_ALL[dRKey] && (
          <div>
            <p className="font-sans text-[9px] tracking-[0.4em] text-muted/60 uppercase mb-2">SU ALIANZA</p>
            <p className="font-display text-2xl italic text-paper/80">{DUO_ALL[dRKey]}</p>
          </div>
        )}

        {/* Description */}
        <p className="font-sans text-sm text-paper/80 leading-relaxed">{f.desc}</p>

        {/* Insight */}
        <div className="border-l-2 pl-5" style={{ borderColor: hex }}>
          <p className="font-display text-lg italic" style={{ color: hex }}>&ldquo;{f.ins.hl}&rdquo;</p>
        </div>

        {/* Duo tip */}
        {DUO_TIP[dRKey] && (
          <div className="bg-paper/[0.03] border border-paper/8 px-5 py-4">
            <p className="font-sans text-[9px] tracking-[0.4em] text-muted/60 uppercase mb-2">PARA SU DÚO</p>
            <p className="font-sans text-sm text-paper/75 leading-relaxed">{DUO_TIP[dRKey]}</p>
          </div>
        )}

        {/* Runners-up */}
        {runners.length > 0 && (
          <div>
            <p className="font-sans text-[9px] tracking-[0.4em] text-muted/60 uppercase mb-3">TAMBIÉN PODRÍAN SER…</p>
            <div className="flex gap-3">
              {runners.map((id) => {
                const rf  = FLAVORS[id];
                const rhex = FLAVOR_HEX[id];
                return (
                  <div key={id} className="flex-1 border border-paper/10 px-4 py-3 text-center">
                    <p className="text-2xl mb-1">{FLAVOR_EMOJI[id]}</p>
                    <p className="font-display text-base" style={{ color: rhex }}>{rf.name}</p>
                    <p className="font-display text-xs italic text-paper/40 mt-0.5">{rf.persona}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Maridaje */}
        {f.maridaje?.length > 0 && (
          <div>
            <p className="font-sans text-[9px] tracking-[0.4em] text-muted/60 uppercase mb-3">MARIDAN CON</p>
            <div className="flex gap-3 flex-wrap">
              {f.maridaje.map((m) => (
                <span key={m} className="font-sans text-xs border border-paper/20 text-paper/70 px-3 py-1.5">{m}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTAs */}
      <div className="sticky bottom-0 bg-ink px-7 py-5 border-t border-paper/10 space-y-3">
        <button onClick={onTicket} className="w-full font-sans text-[11px] tracking-[0.4em] uppercase text-ink bg-paper py-4 hover:bg-paper/90 active:scale-95 transition-all duration-150">
          OBTENER TICKET
        </button>
        <button onClick={onShare} className="w-full font-sans text-[11px] tracking-[0.4em] uppercase text-paper/70 border border-paper/20 py-4 hover:border-paper/40 active:scale-95 transition-all duration-150">
          COMPARTIR
        </button>
        <button onClick={onReset} className="w-full font-sans text-[11px] tracking-[0.4em] uppercase text-paper/40 py-3 hover:text-paper/60 active:scale-95 transition-all duration-150">
          NUEVA VISITA
        </button>
      </div>
    </div>
  );
}
