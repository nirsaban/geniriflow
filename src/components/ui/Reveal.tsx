"use client";

import { motion, type Variants } from "framer-motion";
import { fadeUp } from "@/lib/motion";

/**
 * Scroll-reveal wrapper. Animates its children into view once, when ~20%
 * of the element enters the viewport. Defaults to a subtle fade-up.
 */
export function Reveal({
  children,
  variants = fadeUp,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section" | "span";
}) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}
