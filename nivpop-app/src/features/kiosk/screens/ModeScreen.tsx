"use client";

interface Props {
  onSolo: (mode: "p" | "t") => void;
  onDuo: () => void;
  onQuick: () => void;
  onBack: () => void;
}

export default function ModeScreen({ onSolo, onDuo, onQuick, onBack }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16">
      <h2 className="font-display text-4xl text-paper italic mb-14 text-center">
        ¿Cómo quieres descubrirte hoy?
      </h2>

      <div className="w-full max-w-md space-y-4">
        <button
          onClick={() => onSolo("p")}
          className="w-full text-left border border-paper/15 bg-paper/[0.04] hover:bg-paper/10 active:scale-[0.98] transition-all duration-150 px-7 py-6 group"
        >
          <span className="text-2xl mb-2 block">✨</span>
          <p className="font-sans text-base font-medium text-paper mb-1">Solo — Personalidad</p>
          <p className="font-sans text-xs text-muted leading-relaxed">Descubre tu sabor único basado en quién eres</p>
        </button>

        <button
          onClick={() => onSolo("t")}
          className="w-full text-left border border-paper/15 bg-paper/[0.04] hover:bg-paper/10 active:scale-[0.98] transition-all duration-150 px-7 py-6"
        >
          <span className="text-2xl mb-2 block">🌊</span>
          <p className="font-sans text-base font-medium text-paper mb-1">Solo — Estado de ánimo</p>
          <p className="font-sans text-xs text-muted leading-relaxed">¿Cómo te sientes hoy?</p>
        </button>

        <button
          onClick={onDuo}
          className="w-full text-left border border-paper/15 bg-paper/[0.04] hover:bg-paper/10 active:scale-[0.98] transition-all duration-150 px-7 py-6"
        >
          <span className="text-2xl mb-2 block">💞</span>
          <p className="font-sans text-base font-medium text-paper mb-1">Dúo</p>
          <p className="font-sans text-xs text-muted leading-relaxed">¿Cuál es el sabor compartido de los dos?</p>
        </button>

        <button
          onClick={onQuick}
          className="w-full text-left border border-paper/10 bg-transparent hover:bg-paper/5 active:scale-[0.98] transition-all duration-150 px-7 py-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans text-sm text-paper/70 mb-0.5">⚡ Quiz rápido</p>
              <p className="font-sans text-xs text-muted/55">5 preguntas · mismo resultado</p>
            </div>
            <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-muted/40 border border-paper/15 px-2 py-1">RÁPIDO</span>
          </div>
        </button>
      </div>

      <button onClick={onBack} className="mt-12 font-sans text-xs text-muted/60 tracking-widest uppercase hover:text-muted transition-colors">
        ← Atrás
      </button>
    </div>
  );
}
