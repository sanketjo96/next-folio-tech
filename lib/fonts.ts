import {
  Bricolage_Grotesque,
  Inter,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";

// Body copy for the tech site.
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// Editorial serif for headings on the tech site.
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

// Small labels, tags, dates.
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
});

// Display face for the artist (link-in-bio) side.
export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
});

// Exposed on :root (see _app) so portalled UI such as drawers and toasts
// gets the same fonts as the page.
export const fontRootCss = `:root {
  --font-sans: ${inter.style.fontFamily};
  --font-display: ${instrumentSerif.style.fontFamily};
  --font-mono: ${jetbrainsMono.style.fontFamily};
  --font-artist: ${bricolage.style.fontFamily};
}`;
