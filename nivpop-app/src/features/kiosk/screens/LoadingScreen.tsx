"use client";
import { useEffect } from "react";
import type { FlavorId } from "@/types";
import { FLAVOR_EMOJI } from "@/utils/flavors";
import { FLAVOR_HEX } from "@/utils/colors";

interface Props {
  flavorId: FlavorId;
  duo?: boolean;
  onFinish: () => void;
}

export default function LoadingScreen({ flavorId, duo, onFinish }: Props) {
  useEffect(() => {
    const t = setTimeout(onFinish, 2200);
    return () => clearTimeout(t);
  }, [onFinish]);

  const hex = FLAVOR_HEX[flavorId];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-8">
      <div
        className="text-8xl mb-10 animate-pulse-slow"
        style={{ filter: `drop-shadow(0 0 24px ${hex}80)` }}
      >
        {duo ? "💞" : FLAVOR_EMOJI[flavorId]}
      </div>

      <p className="font-display text-2xl italic text-paper/60 mb-3">
        {duo ? "Calculando compatibilidad…" : "Encontrando tu sabor…"}
      </p>

      <div className="flex gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-1.5 h-1.5 rounded-full bg-paper/30 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
