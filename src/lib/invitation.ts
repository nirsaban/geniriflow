/**
 * Data model + demo content for the digital invitations ("הזמנה דיגיטלית").
 *
 * Everything an invitation renders comes from one object, so producing a new
 * one for a client is a data edit — not a new page. `INVITATIONS` is keyed by
 * the slug used in the URL: /invitation/<slug>.
 */

export type InvitationKind = "wedding" | "barmitzvah" | "birthday" | "brit";

/** One line on the evening's timeline (reception, ceremony, party...). */
export interface ScheduleItem {
  time: string;
  title: string;
  note?: string;
}

export interface Venue {
  name: string;
  /** Street + city, shown under the venue name and used for the map links. */
  address: string;
  lat: number;
  lng: number;
  /** e.g. "אולם הגן הקסום, קומה 2" */
  hallLine?: string;
}

export interface Palette {
  /** Page background (the "paper"). */
  bg: string;
  /** Slightly deeper panel behind cards. */
  panel: string;
  /** Body text. */
  ink: string;
  /** Muted text. */
  muted: string;
  /** Foil / accent colour for rules, icons and buttons. */
  accent: string;
  /** Accent at low opacity, for washes and borders. */
  accentSoft: string;
}

export interface Invitation {
  slug: string;
  kind: InvitationKind;
  /** Small line above the names — "מתחתנים", "בר מצווה" ... */
  eyebrow: string;
  /** The stars of the evening. Two names for a wedding, one otherwise. */
  names: string[];
  /** "בנם של ..." lines, printed under the names. */
  parents?: string[];
  /** Start of the event, ISO 8601 **with** the Israel offset. */
  startsAt: string;
  /** End time, used for the calendar file. */
  endsAt: string;
  /** Human date line, e.g. "יום חמישי | כ״ז בסיוון תשפ״ו". */
  dateLabel: string;
  schedule: ScheduleItem[];
  venue: Venue;
  /** Israeli mobile in international form (no +), for the WhatsApp RSVP. */
  rsvpPhone: string;
  /** Free-text deadline shown next to the RSVP form. */
  rsvpDeadline?: string;
  /** A verse or a line of a song, set above the names. */
  quote?: string;
  /** Closing line before the footer. */
  closing?: string;
  /** Looping background track. Omit and the speaker button is hidden. */
  music?: { src: string; title: string };
  palette: Palette;
}

const IVORY: Palette = {
  bg: "#f6f1e9",
  panel: "#efe7db",
  ink: "#2a2620",
  muted: "#7a6f60",
  accent: "#9c7c4a",
  accentSoft: "rgba(156,124,74,0.16)",
};

const MIDNIGHT: Palette = {
  bg: "#0d1220",
  panel: "#141b2d",
  ink: "#eef2ff",
  muted: "#9aa6c4",
  accent: "#c9a227",
  accentSoft: "rgba(201,162,39,0.18)",
};

export const INVITATIONS: Record<string, Invitation> = {
  demo: {
    slug: "demo",
    kind: "wedding",
    eyebrow: "מתחתנים",
    names: ["נועה", "איתי"],
    parents: ["בתם של רונית ואבי לוי", "בנם של מיכל ודורון כהן"],
    startsAt: "2027-06-17T19:00:00+03:00",
    endsAt: "2027-06-18T01:00:00+03:00",
    dateLabel: "יום חמישי | י״ב בסיוון תשפ״ז | 17.6.2027",
    schedule: [
      { time: "19:00", title: "קבלת פנים", note: "בר, אוכל טוב ואנשים שאתם אוהבים" },
      { time: "20:15", title: "חופה", note: "בגן, מתחת לעצי הזית" },
      { time: "21:00", title: "המסיבה", note: "עד שהתקליטן יתעייף" },
    ],
    venue: {
      name: "אחוזת הזית",
      hallLine: "הגן האחורי",
      address: "דרך השדות 12, מושב בית חנן",
      lat: 31.9021,
      lng: 34.7642,
    },
    rsvpPhone: "972500000000",
    rsvpDeadline: "נשמח לתשובה עד 3 ביוני",
    quote: "ואירשתיך לי לעולם",
    closing: "אין מתנה גדולה מזה שתהיו איתנו",
    palette: IVORY,
  },

  "bar-mitzvah": {
    slug: "bar-mitzvah",
    kind: "barmitzvah",
    eyebrow: "בר מצווה ל",
    names: ["יהלי"],
    parents: ["בנם של שירה ואלון ברק"],
    startsAt: "2026-11-05T19:30:00+02:00",
    endsAt: "2026-11-05T23:30:00+02:00",
    dateLabel: "יום חמישי | כ״ה בחשוון תשפ״ז | 5.11.2026",
    schedule: [
      { time: "19:30", title: "קבלת פנים" },
      { time: "20:30", title: "עלייה לתורה וברכות" },
      { time: "21:00", title: "מסיבה" },
    ],
    venue: {
      name: "אולמי הרימון",
      address: "הבנים 8, רעננה",
      lat: 32.1847,
      lng: 34.8708,
    },
    rsvpPhone: "972500000000",
    rsvpDeadline: "נשמח לתשובה עד 25 באוקטובר",
    closing: "נשמח לחגוג איתכם",
    palette: MIDNIGHT,
  },
};

export function getInvitation(slug: string): Invitation | undefined {
  return INVITATIONS[slug];
}

/** "נועה & איתי" / "יהלי" */
export function inviteTitle(inv: Invitation): string {
  return inv.names.join(" & ");
}

export function googleMapsUrl(v: Venue): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${v.name} ${v.address}`,
  )}`;
}

export function wazeUrl(v: Venue): string {
  return `https://waze.com/ul?ll=${v.lat},${v.lng}&navigate=yes`;
}

/** Deep-link that opens WhatsApp with the RSVP already typed out. */
export function whatsappRsvpUrl(inv: Invitation, message: string): string {
  return `https://wa.me/${inv.rsvpPhone}?text=${encodeURIComponent(message)}`;
}
