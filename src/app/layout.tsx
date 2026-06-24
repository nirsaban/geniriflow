import type { Metadata, Viewport } from "next";
import { Heebo, Rubik } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/content";
import { LanguageProvider } from "@/lib/i18n";

// Fonts cover both Latin + Hebrew. Heebo = body, Rubik = display.
const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-sans",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  variable: "--font-display",
  display: "swap",
});

const title = `${BRAND.name} — מערכות עסקיות חכמות ותוכנה מותאמת אישית`;
const description =
  "GeniriFlow מאפיינת ובונה מערכות עסקיות חכמות, תוכנה מותאמת אישית, תהליכי AI, אוטומציות ודאשבורדים — והופכת תפעול מבולגן למערכות מסודרות, אוטומטיות ומוכנות לצמיחה.";

export const metadata: Metadata = {
  // TODO: set to the real production domain (resolves OG/Twitter image URLs).
  metadataBase: new URL("https://geniriflow.com"),
  title: {
    default: title,
    template: `%s · ${BRAND.name}`,
  },
  description,
  keywords: [
    "מערכות עסקיות",
    "תוכנה מותאמת אישית",
    "אוטומציה",
    "סוכני AI",
    "מערכות CRM",
    "אוטומציות וואטסאפ",
    "דאשבורדים",
    "פיתוח תוכנה",
  ],
  icons: { icon: "/logo.jpeg", apple: "/logo.jpeg" },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "he_IL",
    images: [{ url: "/brand-poster.jpeg", width: 859, height: 1180, alt: BRAND.name }],
  },
  twitter: { card: "summary_large_image", images: ["/brand-poster.jpeg"] },
};

export const viewport: Viewport = {
  themeColor: "#05060f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Default language is Hebrew (RTL); the provider flips lang/dir on switch.
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${rubik.variable}`}>
      <body className="font-sans">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
