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

const description =
  "GeniriFlow designs and builds smart business systems, custom software, AI-powered workflows, automations, dashboards and operational tools — turning messy operations into organized, growth-ready systems.";

export const metadata: Metadata = {
  // TODO: set to the real production domain (resolves OG/Twitter image URLs).
  metadataBase: new URL("https://geniriflow.com"),
  title: {
    default: `${BRAND.name} — Smart Business Systems & Custom Software`,
    template: `%s · ${BRAND.name}`,
  },
  description,
  keywords: [
    "business systems",
    "custom software",
    "AI automation",
    "AI agents",
    "CRM systems",
    "WhatsApp automation",
    "dashboards",
    "workflow automation",
  ],
  icons: { icon: "/logo.jpeg", apple: "/logo.jpeg" },
  openGraph: {
    title: `${BRAND.name} — Smart Business Systems & Custom Software`,
    description,
    type: "website",
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
  // Default language is English (LTR); the provider flips lang/dir on switch.
  return (
    <html lang="en" dir="ltr" className={`${heebo.variable} ${rubik.variable}`}>
      <body className="font-sans">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
