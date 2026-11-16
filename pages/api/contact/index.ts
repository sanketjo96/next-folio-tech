import { renderEmail, type EmailRow } from "@/components/ui/Business/Email/template";
import { BookingFormSchema, ContactFormSchema } from "@/lib/schema/schemas";
import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

/**
 * Env:
 *   RESEND_API_KEY  required
 *   CONTACT_FROM    e.g. "Sanket Joshi <hello@techsanket.in>" (domain must be verified in Resend).
 *                   Falls back to Resend's sandbox sender, which only delivers to the
 *                   address the Resend account is registered with.
 *   CONTACT_TO      inbox that receives enquiries (comma-separated for several).
 */
const FROM = process.env.CONTACT_FROM || "Next Folio <onboarding@resend.dev>";
const TO = (process.env.CONTACT_TO || "sanketjoshi96@gmail.com").split(",").map((s) => s.trim());

type Built = { subject: string; replyTo: string; rows: EmailRow[]; heading: string; bot: boolean };

function build(body: unknown): Built | null {
  const b = (body ?? {}) as Record<string, unknown>;

  if (b.kind === "booking") {
    const parsed = BookingFormSchema.safeParse(b.booking);
    if (!parsed.success) return null;
    const d = parsed.data;
    return {
      bot: !!d.website,
      replyTo: d.email,
      subject: `Show booking: ${d.eventType} · ${d.city}${d.date ? ` · ${d.date}` : ""} — ${d.name}`,
      heading: "New show booking request",
      rows: [
        ["Name", d.name],
        ["Email", d.email],
        ["Phone", d.phone],
        ["Show type", d.eventType],
        ["Date", d.date],
        ["City", d.city],
        ["Details", d.details],
      ],
    };
  }

  // Default: the tech-site contact form (sends `{ message: {...} }`).
  const parsed = ContactFormSchema.safeParse(b.message);
  if (!parsed.success) return null;
  const d = parsed.data;
  return {
    bot: !!d.website,
    replyTo: d.email,
    subject: `New enquiry from techsanket.in — ${d.name}`,
    heading: "New message from the contact form",
    rows: [
      ["Name", d.name],
      ["Email", d.email],
      ["Message", d.message],
    ],
  };
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed", success: false });
  }

  // Validate on the server too: the browser-side check can be skipped.
  const mail = build(req.body);
  if (!mail) {
    return res.status(400).json({ message: "Invalid details", success: false });
  }
  // Honeypot filled: pretend it worked so bots don't retry.
  if (mail.bot) return res.status(201).json({ success: true });

  if (!process.env.RESEND_API_KEY) {
    return res.status(503).json({ message: "Contact form is not configured", success: false });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { html, text } = renderEmail(mail.heading, mail.rows);
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: mail.replyTo,
    subject: mail.subject,
    html,
    text,
  });

  if (error) {
    // Logged for Vercel runtime logs; not echoed to the browser.
    console.error("Contact email failed:", error.name, error.message);
    return res.status(502).json({ message: "Could not send message", success: false });
  }
  return res.status(201).json({ success: true, id: data?.id });
};

export default handler;
