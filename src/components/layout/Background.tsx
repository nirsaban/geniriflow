/**
 * Fixed, page-wide ambient backdrop: deep gradient, faint grid, and a few
 * soft color "auroras". Purely decorative and pointer-events-none so it never
 * interferes with content. Cheap (CSS only) — no per-frame cost.
 */
export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950">
      {/* faint grid */}
      <div className="absolute inset-0 bg-grid-faint bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      {/* aurora glows */}
      <div className="absolute -left-40 top-[-10%] h-[40rem] w-[40rem] rounded-full bg-electric/20 blur-[120px]" />
      <div className="absolute right-[-15%] top-[20%] h-[36rem] w-[36rem] rounded-full bg-violet/20 blur-[130px]" />
      <div className="absolute bottom-[-10%] left-[30%] h-[34rem] w-[34rem] rounded-full bg-cyan/10 blur-[130px]" />

      {/* subtle top vignette so the navbar always reads */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-950 to-transparent" />
    </div>
  );
}
