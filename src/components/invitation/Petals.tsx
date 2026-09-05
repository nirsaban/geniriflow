"use client";

import { useEffect, useState } from "react";

interface Petal {
  left: number;
  delay: number;
  duration: number;
  drift: number;
  size: number;
  opacity: number;
  spin: number;
}

/**
 * Slow petal fall behind the invitation. Positions are randomised on the
 * client after mount (never during render) so server and client markup match.
 */
export function Petals({ count = 14 }: { count?: number }) {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    setPetals(
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        delay: -Math.random() * 18,
        duration: 16 + Math.random() * 14,
        drift: (Math.random() - 0.5) * 120,
        size: 6 + Math.random() * 6,
        opacity: 0.12 + Math.random() * 0.16,
        spin: Math.random() > 0.5 ? 1 : -1,
      })),
    );
  }, [count]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {petals.map((p, i) => (
        <span
          key={i}
          className="invite-petal absolute top-[-8vh] block rounded-[50%_0_50%_0]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.4,
            opacity: p.opacity,
            background: "var(--invite-accent)",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ["--drift" as string]: `${p.drift}px`,
            ["--spin" as string]: `${p.spin * 540}deg`,
          }}
        />
      ))}
    </div>
  );
}
