"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/content";
import { useContent } from "@/lib/i18n";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Final CTA + lead-capture form. All audit/CTA buttons link to #contact.
 *
 * NOTE: UI-wired only — `handleSubmit` fakes the request. To go live, POST the
 * FormData to an endpoint (email / Next API route / Make / Zapier webhook).
 */
export function Contact() {
  const t = useContent().finalCta;
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget; // capture before await (React nulls currentTarget)
    setStatus("submitting");
    try {
      // const data = Object.fromEntries(new FormData(form));
      // await fetch("/api/lead", { method: "POST", body: JSON.stringify(data) });
      await new Promise((r) => setTimeout(r, 800));
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const fieldClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-cyan/50 focus:bg-white/[0.06]";

  return (
    <section id="contact" className="relative scroll-mt-24 py-24 md:py-32">
      <Container>
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative mx-auto grid max-w-5xl items-center gap-10 overflow-hidden rounded-4xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-6 backdrop-blur-xl sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-14"
        >
          <div className="pointer-events-none absolute -end-24 -top-24 h-64 w-64 rounded-full bg-violet/25 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-24 -start-16 h-64 w-64 rounded-full bg-cyan/20 blur-[100px]" />

          {/* copy side */}
          <div className="relative">
            <motion.h2
              variants={fadeUp}
              className="text-balance font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              {t.headline}
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-pretty leading-relaxed text-slate-300">
              {t.text}
            </motion.p>

            <motion.ul variants={fadeUp} className="mt-7 space-y-3">
              {t.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan/15 text-cyan">
                    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
                      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {b}
                </li>
              ))}
            </motion.ul>

            <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
              <a href={`mailto:${BRAND.email}`} dir="ltr" className="transition-colors hover:text-white">
                {BRAND.email}
              </a>
              <a
                href={`https://wa.me/${BRAND.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                className="transition-colors hover:text-white"
              >
                {BRAND.phone}
              </a>
            </motion.div>
          </div>

          {/* form side */}
          <motion.div variants={fadeUp} className="relative">
            {status === "success" ? (
              <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-3xl border border-cyan/30 bg-cyan/5 p-8 text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan to-violet">
                  <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-white">{t.form.success}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm text-slate-300">
                    {t.form.name.label}
                  </label>
                  <input id="name" name="name" type="text" required placeholder={t.form.name.placeholder} className={fieldClass} />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm text-slate-300">
                    {t.form.phone.label}
                  </label>
                  <input id="phone" name="phone" type="tel" required dir="ltr" placeholder={t.form.phone.placeholder} className={cn(fieldClass, "text-end")} />
                </div>
                <div>
                  <label htmlFor="business" className="mb-1.5 block text-sm text-slate-300">
                    {t.form.business.label}
                  </label>
                  <input id="business" name="business" type="text" placeholder={t.form.business.placeholder} className={fieldClass} />
                </div>
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm text-slate-300">
                    {t.form.message.label}
                  </label>
                  <textarea id="message" name="message" rows={3} placeholder={t.form.message.placeholder} className={cn(fieldClass, "resize-none")} />
                </div>

                {status === "error" && <p className="text-sm text-rose-400">{t.form.error}</p>}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="group relative inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-electric via-violet to-cyan bg-[length:200%_100%] px-7 py-3.5 text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:bg-[position:100%_0] hover:shadow-glow-violet disabled:opacity-60 rtl:bg-gradient-to-l"
                >
                  {status === "submitting" ? t.form.submitting : t.form.submit}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
