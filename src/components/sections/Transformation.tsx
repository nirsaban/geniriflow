"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/motion";
import { useContent } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * "The shift" — a before/after comparison that visualizes scattered tools
 * collapsing into one connected system. Both panels animate in; an arrow
 * between them points toward the reading direction.
 */
export function Transformation() {
  const t = useContent().transformation;

  const Panel = ({
    label,
    items,
    tone,
  }: {
    label: string;
    items: readonly string[];
    tone: "before" | "after";
  }) => (
    <motion.div
      variants={scaleIn}
      className={cn(
        "relative flex-1 overflow-hidden rounded-3xl border p-6 backdrop-blur-xl",
        tone === "before"
          ? "border-white/10 bg-white/[0.03]"
          : "border-cyan/25 bg-cyan/[0.05] shadow-glow-cyan",
      )}
    >
      <span
        className={cn(
          "mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
          tone === "before"
            ? "bg-rose-500/10 text-rose-300"
            : "bg-cyan/15 text-cyan",
        )}
      >
        {label}
      </span>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className={cn(
              "flex items-center gap-3 text-sm",
              tone === "before" ? "text-slate-400" : "text-slate-200",
            )}
          >
            <span
              className={cn(
                "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                tone === "before"
                  ? "bg-white/5 text-slate-500"
                  : "bg-cyan/15 text-cyan",
              )}
            >
              {tone === "before" ? (
                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
                  <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );

  return (
    <Section id="transformation">
      <SectionHeading eyebrow={t.eyebrow} title={t.headline} subtitle={t.text} />

      <motion.div
        variants={staggerContainer(0.15)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="mx-auto mt-14 flex max-w-4xl flex-col items-stretch gap-5 md:flex-row md:items-center"
      >
        <Panel label={t.beforeLabel} items={t.before} tone="before" />

        {/* connector */}
        <motion.span
          variants={fadeUp}
          className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cyan"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 rotate-90 md:rotate-0 rtl:md:-scale-x-100" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>

        <Panel label={t.afterLabel} items={t.after} tone="after" />
      </motion.div>
    </Section>
  );
}
