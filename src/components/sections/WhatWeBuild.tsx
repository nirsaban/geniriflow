"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon, type IconName } from "@/components/ui/Icon";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { useContent } from "@/lib/i18n";

const ACCENT_CLASSES: Record<string, string> = {
  electric: "border-electric/30 bg-electric/10 text-electric",
  cyan: "border-cyan/30 bg-cyan/10 text-cyan",
  violet: "border-violet/30 bg-violet/10 text-violet",
};

export function WhatWeBuild() {
  const t = useContent().build;
  return (
    <Section id="what-we-build">
      <SectionHeading
        eyebrow={t.eyebrow}
        title={t.headline}
        subtitle={t.subheadline}
      />

      <motion.ul
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {t.items.map((item) => (
          <motion.li key={item.title} variants={fadeUp}>
            <GlassCard
              glow={item.accent as "electric" | "cyan" | "violet"}
              className="h-full"
            >
              <div
                className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${ACCENT_CLASSES[item.accent]}`}
              >
                <Icon name={item.icon as IconName} />
              </div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {item.description}
              </p>
            </GlassCard>
          </motion.li>
        ))}
      </motion.ul>
    </Section>
  );
}
