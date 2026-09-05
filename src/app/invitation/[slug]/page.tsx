import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvitationView } from "@/components/invitation/InvitationView";
import { INVITATIONS, getInvitation, inviteTitle } from "@/lib/invitation";

interface Params {
  params: { slug: string };
}

export function generateStaticParams() {
  return Object.keys(INVITATIONS).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const inv = getInvitation(params.slug);
  if (!inv) return { title: "הזמנה" };

  const title = `${inviteTitle(inv)} · ${inv.dateLabel}`;
  const description = `${inv.eyebrow} — ${inv.venue.name}, ${inv.venue.address}. אישור הגעה בלחיצה.`;

  return {
    // The invitation stands on its own — no "· GeniriFlow" suffix.
    title: { absolute: title },
    description,
    openGraph: { title, description, type: "website", locale: "he_IL" },
    // Invitations are shared by link, not indexed.
    robots: { index: false, follow: false },
  };
}

export default function InvitationPage({ params }: Params) {
  const invitation = getInvitation(params.slug);
  if (!invitation) notFound();

  return <InvitationView invitation={invitation} />;
}
