/**
 * Web3Forms: the browser posts straight to Web3Forms, which emails the inbox
 * the access key was created for. The free plan only accepts browser-side
 * submissions, so there is no API route in between.
 *
 * The access key is public by design (it can only send to that inbox).
 * Override with NEXT_PUBLIC_WEB3FORMS_KEY / NEXT_PUBLIC_WEB3FORMS_BOOKING_KEY.
 */
const CONTACT_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "7da87e4e-3636-4701-a926-fcfed211c415";
const BOOKING_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_BOOKING_KEY || CONTACT_KEY;

export const WEB3FORMS_KEYS = { contact: CONTACT_KEY, booking: BOOKING_KEY } as const;

type Fields = Record<string, string | undefined>;

/**
 * Sends one submission. `fields` are forwarded to the email as-is (empty ones
 * are dropped). `email` becomes the reply-to address. Throws on failure.
 */
export async function sendWeb3Form(
  form: keyof typeof WEB3FORMS_KEYS,
  { subject, fromName, botcheck, fields }: { subject: string; fromName: string; botcheck?: string; fields: Fields },
) {
  const body: Record<string, string> = {
    access_key: WEB3FORMS_KEYS[form],
    subject,
    from_name: fromName,
    botcheck: botcheck ?? "",
  };
  for (const [k, v] of Object.entries(fields)) {
    if (v && v.trim()) body[k] = v.trim();
  }

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null;
  if (!res.ok || !json?.success) {
    throw new Error(`Web3Forms ${res.status}: ${json?.message ?? "no response body"}`);
  }
}
