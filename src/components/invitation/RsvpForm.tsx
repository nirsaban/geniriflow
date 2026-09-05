"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { whatsappRsvpUrl, type Invitation } from "@/lib/invitation";
import { EASE_OUT } from "@/lib/motion";

type Status = "yes" | "no" | "maybe";

const OPTIONS: { value: Status; label: string }[] = [
  { value: "yes", label: "מגיעים" },
  { value: "maybe", label: "עדיין לא בטוח" },
  { value: "no", label: "לא נוכל להגיע" },
];

/**
 * Guest RSVP. Posts to /api/rsvp; if that fails (or the couple prefers
 * WhatsApp) the same answer is one tap away as a pre-written message.
 */
export function RsvpForm({ invitation }: { invitation: Invitation }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(2);
  const [status, setStatus] = useState<Status>("yes");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const coming = status !== "no";
  const summary =
    status === "no"
      ? `היי! מדובר ב${name || "…"} — לא נוכל להגיע, מאחלים המון מזל טוב 🤍`
      : `היי! מדובר ב${name || "…"} — ${
          status === "maybe" ? "עדיין לא סופי, אבל" : ""
        } מגיעים ${guests} אורחים 🎉`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setState("sending");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: invitation.slug,
          name: name.trim(),
          phone: phone.trim(),
          status,
          guests: coming ? guests : 0,
        }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="rounded-3xl border border-[var(--invite-accent-soft)] bg-[var(--invite-panel)] p-8 text-center"
      >
        <p className="font-display text-2xl text-[var(--invite-ink)]">תודה, {name}!</p>
        <p className="mt-2 text-sm text-[var(--invite-muted)]">
          {coming ? "רשמנו אתכם. מחכים לראות אתכם 🤍" : "תודה שעדכנתם — אוהבים אתכם 🤍"}
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-[var(--invite-accent-soft)] bg-[var(--invite-panel)] p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm text-[var(--invite-muted)]">שם מלא</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className="w-full rounded-xl border border-[var(--invite-accent-soft)] bg-[var(--invite-bg)] px-4 py-3 text-[var(--invite-ink)] outline-none transition focus:border-[var(--invite-accent)]"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm text-[var(--invite-muted)]">טלפון</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className="w-full rounded-xl border border-[var(--invite-accent-soft)] bg-[var(--invite-bg)] px-4 py-3 text-[var(--invite-ink)] outline-none transition focus:border-[var(--invite-accent)]"
          />
        </label>
      </div>

      <fieldset className="mt-5">
        <legend className="mb-2 text-sm text-[var(--invite-muted)]">מגיעים?</legend>
        <div className="grid grid-cols-3 gap-2">
          {OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setStatus(o.value)}
              aria-pressed={status === o.value}
              className={`rounded-xl border px-2 py-3 text-sm transition ${
                status === o.value
                  ? "border-[var(--invite-accent)] bg-[var(--invite-accent-soft)] text-[var(--invite-ink)]"
                  : "border-[var(--invite-accent-soft)] text-[var(--invite-muted)] hover:text-[var(--invite-ink)]"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </fieldset>

      {coming && (
        <div className="mt-5 flex items-center justify-between rounded-xl border border-[var(--invite-accent-soft)] px-4 py-3">
          <span className="text-sm text-[var(--invite-muted)]">כמה אתם?</span>
          <span className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              aria-label="פחות אורחים"
              className="h-8 w-8 rounded-full border border-[var(--invite-accent-soft)] text-lg leading-none text-[var(--invite-accent)]"
            >
              −
            </button>
            <span className="w-6 text-center font-display text-xl text-[var(--invite-ink)] tabular-nums">
              {guests}
            </span>
            <button
              type="button"
              onClick={() => setGuests((g) => Math.min(20, g + 1))}
              aria-label="עוד אורחים"
              className="h-8 w-8 rounded-full border border-[var(--invite-accent-soft)] text-lg leading-none text-[var(--invite-accent)]"
            >
              +
            </button>
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-6 w-full rounded-full bg-[var(--invite-accent)] px-6 py-3.5 font-medium text-[var(--invite-bg)] transition hover:opacity-90 disabled:opacity-60"
      >
        {state === "sending" ? "שולח…" : "שליחת אישור הגעה"}
      </button>

      {state === "error" && (
        <p className="mt-3 text-center text-sm text-red-500">
          השליחה נכשלה. אפשר לשלוח לנו בוואטסאפ למטה.
        </p>
      )}

      <a
        href={whatsappRsvpUrl(invitation, summary)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 block text-center text-sm text-[var(--invite-muted)] underline underline-offset-4 hover:text-[var(--invite-ink)]"
      >
        או פשוט שלחו לנו בוואטסאפ
      </a>

      {invitation.rsvpDeadline && (
        <p className="mt-4 text-center text-xs text-[var(--invite-muted)]">
          {invitation.rsvpDeadline}
        </p>
      )}
    </form>
  );
}
