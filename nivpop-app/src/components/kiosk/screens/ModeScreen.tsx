"use client";

const MODES = [
  { key: "p" as const, emoji: "✨", title: "Solo — Personalidad", sub: "Descubre tu sabor único basado en quién eres" },
  { key: "t" as const, emoji: "🌊", title: "Solo — Estado de ánimo", sub: "¿Cómo te sientes hoy?" },
];

interface Props {
  onSolo: (mode: "p" | "t") => void;
  onDuo: () => void;
  onBack: () => void;
}

export default function ModeScreen({ onSolo, onDuo, onBack }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16">
      <h2 className="font-display text-4xl text-paper italic mb-14 text-center">
        ¿Cómo quieres descubrirte hoy?
      </h2>

      <div className="w-full max-w-md space-y-4">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => onSolo(m.key)}
            className="w-full text-left border border-paper/15 bg-paper/[0.04] hover:bg-paper/10 active:scale-[0.98] transition-all duration-150 px-7 py-6 group"
          >
            <span className="text-2xl mb-2 block">{m.emoji}</span>
            <p className="font-sans text-base font-medium text-paper mb-1">{m.title}</p>
            <p className="font-sans text-xs text-muted leading-relaxed">{m.sub}</p>
          </button>
        ))}

        <button
          onClick={onDuo}
          className="w-full text-left border border-paper/15 bg-paper/[0.04] hover:bg-paper/10 active:scale-[0.98] transition-all duration-150 px-7 py-6"
        >
          <span className="text-2xl mb-2 block">💞</span>
          <p className="font-sans text-base font-medium text-paper mb-1">Dúo</p>
          <p className="font-sans text-xs text-muted leading-relaxed">¿Cuál es el sabor compartido de los dos?</p>
        </button>
      </div>

      <button onClick={onBack} className="mt-12 font-sans text-xs text-muted/60 tracking-widest uppercase hover:text-muted transition-colors">
        ← Atrás
      </button>
    </div>
  );
}
