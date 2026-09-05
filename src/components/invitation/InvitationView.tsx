"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  googleMapsUrl,
  inviteTitle,
  wazeUrl,
  type Invitation,
} from "@/lib/invitation";
import { EASE_OUT, fadeUp, staggerContainer } from "@/lib/motion";
import { Countdown } from "./Countdown";
import { MusicButton } from "./MusicButton";
import { OpeningSeal } from "./OpeningSeal";
import { Petals } from "./Petals";
import { RsvpForm } from "./RsvpForm";

/** A section that fades up the first time it scrolls into view. */
function Block({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      className={`mx-auto w-full max-w-xl px-6 ${className}`}
    >
      {children}
    </motion.section>
  );
}

function Divider() {
  return (
    <div aria-hidden className="mx-auto my-14 flex max-w-xl items-center gap-4 px-6">
      <span className="h-px flex-1 bg-[var(--invite-accent-soft)]" />
      <span className="h-1.5 w-1.5 rotate-45 bg-[var(--invite-accent)]" />
      <span className="h-px flex-1 bg-[var(--invite-accent-soft)]" />
    </div>
  );
}

export function InvitationView({ invitation }: { invitation: Invitation }) {
  const [opened, setOpened] = useState(false);
  const { palette: p, venue } = invitation;

  const shareText = `מזמינים אתכם! ${inviteTitle(invitation)} · ${invitation.dateLabel}`;

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[var(--invite-bg)] text-[var(--invite-ink)]"
      style={
        {
          "--invite-bg": p.bg,
          "--invite-panel": p.panel,
          "--invite-ink": p.ink,
          "--invite-muted": p.muted,
          "--invite-accent": p.accent,
          "--invite-accent-soft": p.accentSoft,
        } as React.CSSProperties
      }
    >
      <Petals />

      <OpeningSeal
        open={opened}
        onOpen={() => setOpened(true)}
        eyebrow={invitation.eyebrow}
        names={invitation.names}
      />

      {invitation.music && (
        <MusicButton
          src={invitation.music.src}
          title={invitation.music.title}
          autoStart={opened}
        />
      )}

      <main className="relative z-10 pb-24 pt-16">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <motion.header
          variants={staggerContainer(0.14, 0.35)}
          initial="hidden"
          animate={opened ? "visible" : "hidden"}
          className="mx-auto flex max-w-xl flex-col items-center px-6 text-center"
        >
          {invitation.quote && (
            <motion.p
              variants={fadeUp}
              className="text-sm tracking-[0.18em] text-[var(--invite-muted)]"
            >
              {invitation.quote}
            </motion.p>
          )}

          <motion.p
            variants={fadeUp}
            className="mt-8 text-xs tracking-[0.28em] text-[var(--invite-accent)]"
          >
            {invitation.eyebrow}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="mt-4 font-display text-5xl leading-[1.15] text-[var(--invite-ink)] sm:text-6xl"
          >
            {invitation.names.map((n, i) => (
              <span key={n} className="block">
                {n}
                {i < invitation.names.length - 1 && (
                  <span className="my-2 block text-3xl text-[var(--invite-accent)]">&</span>
                )}
              </span>
            ))}
          </motion.h1>

          {invitation.parents && (
            <motion.p
              variants={fadeUp}
              className="mt-6 text-sm leading-relaxed text-[var(--invite-muted)]"
            >
              {invitation.parents.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </motion.p>
          )}

          <motion.p
            variants={fadeUp}
            className="mt-8 border-y border-[var(--invite-accent-soft)] px-6 py-3 text-base text-[var(--invite-ink)]"
          >
            {invitation.dateLabel}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 w-full">
            <Countdown target={invitation.startsAt} />
          </motion.div>
        </motion.header>

        <Divider />

        {/* ── Schedule ─────────────────────────────────────────── */}
        <Block>
          <h2 className="text-center font-display text-2xl">סדר הערב</h2>
          <ol className="mt-8 space-y-6">
            {invitation.schedule.map((item) => (
              <li key={item.title} className="flex gap-5">
                <span className="w-16 shrink-0 pt-1 text-end font-display text-lg tabular-nums text-[var(--invite-accent)]">
                  {item.time}
                </span>
                <span className="relative flex-1 border-s border-[var(--invite-accent-soft)] ps-5">
                  <span className="absolute -start-[3.5px] top-2 block h-[7px] w-[7px] rounded-full bg-[var(--invite-accent)]" />
                  <span className="block text-lg text-[var(--invite-ink)]">{item.title}</span>
                  {item.note && (
                    <span className="mt-1 block text-sm text-[var(--invite-muted)]">
                      {item.note}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        </Block>

        <Divider />

        {/* ── Venue ────────────────────────────────────────────── */}
        <Block>
          <h2 className="text-center font-display text-2xl">איפה חוגגים</h2>
          <p className="mt-6 text-center font-display text-xl text-[var(--invite-accent)]">
            {venue.name}
          </p>
          {venue.hallLine && (
            <p className="mt-1 text-center text-sm text-[var(--invite-muted)]">
              {venue.hallLine}
            </p>
          )}
          <p className="mt-1 text-center text-sm text-[var(--invite-muted)]">
            {venue.address}
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <a
              href={wazeUrl(venue)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[var(--invite-accent-soft)] px-4 py-3 text-center text-sm transition hover:border-[var(--invite-accent)]"
            >
              ניווט ב-Waze
            </a>
            <a
              href={googleMapsUrl(venue)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[var(--invite-accent-soft)] px-4 py-3 text-center text-sm transition hover:border-[var(--invite-accent)]"
            >
              Google Maps
            </a>
          </div>

          <a
            href={`/api/invitation/${invitation.slug}/calendar`}
            className="mt-3 block rounded-full border border-[var(--invite-accent-soft)] px-4 py-3 text-center text-sm transition hover:border-[var(--invite-accent)]"
          >
            הוספה ליומן
          </a>
        </Block>

        <Divider />

        {/* ── RSVP ─────────────────────────────────────────────── */}
        <Block>
          <h2 className="text-center font-display text-2xl">אישור הגעה</h2>
          <p className="mt-2 text-center text-sm text-[var(--invite-muted)]">
            כמה שניות, וזה עוזר לנו יותר משנדמה
          </p>
          <div className="mt-7">
            <RsvpForm invitation={invitation} />
          </div>
        </Block>

        {/* ── Closing ──────────────────────────────────────────── */}
        <motion.footer
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ ease: EASE_OUT }}
          className="mx-auto mt-20 max-w-xl px-6 text-center"
        >
          {invitation.closing && (
            <p className="font-display text-xl text-[var(--invite-ink)]">
              {invitation.closing}
            </p>
          )}
          <p className="mt-4 text-2xl text-[var(--invite-accent)]">
            {inviteTitle(invitation)}
          </p>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full border border-[var(--invite-accent-soft)] px-6 py-2.5 text-sm text-[var(--invite-muted)] transition hover:border-[var(--invite-accent)] hover:text-[var(--invite-ink)]"
          >
            שיתוף ההזמנה
          </a>

          <p className="mt-12 text-xs text-[var(--invite-muted)]">
            ההזמנה נבנתה ב-
            <a href="/" className="underline underline-offset-4">
              GeniriFlow
            </a>
          </p>
        </motion.footer>
      </main>
    </div>
  );
}
