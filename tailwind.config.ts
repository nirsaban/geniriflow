import type { Config } from "tailwindcss";

/**
 * GeniriFlow design tokens.
 * Dark, futuristic, premium. Electric blue / purple / cyan glow palette.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Deep space backdrop
        ink: {
          950: "#05060f",
          900: "#080a18",
          800: "#0c1024",
          700: "#11162f",
        },
        // Brand glows
        electric: "#3b82f6", // electric blue
        cyan: "#22d3ee",
        violet: "#8b5cf6",
        magenta: "#c026d3",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(59,130,246,0.45)",
        "glow-violet": "0 0 50px -12px rgba(139,92,246,0.5)",
        "glow-cyan": "0 0 50px -12px rgba(34,211,238,0.45)",
        card: "0 10px 40px -15px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.06) 1px, transparent 1px)",
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "float-slow": "float-slow 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "gradient-x": "gradient-x 6s ease infinite",
      },
    },
  },
  plugins: [],
};

export default config;
