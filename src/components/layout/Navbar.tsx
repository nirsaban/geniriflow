"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { BRAND } from "@/lib/content";
import { useContent, LanguageSwitcher } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Sticky top navigation. Glass-on-scroll, brand mark, bilingual links and a
 * language switcher. Layout direction follows the document `dir` automatically.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const nav = useContent().nav;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-ink-950/70 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between md:h-20">
        <a href="#top" className="flex items-center gap-2.5" aria-label={BRAND.name}>
          {/* Brand mark — crop into the infinity glyph (top of the logo art) */}
          <span
            className="block h-9 w-9 rounded-lg border border-white/10 bg-ink-900"
            style={{
              backgroundImage: "url(/logo.jpeg)",
              backgroundSize: "auto 175%",
              backgroundPosition: "center 8%",
              backgroundRepeat: "no-repeat",
            }}
            role="img"
            aria-label={BRAND.name}
          />
          <span className="text-lg font-semibold tracking-tight text-white">
            {BRAND.name}
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <a
            href="#contact"
            className="hidden rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/10 sm:inline-block"
          >
            {nav.cta}
          </a>
        </div>
      </Container>
    </motion.header>
  );
}
