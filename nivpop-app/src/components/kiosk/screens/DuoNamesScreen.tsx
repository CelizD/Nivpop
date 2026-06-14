"use client";
import { useState } from "react";
import type { VinculoId } from "@/lib/types";
import { VINCULOS } from "@/lib/flavors";

const VINCULOS_IDS = Object.keys(VINCULOS) as VinculoId[];

interface Props {
  onSubmit: (n1: string, n2: string, vin: VinculoId) => void;
  onBack: () => void;
}

export default function DuoNamesScreen({ onSubmit, onBack }: Props) {
  const [n1, setN1] = useState("");
  const [n2, setN2] = useState("");
  const [vin, setVin] = useState<VinculoId>("pareja");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (n1.trim() && n2.trim()) onSubmit(n1.trim(), n2.trim(), vin);
  }

  const canSubmit = n1.trim().length > 0 && n2.trim().length > 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 py-16">
      <p className="font-sans text-[10px] tracking-[0.4em] text-muted/60 uppercase mb-8">TEST DÚO</p>
      <h2 className="font-display text-4xl italic text-paper mb-2 text-center">¿Quiénes son los dos?</h2>
      <p className="font-sans text-sm text-muted mb-12 text-center">Para descubrir su sabor compartido</p>

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-6">
        <div>
          <label className="font-sans text-[9px] tracking-[0.35em] text-muted/70 uppercase block mb-2">Persona 1</label>
          <input
            autoFocus
            type="text"
            value={n1}
            onChange={(e) => setN1(e.target.value)}
            maxLength={24}
            placeholder="Nombre..."
            className="w-full bg-transparent border-b border-paper/30 focus:border-paper/70 text-paper font-sans text-xl py-2 outline-none placeholder:text-muted/30 transition-colors"
          />
        </div>
        <div>
          <label className="font-sans text-[9px] tracking-[0.35em] text-muted/70 uppercase block mb-2">Persona 2</label>
          <input
            type="text"
            value={n2}
            onChange={(e) => setN2(e.target.value)}
            maxLength={24}
            placeholder="Nombre..."
            className="w-full bg-transparent border-b border-paper/30 focus:border-paper/70 text-paper font-sans text-xl py-2 outline-none placeholder:text-muted/30 transition-colors"
          />
        </div>

        <div className="pt-2">
          <label className="font-sans text-[9px] tracking-[0.35em] text-muted/70 uppercase block mb-3">Vínculo</label>
          <div className="grid grid-cols-3 gap-2">
            {VINCULOS_IDS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVin(v)}
                className={`border py-2 px-1 text-center transition-all duration-150 active:scale-95 ${
                  vin === v
                    ? "border-paper/60 bg-paper/10 text-paper"
                    : "border-paper/15 text-muted hover:border-paper/30"
                }`}
              >
                <span className="text-lg block mb-0.5">{VINCULOS[v].icon}</span>
                <span className="font-sans text-[9px] tracking-wide">{VINCULOS[v].label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full font-sans text-[11px] tracking-[0.4em] uppercase text-ink bg-paper py-5 hover:bg-paper/90 active:scale-95 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed mt-4"
        >
          COMENZAR TEST
        </button>
      </form>

      <button onClick={onBack} className="mt-10 font-sans text-xs text-muted/60 tracking-widest uppercase hover:text-muted transition-colors">
        ← Atrás
      </button>
    </div>
  );
}
