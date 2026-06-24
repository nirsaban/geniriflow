"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { BRAND } from "@/lib/content";
import { useContent } from "@/lib/i18n";

export function Footer() {
  const t = useContent();
  const f = t.footer;
  return (
    <footer className="relative border-t border-white/10 py-14">
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* brand */}
          <div className="max-w-sm">
            <Image
              src="/logo.jpeg"
              alt={BRAND.name}
              width={220}
              height={166}
              className="h-auto w-44 rounded-2xl border border-white/10"
            />
            <p className="mt-4 text-sm font-medium text-white">{f.tagline}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.description}</p>
            <p className="mt-3 text-sm text-slate-500">{f.location}</p>
          </div>

          {/* links + contact */}
          <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
            <div>
              <h4 className="text-sm font-semibold text-white">{f.exploreTitle}</h4>
              <ul className="mt-4 space-y-3">
                {t.nav.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-slate-400 transition-colors hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">{f.contactTitle}</h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <a href={`mailto:${BRAND.email}`} dir="ltr" className="text-sm text-slate-400 transition-colors hover:text-white">
                    {BRAND.email}
                  </a>
                </li>
                <li>
                  <a href={BRAND.phoneHref} dir="ltr" className="text-sm text-slate-400 transition-colors hover:text-white">
                    {BRAND.phone}
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-sm text-cyan transition-colors hover:text-white">
                    {f.bookCta}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {BRAND.name}. {f.rights}
          </p>
          <p>{f.founderNote}</p>
        </div>
      </Container>
    </footer>
  );
}
