import { getInvitation, inviteTitle } from "@/lib/invitation";

/** ICS wants basic-format UTC: 20260618T160000Z. */
function toIcsUtc(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** RFC 5545 escaping for TEXT values. */
function escapeIcs(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * "Add to calendar" — serves the event as an .ics file, which every phone and
 * desktop calendar knows how to open.
 */
export function GET(_req: Request, { params }: { params: { slug: string } }) {
  const inv = getInvitation(params.slug);
  if (!inv) return new Response("Not found", { status: 404 });

  const location = `${inv.venue.name}, ${inv.venue.address}`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//GeniriFlow//Invitation//HE",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${inv.slug}@geniriflow.com`,
    `DTSTAMP:${toIcsUtc(new Date().toISOString())}`,
    `DTSTART:${toIcsUtc(inv.startsAt)}`,
    `DTEND:${toIcsUtc(inv.endsAt)}`,
    `SUMMARY:${escapeIcs(`${inv.eyebrow} ${inviteTitle(inv)}`)}`,
    `LOCATION:${escapeIcs(location)}`,
    `GEO:${inv.venue.lat};${inv.venue.lng}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcs(`מחר חוגגים — ${inviteTitle(inv)}`)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return new Response(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${inv.slug}.ics"`,
    },
  });
}
