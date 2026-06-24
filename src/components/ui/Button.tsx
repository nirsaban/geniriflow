import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";

interface ButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  href: string;
}

/**
 * Link-styled CTA button. Primary = electric gradient with glow.
 * Secondary = glass outline. The arrow auto-flips with reading direction
 * (via Tailwind rtl:/ltr: variants keyed off the document `dir`).
 */
export function Button({
  variant = "primary",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950";

  const variants: Record<Variant, string> = {
    primary:
      "text-white shadow-glow bg-gradient-to-r from-electric via-violet to-cyan bg-[length:200%_100%] hover:bg-[position:100%_0] hover:-translate-y-0.5 hover:shadow-glow-violet",
    secondary:
      "text-slate-100 border border-white/15 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:-translate-y-0.5 hover:border-white/25",
  };

  return (
    <a href={href} className={cn(base, variants[variant], className)} {...props}>
      {children}
      {/* arrow points toward the reading direction and nudges on hover */}
      <svg
        className="h-4 w-4 transition-transform duration-300 ltr:group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 8h9M9 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
