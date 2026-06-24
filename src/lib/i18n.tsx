"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CONTENT, type Lang } from "./content";
import { cn } from "./utils";

/**
 * Lightweight i18n: a language context (default English) that also keeps the
 * <html> `lang`/`dir` attributes in sync so Tailwind's `rtl:`/`ltr:` variants
 * and logical utilities flip the whole layout automatically.
 */
interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default language is Hebrew (RTL); English is available via the switcher.
  const [lang, setLang] = useState<Lang>("he");

  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = lang === "he" ? "rtl" : "ltr";
  }, [lang]);

  // Always open at the top. Some mobile browsers restore the previous scroll
  // position and were reopening the long page scrolled to the bottom.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (!window.location.hash) {
      // run after first paint so it wins over any late layout shift
      requestAnimationFrame(() => window.scrollTo(0, 0));
    }
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

/** Access the current language + setter. */
export const useLang = () => useContext(LangContext);

/** Convenience: the active language's content slice. */
export function useContent() {
  const { lang } = useLang();
  return CONTENT[lang];
}

/** Simple EN / עברית switcher (placeholder UI). */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  const options: { value: Lang; label: string }[] = [
    { value: "en", label: "EN" },
    { value: "he", label: "עברית" },
  ];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-xs font-medium backdrop-blur-md",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => setLang(o.value)}
          aria-pressed={lang === o.value}
          className={cn(
            "rounded-full px-3 py-1 transition-colors",
            lang === o.value
              ? "bg-white/15 text-white"
              : "text-slate-400 hover:text-white",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
