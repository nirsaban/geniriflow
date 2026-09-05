"use client";

import { AnimatePresence, motion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

/**
 * The "envelope" that covers the invitation until the guest taps it. Tapping
 * is also what earns us permission to start the music — browsers block audio
 * that starts without a gesture.
 */
export function OpeningSeal({
  open,
  onOpen,
  eyebrow,
  names,
}: {
  open: boolean;
  onOpen: () => void;
  eyebrow: string;
  names: string[];
}) {
  return (
    <AnimatePresence>
      {!open && (
        <motion.div
          key="seal"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--invite-bg)] px-6"
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
        >
          <motion.button
            type="button"
            onClick={onOpen}
            className="group flex flex-col items-center gap-6 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
          >
            <span className="text-sm tracking-[0.28em] text-[var(--invite-muted)]">
              {eyebrow}
            </span>

            <span className="relative flex h-40 w-40 items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-[var(--invite-accent-soft)]" />
              <span className="absolute inset-3 rounded-full border border-[var(--invite-accent-soft)]" />
              <span className="invite-seal-pulse absolute inset-0 rounded-full border border-[var(--invite-accent)]" />
              <span className="font-display text-3xl text-[var(--invite-accent)]">
                {names.map((n) => n.charAt(0)).join(" ")}
              </span>
            </span>

            <span className="font-display text-2xl text-[var(--invite-ink)]">
              {names.join(" & ")}
            </span>

            <span className="rounded-full border border-[var(--invite-accent-soft)] px-6 py-2 text-sm text-[var(--invite-muted)] transition group-hover:border-[var(--invite-accent)] group-hover:text-[var(--invite-ink)]">
              הקישו לפתיחת ההזמנה
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
