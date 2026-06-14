"use client";
import type { KioskState } from "@/lib/types";

interface Props {
  state: KioskState;
  onAnswer: (idx: number) => void;
  onBack: () => void;
}

export default function DuoQuizScreen({ state, onAnswer, onBack }: Props) {
  const { dQuestions, dCurQ, dN1, dN2 } = state;
  const q = dQuestions[dCurQ];
  const total = dQuestions.length;
  const progress = (dCurQ / total) * 100;
  const even = dCurQ % 2 === 0;
  const activeNames = even ? [dN1, dN2] : [dN2, dN1];

  if (!q) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-[2px] bg-paper/10 flex-shrink-0">
        <div className="h-full bg-paper/50 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 flex flex-col px-7 py-10 overflow-y-auto">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="font-sans text-[9px] tracking-[0.4em] text-muted/60 uppercase">
              {dCurQ + 1} / {total}
            </span>
            <span className="text-muted/30">·</span>
            <span className="font-sans text-[9px] tracking-[0.3em] text-muted/60 uppercase">
              {activeNames[0]} & {activeNames[1]}
            </span>
          </div>
          <h2 className="font-display text-[1.7rem] leading-snug text-paper italic">{q.q}</h2>
        </div>

        <div className="space-y-3 flex-1">
          {q.o.map((opt, i) => (
            <button
              key={i}
              onClick={() => onAnswer(i)}
              className="w-full text-left border border-paper/12 bg-paper/[0.03] hover:bg-paper/10 active:scale-[0.98] active:bg-paper/15 transition-all duration-100 px-5 py-4 group"
            >
              <span className="font-sans text-sm text-paper/85 group-hover:text-paper leading-relaxed transition-colors">
                {opt.t}
              </span>
            </button>
          ))}
        </div>

        {dCurQ > 0 && (
          <button onClick={onBack} className="mt-8 font-sans text-xs text-muted/50 tracking-widest uppercase hover:text-muted transition-colors self-start">
            ← Anterior
          </button>
        )}
      </div>
    </div>
  );
}
