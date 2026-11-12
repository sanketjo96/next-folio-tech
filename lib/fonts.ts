import { Bricolage_Grotesque } from "next/font/google";

// The tech site uses the device's own system font (same as the original site).
const SYSTEM_SANS =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"';

// Display face for the artist (link-in-bio) side only.
export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
});

// Exposed on :root (see _app) so portalled UI such as drawers and toasts
// gets the same fonts as the page.
export const fontRootCss = `:root {
  --font-sans: ${SYSTEM_SANS};
  --font-artist: ${bricolage.style.fontFamily};
}`;
