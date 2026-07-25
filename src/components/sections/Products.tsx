"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon, type IconName } from "@/components/ui/Icon";
import { fadeUp } from "@/lib/motion";
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
 *
 * Auto-scrolls as a seamless marquee (the item list is duplicated end-to-end
 * and animated exactly -50%, so the loop point is invisible). Direction is
 * pinned `dir="ltr"` regardless of page locale so the CSS translateX math
 * doesn't invert under RTL's flex-direction flip — motion is decorative, not
 * textual. Pauses on hover/focus and under `prefers-reduced-motion`.
 */
export function Products() {
  const t = useContent().products;
  const track = [...t.items, ...t.items];

  return (
    <Section id="products">
      <SectionHeading eyebrow={t.eyebrow} title={t.headline} subtitle={t.subheadline} />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={fadeUp}
        dir="ltr"
        className="group/marquee relative mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
      >
        <ul className="flex w-max animate-marquee gap-5 group-hover/marquee:[animation-play-state:paused] group-focus-within/marquee:[animation-play-state:paused] motion-reduce:animate-none">
          {track.map((item, i) => {
            const isDuplicate = i >= t.items.length;
            const Wrapper = item.url ? "a" : "div";
            const wrapperProps = item.url
              ? { href: item.url, target: "_blank", rel: "noreferrer" }
              : {};
            return (
              <li
                key={`${item.name}-${i}`}
                aria-hidden={isDuplicate}
                className="w-[85%] shrink-0 sm:w-[360px]"
              >
                <Wrapper {...wrapperProps} tabIndex={isDuplicate ? -1 : undefined} className="block h-full">
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
              </li>
            );
          })}
        </ul>
      </motion.div>
    </Section>
  );
}
