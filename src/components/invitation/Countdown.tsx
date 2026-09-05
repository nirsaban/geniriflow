"use client";

import { useEffect, useState } from "react";

const UNITS = [
  { key: "days", label: "ימים" },
  { key: "hours", label: "שעות" },
  { key: "minutes", label: "דקות" },
  { key: "seconds", label: "שניות" },
] as const;

function split(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/**
 * Ticking countdown to the event. Renders empty dashes on the server (the
 * remaining time is not knowable there) and starts ticking after mount.
 */
export function Countdown({ target }: { target: string }) {
  const [left, setLeft] = useState<ReturnType<typeof split> | null>(null);

  useEffect(() => {
    const at = new Date(target).getTime();
    const tick = () => setLeft(split(at - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const passed = left !== null && Object.values(left).every((v) => v === 0);
  if (passed) {
    return (
      <p className="text-center text-lg text-[var(--invite-accent)]">
        היום חוגגים 🥂
      </p>
    );
  }

  return (
    <ul className="flex items-start justify-center gap-3 sm:gap-5" dir="rtl">
      {UNITS.map(({ key, label }) => (
        <li
          key={key}
          className="min-w-[4.25rem] rounded-2xl border border-[var(--invite-accent-soft)] bg-[var(--invite-panel)] px-3 py-3 text-center sm:min-w-[5rem]"
        >
          <span className="block font-display text-2xl tabular-nums text-[var(--invite-ink)] sm:text-3xl">
            {left ? String(left[key]).padStart(2, "0") : "--"}
          </span>
          <span className="mt-1 block text-[0.7rem] tracking-wide text-[var(--invite-muted)]">
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
}
