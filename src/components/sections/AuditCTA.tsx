"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { useContent } from "@/lib/i18n";

/** Mid-page CTA band pointing at the smart business audit (scrolls to form). */
export function AuditCTA() {
  const t = useContent().audit;
  return (
    <section className="relative py-16 md:py-24">
      <Container>
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative mx-auto max-w-4xl overflow-hidden rounded-4xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] px-6 py-12 text-center backdrop-blur-xl sm:px-12 sm:py-14"
        >
          <div className="pointer-events-none absolute inset-x-0 -top-20 mx-auto h-56 w-56 rounded-full bg-electric/25 blur-[90px]" />
          <motion.span
            variants={fadeUp}
            className="relative mb-4 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-cyan"
          >
            {t.eyebrow}
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="relative text-balance font-display text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl"
          >
            {t.headline}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="relative mx-auto mt-4 max-w-2xl text-pretty leading-relaxed text-slate-300"
          >
            {t.text}
          </motion.p>
          <motion.div variants={fadeUp} className="relative mt-8 flex justify-center">
            <Button href="#contact" className="px-8 py-4 text-base">
              {t.button}
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
