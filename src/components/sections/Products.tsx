"use client";

import { useRef } from "react";
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
 * A user-controlled horizontal scroll-snap list (not an auto-scrolling
 * marquee): the reader drags/scrolls at their own pace, cards snap into
 * place, and reading direction follows the page's own `dir` automatically.
 * A vanilla mouse wheel has no horizontal axis, so plain vertical scroll
 * input over the list is redirected to horizontal — otherwise a mouse (as
 * opposed to a trackpad/touchscreen) user has no way to move it at all.
 */
export function Products() {
  const t = useContent().products;
  const scrollerRef = useRef<HTMLUListElement>(null);

  function handleWheel(e: React.WheelEvent<HTMLUListElement>) {
    const el = scrollerRef.current;
    if (!el || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    // `behavior: "instant"` matters here: with the container's own
    // scroll-behavior: smooth, a plain `scrollLeft +=` on every wheel tick
    // restarts a smooth-scroll animation each time, so rapid ticks cancel
    // each other out and the list visually never moves.
    el.scrollBy({ left: e.deltaY, behavior: "instant" });
    e.preventDefault();
  }

  return (
    <Section id="products">
      <SectionHeading eyebrow={t.eyebrow} title={t.headline} subtitle={t.subheadline} />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={fadeUp}
        className="relative mt-14"
      >
        <ul
          ref={scrollerRef}
          onWheel={handleWheel}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {t.items.map((item) => {
            const Wrapper = item.url ? "a" : "div";
            const wrapperProps = item.url
              ? { href: item.url, target: "_blank", rel: "noreferrer" }
              : {};
            return (
              <li key={item.name} className="w-[85vw] shrink-0 snap-start sm:w-[360px]">
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
              </li>
            );
          })}
        </ul>
      </motion.div>
    </Section>
  );
}
