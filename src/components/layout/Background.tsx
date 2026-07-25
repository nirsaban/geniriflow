/**
 * Fixed, page-wide ambient backdrop: deep gradient, faint grid, and a few
 * soft color "auroras". Purely decorative and pointer-events-none so it never
 * interferes with content.
 *
 * The auroras are radial-gradients, not `filter: blur()` — a `position:
 * fixed` ancestor combined with `filter: blur()` descendants forces a
 * repaint on every scroll frame on mobile (confirmed on geniribot's landing
 * page, which had the same pattern and felt "stuck" on phones until this
 * exact fix). A radial-gradient gives the same soft-glow look with zero
 * runtime blur cost, so this stays `fixed` for the persistent full-page
 * backdrop it's meant to be.
 */
export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950">
      {/* faint grid */}
      <div className="absolute inset-0 bg-grid-faint bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      {/* aurora glows */}
      <div
        className="absolute -left-40 top-[-10%] h-[40rem] w-[40rem] rounded-full"
        style={{ background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(59,130,246,0.22), transparent 70%)" }}
      />
      <div
        className="absolute right-[-15%] top-[20%] h-[36rem] w-[36rem] rounded-full"
        style={{ background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(139,92,246,0.22), transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-10%] left-[30%] h-[34rem] w-[34rem] rounded-full"
        style={{ background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(34,211,238,0.12), transparent 70%)" }}
      />

      {/* subtle top vignette so the navbar always reads */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-950 to-transparent" />
    </div>
  );
}
