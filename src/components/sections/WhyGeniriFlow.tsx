"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/motion";
import { useContent } from "@/lib/i18n";

/**
 * "Why GeniriFlow" — credibility + founder. Headline and proof points on the
 * start side; a founder card (Nir) on the end side. Wrapped in a glass panel.
 */
export function WhyGeniriFlow() {
  const t = useContent().why;

  return (
    <Section id="why">
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl sm:p-12 lg:p-16"
      >
        <div className="pointer-events-none absolute -end-20 -top-20 h-72 w-72 rounded-full bg-violet/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -start-16 h-72 w-72 rounded-full bg-cyan/15 blur-3xl" />

        <div className="relative grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          {/* headline + proof points */}
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

            <ul className="mt-8 space-y-4">
              {t.points.map((point) => (
                <motion.li
                  key={point}
                  variants={fadeUp}
                  className="flex items-start gap-3 text-slate-300"
                >
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan/15 text-cyan">
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                      <path
                        d="M3.5 8.5l3 3 6-7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-sm leading-relaxed sm:text-base">{point}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* founder card */}
          <motion.div
            variants={scaleIn}
            className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-7 backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan via-electric to-violet text-2xl font-bold text-white shadow-glow">
                {t.founder.initials}
              </span>
              <div>
                <p className="text-lg font-semibold text-white">{t.founder.name}</p>
                <p className="text-sm text-cyan">{t.founder.role}</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-slate-400">
              {t.founder.bio}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </Section>
  );
}
