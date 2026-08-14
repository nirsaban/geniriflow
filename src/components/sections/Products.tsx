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
 * Live preview of the product's real landing page, scaled down inside the
 * card. The iframe is rendered at 4x the card's width and scaled to 25%, so
 * the framed site lays itself out at a desktop-ish viewport regardless of the
 * card's responsive width. It is purely decorative: no keyboard focus, no
 * pointer events (clicks fall through to the card's own link), lazy-loaded so
 * the embedded sites don't compete with this page's own first paint.
 *
 * The sandbox deliberately has NO allow-scripts: six hydrating Next.js apps
 * measurably froze this page's main thread, and a scripted frame can also
 * steal focus/scroll from the parent. All the framed pages render their full
 * content from SSR alone (verified: no framer-motion opacity-0 inline styles
 * in their HTML), so scriptless frames still show the real site — animations
 * just don't play inside the thumbnail, which is fine for a preview.
 *
 * NOTE: the framed sites must allow being embedded by this origin — the
 * shared yogev-nginx proxy sends
 * `Content-Security-Policy: frame-ancestors 'self' https://geniriflow.miltech.cloud`
 * for exactly this reason. Sites that refuse render as an empty/blocked frame
 * and the icon fallback behind it shows instead.
 */
function SitePreview({ url }: { url: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <iframe
        src={url}
        title=""
        tabIndex={-1}
        loading="lazy"
        sandbox="allow-same-origin"
        scrolling="no"
        className="absolute top-0 h-[400%] w-[400%] origin-top-left border-0 bg-transparent [inset-inline-start:0]"
        style={{ transform: "scale(0.25)" }}
      />
    </div>
  );
}

/**
 * Showcases real, built products from the GeniriFlow portfolio — proof of
 * what "smart business systems" actually looks like when shipped. Kept in
 * sync with control-room's tracked landing pages by the
 * `/portfolio-carousel-sync` skill; only products with a real landing page
 * (BUILT or LIVE) belong here. Deployed products embed their live site as a
 * scaled-down preview; not-yet-deployed ones show their icon instead and
 * carry an "in progress" label rather than a link that would 404.
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
                    {/* Preview window, bleeding to the card's edges */}
                    <div className="relative -mx-6 -mt-6 mb-5 h-44 overflow-hidden border-b border-white/10 bg-white/[0.03]">
                      {/* Icon fallback: the base layer for not-yet-deployed
                          products, and what shows behind a preview that has
                          not painted yet. */}
                      <div
                        className={`absolute inset-0 flex items-center justify-center ${item.url ? "" : "opacity-90"}`}
                      >
                        <span
                          className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl border ${ACCENT_CLASSES[item.accent]}`}
                        >
                          <Icon name={item.icon as IconName} />
                        </span>
                      </div>
                      {item.url && <SitePreview url={item.url} />}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span
                        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${ACCENT_CLASSES[item.accent]}`}
                      >
                        <Icon name={item.icon as IconName} className="h-4 w-4" />
                      </span>
                      <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    </div>
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
