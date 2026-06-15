"use client";
import { useState } from "react";
import { findByFolio, findByName } from "@/services/storage";
import { FLAVORS, FLAVOR_EMOJI } from "@/utils/flavors";
import { FLAVOR_HEX } from "@/utils/colors";
import type { NivResult } from "@/types";

interface Props {
  onBack: () => void;
  initialQuery?: string;
}

export default function FolioScreen({ onBack, initialQuery = "" }: Props) {
  const [query,    setQuery]    = useState(initialQuery);
  const [results,  setResults]  = useState<NivResult[]>(() => {
    if (!initialQuery) return [];
    const byFolio = findByFolio(initialQuery);
    return byFolio ? [byFolio] : findByName(initialQuery).slice(0, 8);
  });
  const [searched, setSearched] = useState(!!initialQuery);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    const byFolio = findByFolio(q);
    if (byFolio) {
      setResults([byFolio]);
    } else {
      setResults(findByName(q).slice(0, 8));
    }
    setSearched(true);
  }

  // Group results by name for timeline view
  const grouped: Record<string, NivResult[]> = {};
  results.forEach((r) => {
    const key = r.nombre1 + (r.nombre2 ? `&${r.nombre2}` : "");
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(r);
  });
  const groupEntries = Object.entries(grouped);

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
        Ingresa tu folio (ej. NP-240615-0042) o tu nombre.
      </p>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Folio o nombre..."
          autoFocus={!initialQuery}
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
        <p className="font-sans text-sm text-muted/45">No se encontraron resultados. Verifica el folio o nombre.</p>
      )}

      <div className="space-y-8">
        {groupEntries.map(([groupKey, groupResults]) => {
          const isMultiple = groupResults.length > 1;
          const allSame    = groupResults.every((r) => r.flavorId === groupResults[0].flavorId);

          return (
            <div key={groupKey}>
              {isMultiple && (
                <div className="flex items-center gap-3 mb-4">
                  <p className="font-sans text-[9px] tracking-[0.4em] text-muted/50 uppercase">
                    {groupResults[0].nombre1}{groupResults[0].nombre2 ? ` & ${groupResults[0].nombre2}` : ""}
                  </p>
                  {allSame && (
                    <span className="font-sans text-[9px] text-muted/35 border border-paper/10 px-2 py-0.5">Consistente ✓</span>
                  )}
                </div>
              )}

              {/* Timeline */}
              <div className="relative">
                {isMultiple && (
                  <div className="absolute left-[15px] top-0 bottom-0 w-px bg-paper/10" />
                )}
                <div className="space-y-4">
                  {groupResults.map((r, idx) => {
                    const hex   = FLAVOR_HEX[r.flavorId];
                    const emoji = FLAVOR_EMOJI[r.flavorId];
                    const rf    = FLAVORS[r.flavorId];
                    const isLast = idx === 0 && isMultiple;

                    return (
                      <div key={r.id} className={`flex gap-4 ${isMultiple ? "pl-8" : ""}`}>
                        {isMultiple && (
                          <div
                            className="absolute left-[10px] w-[11px] h-[11px] rounded-full border-2 border-ink"
                            style={{ backgroundColor: hex, marginTop: "18px" }}
                          />
                        )}
                        <div
                          className="flex-1 border border-paper/15 p-5"
                          style={{ borderLeft: isLast ? `3px solid ${hex}` : `3px solid ${hex}40` }}
                        >
                          <div className="flex items-start gap-4">
                            <div className="text-3xl flex-shrink-0">{emoji}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline justify-between gap-2 flex-wrap">
                                <h3 className="font-display text-xl font-light" style={{ color: hex }}>{rf.name}</h3>
                                {isLast && <span className="font-sans text-[9px] text-muted/40 uppercase tracking-widest border border-paper/10 px-2 py-0.5">Último</span>}
                              </div>
                              <p className="font-display text-xs italic text-paper/40 mb-2">{rf.persona}</p>
                              {!isMultiple && (
                                <p className="font-sans text-sm text-paper/70 mb-1">{r.nombre1}{r.nombre2 ? ` & ${r.nombre2}` : ""}</p>
                              )}
                              {r.compat != null && (
                                <p className="font-sans text-sm mb-1" style={{ color: hex }}>{r.compat}% compatibles</p>
                              )}
                              <p className="font-sans text-xs text-muted/40">{r.fecha} · {r.timeStr}</p>
                              {r.folio && (
                                <p className="font-sans text-[10px] tracking-widest text-muted/25 mt-1">FOLIO: {r.folio}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
