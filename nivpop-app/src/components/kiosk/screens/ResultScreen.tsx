"use client";
import { useState } from "react";
import type { KioskState } from "@/lib/types";
import { FLAVORS, FLAVOR_EMOJI, AL_META } from "@/lib/flavors";
import { FLAVOR_HEX } from "@/lib/colors";
import { calcTopFlavors } from "@/lib/quiz";

const EMAIL_SVC  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  ?? "";
const EMAIL_TPL  = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
const EMAIL_KEY  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  ?? "";
const emailReady = !!(EMAIL_SVC && EMAIL_TPL && EMAIL_KEY);

interface Props {
  state: KioskState;
  onTicket: () => void;
  onShare: () => void;
  onReset: () => void;
}

export default function ResultScreen({ state, onTicket, onShare, onReset }: Props) {
  const [emailInput, setEmailInput] = useState("");
  const [emailSent,  setEmailSent]  = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [showEmail, setShowEmail]   = useState(false);

  const f = FLAVORS[state.rKey];
  const hex = FLAVOR_HEX[state.rKey];
  const emoji = FLAVOR_EMOJI[state.rKey];
  const activeAllergens = AL_META.filter((a) => f.allergens[a.key]);

  // Runners-up (2nd and 3rd flavor)
  const topFlavors  = calcTopFlavors(state.scores, 3);
  const runners     = topFlavors.slice(1).filter((id) => id !== state.rKey);

  // "¿Cambié?" comparison
  const prevId    = state.prevFlavorId;
  const prevF     = prevId ? FLAVORS[prevId] : null;
  const prevHex   = prevId ? FLAVOR_HEX[prevId] : null;
  const changed   = prevId && prevId !== state.rKey;

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!emailReady || !emailInput.trim()) return;
    setEmailSending(true);
    try {
      const { default: emailjs } = await import("@emailjs/browser");
      await emailjs.send(EMAIL_SVC, EMAIL_TPL, {
        to_email:      emailInput.trim(),
        customer_name: state.cName || "Visitante",
        flavor_name:   f.name,
        persona:       f.persona,
        insight:       f.ins.hl,
        description:   f.desc,
        folio:         state.folio,
        date:          new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" }),
      }, EMAIL_KEY);
      setEmailSent(true);
    } catch { /* EmailJS unavailable */ } finally {
      setEmailSending(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen overflow-y-auto">
      {/* Header band */}
      <div className="flex-shrink-0 px-7 pt-14 pb-10" style={{ borderBottom: `1px solid ${hex}40` }}>
        <p className="font-sans text-[9px] tracking-[0.5em] text-muted/60 uppercase mb-6">
          {state.cName ? `${state.cName} —` : ""} {state.testMode === "p" ? "PERSONALIDAD" : "ESTADO"}
          {state.quickMode && <span className="ml-2 text-muted/40">· RÁPIDO</span>}
        </p>
        <div className="text-6xl mb-5">{emoji}</div>
        <h1 className="font-display text-5xl font-light text-paper leading-tight mb-1" style={{ color: hex }}>
          {f.name}
        </h1>
        <p className="font-display text-2xl italic text-paper/60">{f.persona}</p>
      </div>

      <div className="flex-1 px-7 py-8 space-y-10 pb-20">

        {/* "¿Cambié?" comparison */}
        {changed && prevF && prevHex && (
          <div className="border border-paper/12 px-5 py-4 flex items-center gap-4">
            <div className="text-center flex-shrink-0">
              <p className="text-2xl">{FLAVOR_EMOJI[prevId!]}</p>
              <p className="font-display text-sm mt-1" style={{ color: prevHex }}>{prevF.name}</p>
              <p className="font-sans text-[9px] text-muted/40 uppercase tracking-widest mt-0.5">Antes</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-muted/40 text-lg">→</p>
            </div>
            <div className="text-center flex-shrink-0">
              <p className="text-2xl">{emoji}</p>
              <p className="font-display text-sm mt-1" style={{ color: hex }}>{f.name}</p>
              <p className="font-sans text-[9px] text-muted/40 uppercase tracking-widest mt-0.5">Hoy</p>
            </div>
          </div>
        )}

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
                <p className="font-sans text-sm text-paper/75 leading-relaxed" dangerouslySetInnerHTML={{ __html: t.t }} />
              </li>
            ))}
          </ul>
        </div>

        {/* Runners-up */}
        {runners.length > 0 && (
          <div>
            <p className="font-sans text-[9px] tracking-[0.4em] text-muted/60 uppercase mb-3">TAMBIÉN PODRÍAS SER…</p>
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
            <p className="font-sans text-[9px] tracking-[0.4em] text-muted/60 uppercase mb-3">MARIDA CON</p>
            <div className="flex gap-3 flex-wrap">
              {f.maridaje.map((m) => (
                <span key={m} className="font-sans text-xs border border-paper/20 text-paper/70 px-3 py-1.5">{m}</span>
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
                <span key={a.key} className="font-sans text-[10px] bg-paper/8 border border-paper/15 text-paper/70 px-2.5 py-1">{a.label}</span>
              ))}
            </div>
          </div>
        )}

        {/* Email */}
        {emailReady && (
          <div>
            {!showEmail ? (
              <button
                onClick={() => setShowEmail(true)}
                className="font-sans text-[10px] tracking-[0.3em] uppercase text-muted/50 hover:text-muted/80 transition-colors"
              >
                ✉ Enviar a mi correo
              </button>
            ) : emailSent ? (
              <p className="font-sans text-sm text-paper/60">✓ Resultado enviado a {emailInput}</p>
            ) : (
              <form onSubmit={handleSendEmail} className="flex gap-3">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="tu@correo.com"
                  required
                  className="flex-1 bg-paper/5 border border-paper/20 px-4 py-2.5 font-sans text-sm text-paper placeholder:text-muted/35 focus:outline-none focus:border-paper/45 transition-colors"
                />
                <button
                  type="submit"
                  disabled={emailSending}
                  className="font-sans text-[10px] tracking-widest uppercase bg-paper text-ink px-5 py-2.5 hover:bg-paper/90 disabled:opacity-50 transition-all"
                >
                  {emailSending ? "…" : "ENVIAR"}
                </button>
              </form>
            )}
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
