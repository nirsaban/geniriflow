import { getInvitation } from "@/lib/invitation";

const STATUSES = new Set(["yes", "no", "maybe"]);

/**
 * Receives an RSVP from an invitation page.
 *
 * TODO: forward to the real destination per client (Google Sheet, CRM, or a
 * WhatsApp message to the hosts). For now the answer is validated and logged,
 * so the form is end-to-end testable without wiring an external service.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  const { slug, name, phone, status, guests } = (body ?? {}) as Record<string, unknown>;

  if (typeof slug !== "string" || !getInvitation(slug)) {
    return Response.json({ error: "unknown invitation" }, { status: 404 });
  }
  if (typeof name !== "string" || name.trim().length < 2) {
    return Response.json({ error: "name required" }, { status: 400 });
  }
  if (typeof status !== "string" || !STATUSES.has(status)) {
    return Response.json({ error: "invalid status" }, { status: 400 });
  }

  const count = Number(guests);
  if (!Number.isInteger(count) || count < 0 || count > 20) {
    return Response.json({ error: "invalid guest count" }, { status: 400 });
  }

  console.info("[rsvp]", {
    slug,
    name: name.trim(),
    phone: typeof phone === "string" ? phone.trim() : "",
    status,
    guests: count,
    at: new Date().toISOString(),
  });

  return Response.json({ ok: true });
}
