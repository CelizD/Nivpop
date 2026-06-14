"use client";

const EMOJIS = ["🍓","🍦","🍃","🍫","🥭","💜","🍵","🍯","🫐","🍮","🍋","🌿","☕","🍌","🍷","🌸"];

export default function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-8 py-20 text-center overflow-hidden">
      <div className="mb-14">
        <h1 className="font-display text-8xl font-light tracking-[0.25em] text-paper mb-2">
          NIV&apos;POP
        </h1>
        <p className="font-sans text-[10px] tracking-[0.5em] text-muted uppercase">
          HELADOS ARTESANALES
        </p>
      </div>

      <div className="mb-16">
        <p className="font-display text-3xl italic text-paper/80 mb-4 leading-snug">
          Descubre tu sabor de nieve
        </p>
        <p className="font-sans text-sm text-muted max-w-xs leading-relaxed mx-auto">
          Un test de personalidad para conocerte<br />a través de los sabores
        </p>
      </div>

      <button
        onClick={onStart}
        className="font-sans text-[11px] tracking-[0.4em] uppercase text-ink bg-paper px-16 py-5 hover:bg-paper/90 active:scale-95 transition-all duration-150"
      >
        COMENZAR
      </button>

      <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none select-none">
        <p className="text-lg text-paper/10 tracking-widest">
          {EMOJIS.join("  ")}
        </p>
      </div>
    </div>
  );
}
