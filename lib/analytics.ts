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

// Events reported before the Umami script has loaded wait here.
const pending: Array<[string, EventData | undefined]> = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;

function flush() {
  if (!window.umami) return false;
  for (const [name, data] of pending.splice(0)) {
    try {
      window.umami.track(name, data);
    } catch {
      // Analytics must never break the page.
    }
  }
  return true;
}

/** Reports an event from code, e.g. after a form submits successfully. */
export function track(name: string, data?: EventData) {
  if (typeof window === "undefined" || !UMAMI_WEBSITE_ID) return;
  pending.push([eventName(name), data]);
  if (flush() || flushTimer) return;
  // Retry for up to ~15s while the script loads, then give up quietly.
  let tries = 0;
  flushTimer = setInterval(() => {
    if (flush() || ++tries > 60) {
      clearInterval(flushTimer!);
      flushTimer = null;
    }
  }, 250);
}

/** Marks an element so SectionTracker reports `Seen: <name>` once per page view. */
export const seenAttrs = (name: string) => ({ "data-track-seen": name });

/** Buckets a duration so watch time reads well in the dashboard. */
export function durationBucket(ms: number) {
  const s = ms / 1000;
  if (s < 10) return "under 10s";
  if (s < 30) return "10-30s";
  if (s < 120) return "30s-2m";
  return "2m+";
}
