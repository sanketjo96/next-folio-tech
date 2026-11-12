import Script from "next/script";
import { TRACKED_DOMAINS, UMAMI_SCRIPT_URL, UMAMI_WEBSITE_ID } from "@/lib/analytics";

/** Loads the Umami script when a website ID is configured. */
export default function Analytics() {
  if (!UMAMI_WEBSITE_ID) return null;
  return (
    <Script
      src={UMAMI_SCRIPT_URL}
      data-website-id={UMAMI_WEBSITE_ID}
      data-domains={TRACKED_DOMAINS}
      data-exclude-hash="true"
      strategy="afterInteractive"
    />
  );
}
