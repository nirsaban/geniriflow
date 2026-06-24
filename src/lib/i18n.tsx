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
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = lang === "he" ? "rtl" : "ltr";
  }, [lang]);

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
