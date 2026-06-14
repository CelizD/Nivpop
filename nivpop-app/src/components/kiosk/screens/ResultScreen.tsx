"use client";
import type { KioskState } from "@/lib/types";
import { FLAVORS, FLAVOR_EMOJI, AL_META } from "@/lib/flavors";
import { FLAVOR_HEX } from "@/lib/colors";

interface Props {
  state: KioskState;
  onTicket: () => void;
  onReset: () => void;
}

export default function ResultScreen({ state, onTicket, onReset }: Props) {
  const f = FLAVORS[state.rKey];
  const hex = FLAVOR_HEX[state.rKey];
  const emoji = FLAVOR_EMOJI[state.rKey];
  const activeAllergens = AL_META.filter((a) => f.allergens[a.key]);

  return (
    <div className="flex flex-col min-h-screen overflow-y-auto">
      {/* Header band */}
      <div className="flex-shrink-0 px-7 pt-14 pb-10" style={{ borderBottom: `1px solid ${hex}40` }}>
        <p className="font-sans text-[9px] tracking-[0.5em] text-muted/60 uppercase mb-6">
          {state.cName ? `${state.cName} —` : ""} {state.testMode === "p" ? "PERSONALIDAD" : "ESTADO"}
        </p>
        <div className="text-6xl mb-5">{emoji}</div>
        <h1 className="font-display text-5xl font-light text-paper leading-tight mb-1" style={{ color: hex }}>
          {f.name}
        </h1>
        <p className="font-display text-2xl italic text-paper/60">{f.persona}</p>
      </div>

      <div className="flex-1 px-7 py-8 space-y-10 pb-20">
        {/* Description */}
        <p className="font-sans text-sm text-paper/80 leading-relaxed">{f.desc}</p>

        {/* Insight */}
        <div className="border-l-2 pl-5" style={{ borderColor: hex }}>
          <p className="font-sans text-[9px] tracking-[0.4em] text-muted/60 uppercase mb-2">{f.ins.tag}</p>
          <p className="font-sans text-sm text-paper/75 leading-relaxed mb-3">{f.ins.text}</p>
          <p className="font-display text-lg italic" style={{ color: hex }}>&ldquo;{f.ins.hl}&rdquo;</p>
        </div>

        {/* Traits */}
        <div>
          <p className="font-sans text-[9px] tracking-[0.4em] text-muted/60 uppercase mb-4">TUS RASGOS</p>
          <div className="grid grid-cols-2 gap-3">
            {f.traits.map((t) => (
              <div key={t.l} className="border border-paper/10 px-4 py-3">
                <p className="font-sans text-[8px] tracking-widest text-muted/60 uppercase mb-1">{t.l}</p>
                <p className="font-sans text-sm text-paper/90">{t.v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Psychology */}
        <div className="bg-paper/[0.03] border border-paper/8 px-5 py-4">
          <p className="font-sans text-[9px] tracking-[0.4em] text-muted/60 uppercase mb-2">PSICOLOGÍA</p>
          <p className="font-sans text-xs text-muted leading-relaxed">{f.psych}</p>
        </div>

        {/* Tips */}
        <div>
          <p className="font-sans text-[9px] tracking-[0.4em] text-muted/60 uppercase mb-4">PARA TI</p>
          <ul className="space-y-3">
            {f.tips.map((t, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-sans text-xs mt-0.5" style={{ color: hex }}>→</span>
                <p
                  className="font-sans text-sm text-paper/75 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t.t }}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Maridaje */}
        {f.maridaje?.length > 0 && (
          <div>
            <p className="font-sans text-[9px] tracking-[0.4em] text-muted/60 uppercase mb-3">MARIDA CON</p>
            <div className="flex gap-3 flex-wrap">
              {f.maridaje.map((m) => (
                <span key={m} className="font-sans text-xs border border-paper/20 text-paper/70 px-3 py-1.5">
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Base */}
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-paper/10 px-4 py-3">
            <p className="font-sans text-[8px] tracking-widest text-muted/60 uppercase mb-1">BASE REC.</p>
            <p className="font-sans text-xs text-paper/80 mb-1">{f.base.rec}</p>
            <p className="font-sans text-[10px] text-muted/60">{f.base.recD}</p>
          </div>
          <div className="border border-paper/10 px-4 py-3">
            <p className="font-sans text-[8px] tracking-widest text-muted/60 uppercase mb-1">ALTERNATIVA</p>
            <p className="font-sans text-xs text-paper/80 mb-1">{f.base.alt}</p>
            <p className="font-sans text-[10px] text-muted/60">{f.base.altD}</p>
          </div>
        </div>

        {/* Allergens */}
        {activeAllergens.length > 0 && (
          <div>
            <p className="font-sans text-[9px] tracking-[0.4em] text-muted/60 uppercase mb-3">ALÉRGENOS</p>
            <div className="flex gap-2 flex-wrap">
              {activeAllergens.map((a) => (
                <span key={a.key} className="font-sans text-[10px] bg-paper/8 border border-paper/15 text-paper/70 px-2.5 py-1">
                  {a.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTAs */}
      <div className="sticky bottom-0 bg-ink px-7 py-5 border-t border-paper/10 space-y-3">
        <button
          onClick={onTicket}
          className="w-full font-sans text-[11px] tracking-[0.4em] uppercase text-ink bg-paper py-4 hover:bg-paper/90 active:scale-95 transition-all duration-150"
        >
          OBTENER TICKET
        </button>
        <button
          onClick={onReset}
          className="w-full font-sans text-[11px] tracking-[0.4em] uppercase text-paper/50 border border-paper/15 py-4 hover:border-paper/30 hover:text-paper/70 active:scale-95 transition-all duration-150"
        >
          NUEVA VISITA
        </button>
      </div>
    </div>
  );
}
