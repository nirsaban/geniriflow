"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { useContent } from "@/lib/i18n";

/**
 * Five-step process as a connected flow on desktop, stacked on mobile.
 * The connector arrow auto-flips with reading direction.
 */
export function Process() {
  const t = useContent().process;

  return (
    <Section id="process">
      <SectionHeading
        eyebrow={t.eyebrow}
        title={t.headline}
        subtitle={t.subheadline}
      />

      <motion.ol
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-5"
      >
        {t.steps.map((step, i) => (
          <motion.li key={step.title} variants={fadeUp} className="relative">
            {i < t.steps.length - 1 && (
              <span className="absolute -end-3 top-1/2 z-10 hidden -translate-y-1/2 text-white/20 lg:block rtl:-scale-x-100">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
            <GlassCard className="h-full">
              <span className="block bg-gradient-to-br from-cyan to-violet bg-clip-text text-4xl font-bold text-transparent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-base font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {step.description}
              </p>
            </GlassCard>
          </motion.li>
        ))}
      </motion.ol>
    </Section>
  );
}
