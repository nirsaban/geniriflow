"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/motion";
import { useContent } from "@/lib/i18n";

/**
 * "The human behind the screen" — founder portrait + personal story.
 * Photo on one side (framed with a brand glow), narrative on the other.
 */
export function FounderStory() {
  const t = useContent().founderStory;

  return (
    <Section id="founder">
      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"
      >
        {/* portrait */}
        <motion.div variants={scaleIn} className="relative mx-auto w-full max-w-xs">
          <div className="pointer-events-none absolute -inset-5 rounded-[2.25rem] bg-gradient-to-br from-cyan/30 via-electric/20 to-violet/30 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/15 shadow-card">
            <Image
              src="/nir.png"
              alt={t.signature.replace(/^[—-]\s*/, "")}
              width={1310}
              height={1770}
              className="h-auto w-full"
              sizes="(max-width: 1024px) 80vw, 320px"
            />
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
          </div>
        </motion.div>

        {/* story */}
        <div>
          <motion.span
            variants={fadeUp}
            className="mb-4 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-cyan"
          >
            {t.eyebrow}
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-balance font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            {t.headline}
          </motion.h2>

          <div className="mt-6 space-y-4">
            {t.paragraphs.map((p) => (
              <motion.p
                key={p}
                variants={fadeUp}
                className="text-pretty leading-relaxed text-slate-300"
              >
                {p}
              </motion.p>
            ))}
          </div>

          <motion.p
            variants={fadeUp}
            className="mt-6 font-display text-lg font-semibold text-white"
          >
            {t.signature}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8">
            <Button href={t.cta.href}>{t.cta.label}</Button>
          </motion.div>
        </div>
      </motion.div>
    </Section>
  );
}
