"use client";
import { useEffect } from "react";
import type { KioskState } from "@/lib/types";
import { FLAVORS, FLAVOR_EMOJI } from "@/lib/flavors";
import { FLAVOR_HEX } from "@/lib/colors";
import { getKiosko, getStamps } from "@/lib/storage";

const STAMP_GOAL = 5;

interface Props {
  state: KioskState;
  duo?: boolean;
  onReset: () => void;
}

export default function TicketScreen({ state, duo, onReset }: Props) {
  const key    = duo ? state.dRKey : state.rKey;
  const f      = FLAVORS[key];
  const hex    = FLAVOR_HEX[key];
  const emoji  = FLAVOR_EMOJI[key];
  const now    = new Date();
  const date   = now.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });
  const time   = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

  const name1  = duo ? state.dN1 : state.cName;
  const name2  = duo ? state.dN2 : undefined;
  const modeLabel = duo ? "DÚO" : state.testMode === "p" ? "PERSONALIDAD" : "ESTADO";

  // Stamp info
  const stamps    = getStamps();
  const stampsNow = stamps % STAMP_GOAL;
  const hasReward = stamps > 0 && stampsNow === 0;

  // Auto-print when kiosk config requests it
  useEffect(() => {
    if (getKiosko().autoPrint) {
      const t = setTimeout(() => window.print(), 700);
      return () => clearTimeout(t);
    }
  }, []);

  function handleCopy() {
    const text = duo
      ? `🍦 NIV'POP\n\n${emoji} ${f.name}\nSabor compartido de ${name1} & ${name2}\nCompatibilidad: ${state.lastCompat}%\n\nFolio: ${state.folio}\n${date}`
      : `🍦 NIV'POP\n\n${emoji} ${f.name} — ${f.persona}\n${name1}\n\nFolio: ${state.folio}\n${date}`;
    navigator.clipboard?.writeText(text).catch(() => {});
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16">
      {/* Ticket */}
      <div id="print-ticket" className="w-full max-w-xs border border-paper/20 bg-paper/[0.03]">
        <div className="h-1" style={{ backgroundColor: hex }} />

        <div className="px-7 py-8 text-center">
          <p className="font-sans text-[9px] tracking-[0.6em] text-muted/60 uppercase mb-6">NIV&apos;POP · HELADOS ARTESANALES</p>

          <div className="text-5xl mb-4">{emoji}</div>
          <h2 className="font-display text-3xl font-light mb-1" style={{ color: hex }}>
            {f.name}
          </h2>
          {!duo && <p className="font-display text-base italic text-paper/50 mb-4">{f.persona}</p>}

          {duo && (
            <p className="font-sans text-sm text-paper/60 mb-4">
              {name1} & {name2}
              {state.lastCompat > 0 && (
                <span className="block font-display text-2xl mt-1" style={{ color: hex }}>
                  {state.lastCompat}% compatibles
                </span>
              )}
            </p>
          )}

          {!duo && name1 && (
            <p className="font-sans text-base text-paper/80 mb-4">{name1}</p>
          )}

          <div className="border-t border-dashed border-paper/15 my-5" />

          <p className="font-sans text-[9px] tracking-[0.3em] text-muted/50 uppercase mb-1">{modeLabel}</p>
          <p className="font-sans text-xs text-muted/50">{date} · {time}</p>

          {state.folio && (
            <>
              <div className="border-t border-dashed border-paper/15 my-5" />
              <p className="font-sans text-[9px] tracking-[0.4em] text-muted/40 uppercase mb-1">FOLIO</p>
              <p className="font-sans text-base text-paper/60 tracking-widest">{state.folio}</p>
            </>
          )}

          {/* Stamp progress */}
          {stamps > 0 && (
            <>
              <div className="border-t border-dashed border-paper/15 my-5" />
              {hasReward ? (
                <div>
                  <p className="font-sans text-[9px] tracking-[0.4em] text-muted/40 uppercase mb-2">¡PREMIO!</p>
                  <p className="font-display text-lg" style={{ color: hex }}>10% de descuento</p>
                  <p className="font-sans text-[10px] text-muted/40 mt-1">Muestra este ticket al cajero</p>
                </div>
              ) : (
                <div>
                  <p className="font-sans text-[9px] tracking-[0.4em] text-muted/40 uppercase mb-2">
                    SELLOS {stampsNow}/{STAMP_GOAL}
                  </p>
                  <div className="flex justify-center gap-1.5">
                    {Array.from({ length: STAMP_GOAL }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full border ${
                          i < stampsNow ? "border-paper/60 bg-paper/60" : "border-paper/20"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="font-sans text-[9px] text-muted/35 mt-1.5">
                    {STAMP_GOAL - stampsNow} más para un regalo
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="h-0.5 bg-paper/10 mx-7" />
        <div className="px-7 py-4 text-center">
          <p className="font-sans text-[9px] text-muted/30 tracking-wide">Gracias por tu visita 🍦</p>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full max-w-xs mt-8 space-y-3 no-print">
        <button
          onClick={() => window.print()}
          className="w-full font-sans text-[11px] tracking-[0.4em] uppercase text-ink bg-paper py-4 hover:bg-paper/90 active:scale-95 transition-all duration-150"
        >
          IMPRIMIR
        </button>
        <button
          onClick={handleCopy}
          className="w-full font-sans text-[11px] tracking-[0.4em] uppercase text-paper/70 border border-paper/20 py-4 hover:border-paper/40 active:scale-95 transition-all duration-150"
        >
          COPIAR TEXTO
        </button>
        <button
          onClick={onReset}
          className="w-full font-sans text-[11px] tracking-[0.4em] uppercase text-paper/40 py-3 hover:text-paper/60 active:scale-95 transition-all duration-150"
        >
          NUEVA VISITA
        </button>
      </div>
    </div>
  );
}
