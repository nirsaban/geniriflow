"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ScrollFrameSequence } from "@/components/media/ScrollFrameSequence";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { HERO_FRAMES } from "@/lib/content";
import { useContent, useLang } from "@/lib/i18n";

/**
 * Apple-style hero: a tall scroll "track" pins a full-screen stage while the
 * GeniriFlow reveal frame-sequence plays, driven by scroll progress. Copy stays
 * readable on the start side over a strong directional gradient.
 *
 * Bilingual: copy + direction come from the global language context. Layout
 * direction flips automatically via the document `dir` (rtl:/ltr: variants).
 */
export function Hero() {
  const { lang } = useLang();
  const t = useContent().hero;
  const trackRef = useRef<HTMLDivElement>(null);

  // Mobile: a normal one-screen hero (the sequence auto-plays).
  // Desktop (md+): a tall track whose sticky stage pins while scrubbing.
  return (
    <section id="top" ref={trackRef} className="relative h-[100svh] md:h-[800vh]">
      <div className="relative h-[100svh] w-full overflow-hidden md:sticky md:top-0 md:h-screen">
        {/* Scroll-controlled frame sequence (canvas) fills the stage */}
        <div className="absolute inset-0">
          <ScrollFrameSequence
            framesPath={HERO_FRAMES.path}
            frameCount={HERO_FRAMES.count}
            poster={HERO_FRAMES.poster}
            pad={HERO_FRAMES.pad}
            ext={HERO_FRAMES.ext}
            trackRef={trackRef}
          />
        </div>

        {/* Directional gradient so text stays readable over the footage */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-transparent rtl:bg-gradient-to-l" />
        {/* cinematic vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_50%,transparent_45%,rgba(5,6,15,0.6)_100%)]" />
        {/* fade into next section */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-ink-950" />

        {/* Content — above the animation */}
        <Container className="relative z-10 flex h-full items-center">
          <motion.div
            key={lang}
            variants={staggerContainer(0.12)}
            initial="hidden"
            animate="visible"
            className="max-w-xl text-start"
          >
            <motion.span
              variants={fadeUp}
              className="mb-5 block text-xs font-semibold tracking-wide text-cyan"
            >
              {t.eyebrow}
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="text-balance font-display text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              {t.headlineLead}
              <span className="bg-gradient-to-r from-cyan via-electric to-violet bg-clip-text text-transparent rtl:bg-gradient-to-l">
                {t.headlineAccent}
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-slate-300/90 sm:text-lg"
            >
              {t.subheadline}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
            >
              <Button href={t.primaryCta.href}>{t.primaryCta.label}</Button>
              <Button href={t.secondaryCta.href} variant="secondary">
                {t.secondaryCta.label}
              </Button>
            </motion.div>
          </motion.div>
        </Container>

        {/* scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="pointer-events-none absolute inset-x-0 bottom-6 z-10 hidden justify-center md:flex"
        >
          <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1">
            <span className="h-2 w-1 animate-bounce rounded-full bg-white/60" />
          </span>
        </motion.div>
      </div>
    </section>
  );
}
