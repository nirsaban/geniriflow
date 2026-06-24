/**
 * Minimal line-icon set rendered as inline SVG (no icon library dependency).
 * Each icon is drawn on a 24x24 grid and inherits `currentColor`.
 */

export type IconName =
  | "lead"
  | "update"
  | "clock"
  | "error"
  | "data"
  | "eye"
  | "agent"
  | "flow"
  | "crm"
  | "whatsapp"
  | "dashboard"
  | "integration"
  | "shield"
  | "check"
  | "scale"
  | "lock"
  | "spark"
  | "code";

const PATHS: Record<IconName, React.ReactNode> = {
  lead: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M17 8h4M19 6v4" />
    </>
  ),
  update: (
    <>
      <path d="M20 11a8 8 0 1 0-2.3 5.7" />
      <path d="M20 5v5h-5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  error: (
    <>
      <path d="M12 4 3 19h18L12 4Z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  data: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
      <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  agent: (
    <>
      <rect x="5" y="7" width="14" height="11" rx="3" />
      <path d="M12 7V4M9.5 12h.01M14.5 12h.01M9 18v2M15 18v2" />
    </>
  ),
  flow: (
    <>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="18" cy="6" r="2.2" />
      <circle cx="12" cy="18" r="2.2" />
      <path d="M8 7l3 9M16 7l-3 9" />
    </>
  ),
  crm: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2.5" />
      <path d="M4 9h16M8 13h5M8 16h8" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M4 20l1.4-4A8 8 0 1 1 9 19.5L4 20Z" />
      <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5M9 9.5c0-.8.4-1.2 1-1.2M14.5 15c.8 0 1.2-.4 1.2-1" />
    </>
  ),
  dashboard: (
    <>
      <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
      <path d="M8 16v-3M12 16v-6M16 16v-4" />
    </>
  ),
  integration: (
    <>
      <rect x="4" y="9" width="6" height="6" rx="1.5" />
      <rect x="14" y="4" width="6" height="6" rx="1.5" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" />
      <path d="M10 12h2v-5h2M12 12v5h2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5 19 6v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-2.5Z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12l2.3 2.3L15.5 9.5" />
    </>
  ),
  scale: (
    <>
      <path d="M4 20h16M7 20V8M17 20V8M4 8h16M7 8 4.5 13h5L7 8ZM17 8l-2.5 5h5L17 8Z" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="10" rx="2.5" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M12 8c1 2.2 1.8 3 4 4-2.2 1-3 1.8-4 4-1-2.2-1.8-3-4-4 2.2-1 3-1.8 4-4Z" />
    </>
  ),
  code: (
    <>
      <path d="M8.5 8.5 5 12l3.5 3.5M15.5 8.5 19 12l-3.5 3.5M13 6l-2 12" />
    </>
  ),
};

export function Icon({
  name,
  className = "h-6 w-6",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
