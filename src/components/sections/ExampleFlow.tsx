"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { fadeUp, staggerContainer, EASE_OUT } from "@/lib/motion";
import { useContent } from "@/lib/i18n";

/**
 * "Example business flow" — a single lead travelling through the whole system.
 * A glowing rail fills in as the section enters view; numbered steps fade up in
 * sequence. Direction-agnostic via logical `start-*` utilities.
 */
export function ExampleFlow() {
  const t = useContent().flow;

  return (
    <Section id="flow">
      <SectionHeading
        eyebrow={t.eyebrow}
        title={t.headline}
        subtitle={t.subheadline}
      />

      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="relative mx-auto mt-14 max-w-2xl"
      >
        {/* rail track */}
        <div className="absolute top-5 bottom-5 start-[19px] w-px bg-white/10" />
        {/* animated rail fill */}
        <motion.div
          variants={{
            hidden: { scaleY: 0 },
            visible: { scaleY: 1, transition: { duration: 1.6, ease: EASE_OUT } },
          }}
          style={{ originY: 0 }}
          className="absolute top-5 bottom-5 start-[19px] w-px bg-gradient-to-b from-cyan via-electric to-violet"
        />

        <ul className="space-y-4">
          {t.steps.map((step, i) => (
            <motion.li
              key={step}
              variants={fadeUp}
              className="relative flex items-center gap-4"
            >
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-ink-900 text-sm font-semibold text-cyan">
                {i + 1}
              </span>
              <GlassCard className="flex-1 p-4">
                <h3 className="text-base font-semibold text-white">{step}</h3>
              </GlassCard>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </Section>
  );
}
