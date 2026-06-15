"use client";
import { useEffect, useState } from "react";
import type { FlavorId } from "@/lib/types";
import { FLAVORS, FLAVOR_EMOJI } from "@/lib/flavors";
import { FLAVOR_HEX } from "@/lib/colors";
import Confetti from "@/components/Confetti";

interface Props {
  flavorId: FlavorId;
  duo?: boolean;
  onNext: () => void;
}

export default function RevealScreen({ flavorId, duo, onNext }: Props) {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const f     = FLAVORS[flavorId];
  const hex   = FLAVOR_HEX[flavorId];
  const emoji = FLAVOR_EMOJI[flavorId];

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => onNext(), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onNext]);

  return (
    <>
      <Confetti active={phase === 2} />

      <div
        className="flex flex-col items-center justify-center min-h-screen cursor-pointer select-none transition-colors duration-1000"
        style={{ backgroundColor: phase === 2 ? `${hex}14` : "transparent" }}
        onClick={onNext}
      >
        <p className="font-sans text-[9px] tracking-[0.6em] text-muted/40 uppercase mb-14">
          {duo ? "SABOR COMPARTIDO" : "TU SABOR"}
        </p>

        {/* Emoji */}
        <div
          className="mb-8 transition-all duration-700"
          style={{
            fontSize: "6rem",
            lineHeight: 1,
            opacity:   phase >= 1 ? 1 : 0,
            transform: phase === 2 ? "scale(1)" : phase === 1 ? "scale(1.25)" : "scale(0.4)",
            filter:    phase === 2 ? "none" : "blur(6px)",
          }}
        >
          {emoji}
        </div>

        {/* Flavor name */}
        <div
          className="text-center transition-all duration-500"
          style={{
            opacity:          phase === 2 ? 1 : 0,
            transform:        phase === 2 ? "translateY(0)" : "translateY(18px)",
            transitionDelay:  "0.1s",
          }}
        >
          <h1 className="font-display text-5xl font-light" style={{ color: hex }}>{f.name}</h1>
          {!duo && <p className="font-display text-xl italic text-paper/45 mt-2">{f.persona}</p>}
        </div>

        <p
          className="absolute bottom-12 font-sans text-[9px] tracking-[0.4em] text-muted/30 uppercase transition-opacity duration-500"
          style={{ opacity: phase === 2 ? 1 : 0, transitionDelay: "0.6s" }}
        >
          Toca para continuar
        </p>
      </div>
    </>
  );
}
