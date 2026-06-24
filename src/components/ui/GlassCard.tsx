import { cn } from "@/lib/utils";

/**
 * Reusable glassmorphism card. The `glow` variants add a soft colored halo
 * on hover. Used across the Problem / What We Build / Process sections.
 */
export function GlassCard({
  className,
  glow = "none",
  children,
}: {
  className?: string;
  glow?: "none" | "electric" | "violet" | "cyan";
  children: React.ReactNode;
}) {
  const glowMap: Record<string, string> = {
    none: "hover:shadow-card",
    electric: "hover:shadow-glow",
    violet: "hover:shadow-glow-violet",
    cyan: "hover:shadow-glow-cyan",
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20",
        glowMap[glow],
        className,
      )}
    >
      {/* top sheen */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      {children}
    </div>
  );
}
