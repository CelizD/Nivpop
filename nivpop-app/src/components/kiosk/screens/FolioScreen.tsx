"use client";
import { useState } from "react";
import { findByFolio, findByName } from "@/lib/storage";
import { FLAVORS, FLAVOR_EMOJI } from "@/lib/flavors";
import { FLAVOR_HEX } from "@/lib/colors";
import type { NivResult } from "@/lib/types";

interface Props {
  onBack: () => void;
}

export default function FolioScreen({ onBack }: Props) {
  const [query,    setQuery]    = useState("");
  const [results,  setResults]  = useState<NivResult[]>([]);
  const [searched, setSearched] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    // Try folio first (uppercase), then name search
    const byFolio = findByFolio(q);
    if (byFolio) {
      setResults([byFolio]);
    } else {
      setResults(findByName(q).slice(0, 5));
    }
    setSearched(true);
  }

  return (
    <div className="flex flex-col min-h-screen px-7 py-14">
      <button
        onClick={onBack}
        className="font-sans text-xs text-muted/50 tracking-widest uppercase mb-10 self-start hover:text-muted/70 transition-colors"
      >
        ← Atrás
      </button>

      <h2 className="font-display text-4xl italic text-paper mb-1">Busca tu resultado</h2>
      <p className="font-sans text-sm text-muted/50 mb-10">
        Ingresa tu folio (ej. NVP-20240614-A3F) o tu nombre.
      </p>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Folio o nombre..."
          autoFocus
          className="flex-1 bg-paper/5 border border-paper/20 px-4 py-3 font-sans text-sm text-paper placeholder:text-muted/35 focus:outline-none focus:border-paper/45 transition-colors"
        />
        <button
          type="submit"
          className="font-sans text-[11px] tracking-widest uppercase bg-paper text-ink px-5 py-3 hover:bg-paper/90 active:scale-95 transition-all"
        >
          BUSCAR
        </button>
      </form>

      {searched && results.length === 0 && (
        <p className="font-sans text-sm text-muted/45">
          No se encontraron resultados. Verifica el folio o nombre.
        </p>
      )}

      <div className="space-y-4">
        {results.map((r) => {
          const hex   = FLAVOR_HEX[r.flavorId];
          const emoji = FLAVOR_EMOJI[r.flavorId];
          const f     = FLAVORS[r.flavorId];
          return (
            <div
              key={r.id}
              className="border border-paper/15 p-6 text-center"
              style={{ borderTop: `2px solid ${hex}` }}
            >
              <div className="text-4xl mb-3">{emoji}</div>
              <h3 className="font-display text-2xl font-light mb-0.5" style={{ color: hex }}>{f.name}</h3>
              {r.modo !== "duo" && (
                <p className="font-display text-sm italic text-paper/45 mb-3">{f.persona}</p>
              )}
              <p className="font-sans text-sm text-paper/70 mb-1">{r.nombre1}{r.nombre2 ? ` & ${r.nombre2}` : ""}</p>
              {r.compat != null && (
                <p className="font-sans text-sm mb-1" style={{ color: hex }}>{r.compat}% compatibles</p>
              )}
              <p className="font-sans text-xs text-muted/40">{r.fecha} · {r.timeStr}</p>
              {r.folio && (
                <p className="font-sans text-[10px] tracking-widest text-muted/30 mt-2">FOLIO: {r.folio}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
