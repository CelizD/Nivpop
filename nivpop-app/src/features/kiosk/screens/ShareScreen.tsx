"use client";
import { useState } from "react";
import type { KioskState } from "@/types";
import { FLAVORS, FLAVOR_EMOJI } from "@/utils/flavors";
import { FLAVOR_HEX } from "@/utils/colors";
import { generateShareCard } from "@/services/shareCard";

interface Props {
  state: KioskState;
  onBack: () => void;
  onReset: () => void;
}

export default function ShareScreen({ state, onBack, onReset }: Props) {
  const [copied,     setCopied]     = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const duo   = state.shareMode === "duo";
  const key   = duo ? state.dRKey : state.rKey;
  const f     = FLAVORS[key];
  const hex   = FLAVOR_HEX[key];
  const emoji = FLAVOR_EMOJI[key];

  const shareText = duo
    ? `\u{1F49E} Nuestro sabor compartido en NIV'POP\n\n${emoji} ${f.name}\n${state.dN1} & ${state.dN2}\nCompatibilidad: ${state.lastCompat}%\n\n"${f.ins.hl}"\n\n#NivPop #SaborCompartido`
    : `\u{1F366} Mi perfil de nieve en NIV'POP\n\n${emoji} ${f.name} — ${f.persona}${state.cName ? `\n${state.cName}` : ""}\n\n"${f.ins.hl}"\n\n#NivPop`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* unavailable */ }
  }

  // Share image as a file (modern Web Share API)
  async function handleShareImage() {
    setImgLoading(true);
    try {
      const dataUrl = generateShareCard({
        flavorId: key,
        name:   !duo ? (state.cName || undefined) : undefined,
        duo,
        n1:     duo ? state.dN1 : undefined,
        n2:     duo ? state.dN2 : undefined,
        compat: duo ? state.lastCompat : undefined,
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `nivpop-${key}.png`, { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `NIV'POP — ${f.name}`,
          text:  shareText,
        });
      } else {
        // Fallback: download
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `nivpop-${key}.png`;
        a.click();
      }
    } catch { /* cancelled or unavailable */ } finally {
      setImgLoading(false);
    }
  }

  async function handleShareNative() {
    try { await navigator.share({ text: shareText, title: `NIV'POP — ${f.name}` }); }
    catch { /* cancelled */ }
  }

  const waUrl    = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const canShare = typeof navigator !== "undefined" && "share" in navigator;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-7 py-16">
      {/* Preview card */}
      <div
        className="w-full max-w-xs bg-paper/[0.03] border border-paper/15 p-7 text-center mb-10"
        style={{ borderTop: `3px solid ${hex}` }}
      >
        <div className="text-5xl mb-4">{emoji}</div>
        <h2 className="font-display text-3xl mb-1" style={{ color: hex }}>{f.name}</h2>
        {duo ? (
          <p className="font-sans text-sm text-paper/60 mb-2">{state.dN1} &amp; {state.dN2} &middot; {state.lastCompat}%</p>
        ) : (
          <>
            <p className="font-display text-base italic text-paper/50 mb-1">{f.persona}</p>
            {state.cName && <p className="font-sans text-sm text-paper/60 mb-2">{state.cName}</p>}
          </>
        )}
        <p className="font-display text-sm italic text-paper/35 mt-3 leading-snug">&ldquo;{f.ins.hl}&rdquo;</p>
      </div>

      {/* Buttons */}
      <div className="w-full max-w-xs space-y-3">
        {/* Primary: share image (includes download fallback) */}
        <button
          onClick={handleShareImage}
          disabled={imgLoading}
          className="w-full font-sans text-[11px] tracking-[0.3em] uppercase text-ink bg-paper py-4 hover:bg-paper/90 active:scale-95 transition-all disabled:opacity-50"
        >
          {imgLoading ? "GENERANDO…" : "COMPARTIR IMAGEN"}
        </button>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full font-sans text-[11px] tracking-[0.3em] uppercase text-paper bg-[#25d366]/15 border border-[#25d366]/35 py-4 hover:bg-[#25d366]/25 active:scale-95 transition-all"
        >
          📱 WHATSAPP
        </a>

        <button
          onClick={handleCopy}
          className="w-full font-sans text-[11px] tracking-[0.3em] uppercase text-paper border border-paper/20 py-4 hover:border-paper/40 active:scale-95 transition-all"
        >
          {copied ? "✓ COPIADO" : "COPIAR TEXTO"}
        </button>

        {canShare && (
          <button
            onClick={handleShareNative}
            className="w-full font-sans text-[11px] tracking-[0.3em] uppercase text-paper border border-paper/20 py-4 hover:border-paper/40 active:scale-95 transition-all"
          >
            MÁS OPCIONES
          </button>
        )}

        <div className="flex gap-3 pt-2">
          <button onClick={onBack} className="flex-1 font-sans text-[11px] tracking-[0.3em] uppercase text-paper/40 py-3 hover:text-paper/60 transition-colors">
            ← Atrás
          </button>
          <button onClick={onReset} className="flex-1 font-sans text-[11px] tracking-[0.3em] uppercase text-paper/40 border border-paper/12 py-3 hover:text-paper/60 hover:border-paper/20 transition-all">
            Nueva visita
          </button>
        </div>
      </div>
    </div>
  );
}
