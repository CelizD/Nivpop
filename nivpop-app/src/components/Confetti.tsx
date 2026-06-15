"use client";
import { useMemo } from "react";

const COLORS = ["#c4786a","#b49450","#4a9068","#dc7848","#7860a8","#c89c48","#8c486c","#c8b434","#faf9f6"];

function rand(min: number, max: number, seed: number) {
  // deterministic pseudo-random based on index so it's SSR-safe
  const x = Math.sin(seed + 1) * 10000;
  return min + (x - Math.floor(x)) * (max - min);
}

interface Props { active?: boolean; count?: number; }

export default function Confetti({ active = true, count = 48 }: Props) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x:        rand(0, 100, i * 3),
        delay:    rand(0, 1.8, i * 7),
        duration: rand(1.8, 3.2, i * 11),
        size:     rand(5, 11, i * 13),
        color:    COLORS[i % COLORS.length],
        rotate:   rand(0, 360, i * 17),
        skew:     rand(-20, 20, i * 19),
      })),
    [count],
  );

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50" aria-hidden>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti-fall"
          style={{
            left:              `${p.x}%`,
            top:               "-12px",
            width:             `${p.size}px`,
            height:            `${p.size * 1.6}px`,
            backgroundColor:   p.color,
            animationDelay:    `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform:         `rotate(${p.rotate}deg) skewX(${p.skew}deg)`,
            borderRadius:      p.id % 3 === 0 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}
