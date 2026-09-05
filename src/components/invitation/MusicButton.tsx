"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Floating speaker toggle for the background track. `autoStart` flips to true
 * when the guest opens the envelope, which is the user gesture browsers
 * require before audio may play.
 */
export function MusicButton({
  src,
  title,
  autoStart,
}: {
  src: string;
  title: string;
  autoStart: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!autoStart || !audioRef.current) return;
    audioRef.current
      .play()
      .then(() => setPlaying(true))
      // Autoplay can still be refused (silent mode, data saver) — the guest
      // can always start it by hand.
      .catch(() => setPlaying(false));
  }, [autoStart]);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? `השתקת ${title}` : `הפעלת ${title}`}
        className="fixed bottom-5 start-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--invite-accent-soft)] bg-[var(--invite-panel)] text-[var(--invite-accent)] shadow-sm backdrop-blur"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
          <path
            d="M5 9.5h3l4-3.5v12l-4-3.5H5z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {playing ? (
            <path
              d="M15.5 9a4 4 0 0 1 0 6M18 7a7 7 0 0 1 0 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="m16 9.5 4 5m0-5-4 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>
    </>
  );
}
