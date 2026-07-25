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

/**
 * Showcases real, built products from the GeniriFlow portfolio — proof of
 * what "smart business systems" actually looks like when shipped. Kept in
 * sync with control-room's tracked landing pages by the
 * `/portfolio-carousel-sync` skill; only products with a real landing page
 * (BUILT or LIVE) belong here.
 */
export function Products() {
  const t = useContent().products;
  return (
    <Section id="products">
      <SectionHeading eyebrow={t.eyebrow} title={t.headline} subtitle={t.subheadline} />

      <motion.ul
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="mt-14 flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {t.items.map((item) => {
          const Wrapper = item.url ? "a" : "div";
          const wrapperProps = item.url
            ? { href: item.url, target: "_blank", rel: "noreferrer" }
            : {};
          return (
            <motion.li
              key={item.name}
              variants={fadeUp}
              className="w-[85%] shrink-0 snap-start sm:w-[360px]"
            >
              <Wrapper {...wrapperProps} className="block h-full">
                <GlassCard glow={item.accent as "electric" | "cyan" | "violet"} className="h-full">
                  <div
                    className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${ACCENT_CLASSES[item.accent]}`}
                  >
                    <Icon name={item.icon as IconName} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 group-hover:text-white">
                    {item.cta}
                    {item.url && <span aria-hidden>→</span>}
                  </span>
                </GlassCard>
              </Wrapper>
            </motion.li>
          );
        })}
      </motion.ul>
    </Section>
  );
}
