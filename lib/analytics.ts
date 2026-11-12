/**
 * Click and event tracking with Umami (https://umami.is): free, cookie-less.
 *
 * Tracking switches on only when NEXT_PUBLIC_UMAMI_WEBSITE_ID is set, and only
 * counts visits on the production domain. Event names are what you see in the
 * Umami "Events" table, so keep them readable.
 */

export const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
export const UMAMI_SCRIPT_URL =
  process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ?? "https://cloud.umami.is/script.js";
export const TRACKED_DOMAINS = "www.techsanket.in,techsanket.in";

type EventData = Record<string, string | number>;

declare global {
  interface Window {
    umami?: { track: (event: string, data?: EventData) => void };
  }
}

const MAX_EVENT_NAME = 50; // Umami limit

const eventName = (name: string) =>
  name.length > MAX_EVENT_NAME ? `${name.slice(0, MAX_EVENT_NAME - 1)}…` : name;

/**
 * Props that make an element report a click to Umami, without any JS handler:
 * `<a {...trackAttrs("Artist: Main portfolio", { section: "Bookings" })}>`
 */
export function trackAttrs(name: string, data: EventData = {}) {
  const attrs: Record<string, string> = { "data-umami-event": eventName(name) };
  for (const [key, value] of Object.entries(data)) {
    attrs[`data-umami-event-${key}`] = String(value);
  }
  return attrs;
}

/** Reports an event from code, e.g. after a form submits successfully. */
export function track(name: string, data?: EventData) {
  try {
    window.umami?.track(eventName(name), data);
  } catch {
    // Analytics must never break the page.
  }
}
