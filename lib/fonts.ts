import { Bricolage_Grotesque, Mukta } from "next/font/google";

// The tech site uses the device's own system font (same as the original site).
const SYSTEM_SANS =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"';

// Display face for the artist (link-in-bio) side only.
// Variable width/weight so the artist page can use a condensed poster style.
export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["wdth", "opsz"],
  display: "swap",
});

// Devanagari for the Marathi titles on the artist page.
export const mukta = Mukta({
  subsets: ["devanagari", "latin"],
  weight: ["500", "700", "800"],
  display: "swap",
});

// Exposed on :root (see _app) so portalled UI such as drawers and toasts
// gets the same fonts as the page.
export const fontRootCss = `:root {
  --font-sans: ${SYSTEM_SANS};
  --font-artist: ${bricolage.style.fontFamily}, ${mukta.style.fontFamily};
  --font-marathi: ${mukta.style.fontFamily};
}`;
