"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon, type IconName } from "@/components/ui/Icon";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { useContent } from "@/lib/i18n";

export function Problem() {
  const t = useContent().problem;
  return (
    <Section id="problem">
      <SectionHeading eyebrow={t.eyebrow} title={t.headline} />

      <motion.ul
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {t.items.map((item) => (
          <motion.li key={item.title} variants={fadeUp}>
            <GlassCard className="h-full">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-rose-500/10 text-rose-300">
                <Icon name={item.icon as IconName} className="h-5 w-5" />
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
