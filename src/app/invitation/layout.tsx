import { Frank_Ruhl_Libre } from "next/font/google";

/**
 * Invitations get their own display face — a Hebrew serif with the printed,
 * ceremonial feel the landing page's Rubik deliberately does not have. It
 * rebinds `--font-display` for this subtree only.
 */
const frankRuhl = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500"],
  variable: "--font-display",
  display: "swap",
});

export default function InvitationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={frankRuhl.variable}>{children}</div>;
}
