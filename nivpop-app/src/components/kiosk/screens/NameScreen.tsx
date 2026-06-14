"use client";
import { useState } from "react";

interface Props {
  mode: "p" | "t";
  onSubmit: (name: string) => void;
  onBack: () => void;
}

export default function NameScreen({ mode, onSubmit, onBack }: Props) {
  const [name, setName] = useState("");
  const label = mode === "p" ? "¿Cómo te llamas?" : "¿Cuál es tu nombre de hoy?";
  const hint  = mode === "p" ? "Así aparecerá en tu resultado" : "Para personalizar tu perfil de estado";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (n) onSubmit(n);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8">
      <p className="font-sans text-[10px] tracking-[0.4em] text-muted/60 uppercase mb-8">
        {mode === "p" ? "TEST DE PERSONALIDAD" : "ESTADO DE ÁNIMO"}
      </p>

      <h2 className="font-display text-5xl italic text-paper mb-3 text-center">{label}</h2>
      <p className="font-sans text-sm text-muted mb-14 text-center">{hint}</p>

      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={32}
          placeholder="Tu nombre..."
          className="w-full bg-transparent border-b border-paper/30 focus:border-paper/70 text-paper font-sans text-2xl py-3 outline-none placeholder:text-muted/30 text-center transition-colors mb-12"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full font-sans text-[11px] tracking-[0.4em] uppercase text-ink bg-paper py-5 hover:bg-paper/90 active:scale-95 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          CONTINUAR
        </button>
      </form>

      <button onClick={onBack} className="mt-10 font-sans text-xs text-muted/60 tracking-widest uppercase hover:text-muted transition-colors">
        ← Atrás
      </button>
    </div>
  );
}
