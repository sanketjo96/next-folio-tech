/**
 * Generates the link-preview (Open Graph) images for the artist pages
 * (1200x630, kept under ~300 KB for WhatsApp):
 *   public/artist/og-artist.jpg  for /artist
 *   public/artist/og-acting.jpg  for /artist/acting (no stand-up, no handle)
 *
 * It mirrors the /artist hero: dark comedy-club stage, spotlight, curtains,
 * the cut-out portrait and the name in the condensed poster font.
 *
 * Run after changing the portrait, name or tagline:
 *   node scripts/artist-og.mjs
 *
 * Uses the image renderer bundled with Next.js (@vercel/og / satori), and
 * downloads the static Bricolage Grotesque cuts from Google Fonts.
 */
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { ImageResponse } = require("next/dist/compiled/@vercel/og/index.node.js");
const sharp = require("sharp");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VARIANTS = [
  {
    out: "public/artist/og-artist.jpg",
    word: "Laugh",
    sticker: "Laughs await!",
    eyebrow: "Live on stage",
    chips: ["Stand-up comedian", "Storyteller"],
    handle: "@laugh_with_sanket",
  },
  {
    out: "public/artist/og-acting.jpg",
    word: "Action",
    sticker: "Action!",
    eyebrow: "On screen",
    chips: ["Actor", "Storyteller"],
    handle: null,
  },
];
const W = 1200;
const H = 630;

const C = {
  bg: "#0d0a09",
  ink: "#f7efe5",
  muted: "rgba(247,239,229,0.66)",
  line: "rgba(247,239,229,0.18)",
  orange: "#ff6b2c",
  amber: "#ffc861",
};

/** Minimal element helper (satori takes plain React-like objects). */
const h = (type, style, ...children) => ({
  type,
  props: { style: { display: "flex", ...style }, children: children.flat() },
});
const img = (src, style) => ({ type: "img", props: { src, style } });

async function font(css2Query) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${css2Query}`)).text();
  const url = css.match(/url\((https:[^)]+\.ttf)\)/)?.[1];
  if (!url) throw new Error(`No TTF for ${css2Query}`);
  return Buffer.from(await (await fetch(url)).arrayBuffer());
}

const [poster, body, avatar] = await Promise.all([
  font("Bricolage+Grotesque:opsz,wdth,wght@96,75,800"),
  font("Bricolage+Grotesque:wght@600"),
  readFile(path.join(root, "public/artist/avatar.png")),
]);
const avatarSrc = `data:image/png;base64,${avatar.toString("base64")}`;

const curtain = (side) =>
  h("div", {
    position: "absolute",
    top: 0,
    [side]: 0,
    width: 150,
    height: H,
    backgroundImage:
      "repeating-linear-gradient(90deg, rgba(0,0,0,0.45) 0px, rgba(0,0,0,0.45) 6px, rgba(0,0,0,0) 6px, rgba(0,0,0,0) 22px, rgba(255,255,255,0.05) 22px, rgba(255,255,255,0.05) 26px, rgba(0,0,0,0) 26px, rgba(0,0,0,0) 34px), linear-gradient(180deg, #5a0e17, #7a1220 40%, #3a0910)",
    ...(side === "left" ? { borderBottomRightRadius: "60% 18%" } : { borderBottomLeftRadius: "60% 18%" }),
    opacity: 0.95,
  });

const chip = (text) =>
  h(
    "div",
    {
      border: `2px solid ${C.line}`,
      borderRadius: 999,
      padding: "7px 16px",
      fontSize: 22,
      color: C.muted,
    },
    text,
  );

const banner = (v) => h(
  "div",
  {
    position: "relative",
    width: W,
    height: H,
    backgroundColor: C.bg,
    backgroundImage:
      "radial-gradient(ellipse 45% 85% at 66% -8%, rgba(255,200,97,0.36), rgba(255,200,97,0.08) 55%, rgba(255,200,97,0) 75%), radial-gradient(ellipse 70% 30% at 50% 100%, rgba(255,107,44,0.20), rgba(255,107,44,0) 70%)",
    fontFamily: "Body",
    color: C.ink,
    overflow: "hidden",
  },
  curtain("left"),
  curtain("right"),

  // Faint outlined "LAUGH" behind the figure, like the hero.
  h(
    "div",
    {
      position: "absolute",
      top: 30,
      left: 560,
      fontFamily: "Poster",
      fontSize: 250,
      lineHeight: 1,
      color: "transparent",
      WebkitTextStroke: "2px rgba(247,239,229,0.14)",
      textTransform: "uppercase",
    },
    v.word,
  ),

  // Floor glow + portrait in the spotlight.
  h("div", {
    position: "absolute",
    left: 640,
    bottom: -40,
    width: 420,
    height: 90,
    borderRadius: "50%",
    backgroundColor: "rgba(255,107,44,0.35)",
    boxShadow: "0 0 80px 50px rgba(255,107,44,0.25)",
  }),
  img(avatarSrc, { position: "absolute", right: 110, bottom: -6, width: 540, height: 540 }),

  // Sticker
  h(
    "div",
    {
      position: "absolute",
      top: 150,
      right: 120,
      transform: "rotate(10deg)",
      backgroundColor: C.amber,
      color: C.bg,
      borderRadius: 999,
      padding: "10px 22px",
      fontSize: 26,
      fontWeight: 600,
    },
    v.sticker,
  ),

  // Text block
  h(
    "div",
    { position: "absolute", left: 185, top: 0, height: H, flexDirection: "column", justifyContent: "center" },
    h(
      "div",
      { fontSize: 24, letterSpacing: 7, color: C.amber, textTransform: "uppercase" },
      v.eyebrow,
    ),
    h(
      "div",
      {
        flexDirection: "column",
        marginTop: 14,
        fontFamily: "Poster",
        fontSize: 168,
        lineHeight: 0.86,
        textTransform: "uppercase",
      },
      h("div", {}, "Sanket"),
      h("div", { color: C.orange }, "Joshi"),
    ),
    h(
      "div",
      { marginTop: 30, gap: 10 },
      ...v.chips.map(chip),
    ),
    ...(v.handle
      ? [
          h(
            "div",
            { marginTop: 26, fontSize: 28, color: C.ink, alignItems: "center", gap: 10 },
            h("div", { width: 12, height: 12, borderRadius: 999, backgroundColor: C.orange }),
            v.handle,
          ),
        ]
      : []),
  ),
);

for (const v of VARIANTS) {
  const res = new ImageResponse(banner(v), {
    width: W,
    height: H,
    fonts: [
      { name: "Poster", data: poster, weight: 800, style: "normal" },
      { name: "Body", data: body, weight: 600, style: "normal" },
    ],
  });
  const png = Buffer.from(await res.arrayBuffer());
  const out = path.join(root, v.out);
  await writeFile(out, await sharp(png).flatten({ background: C.bg }).jpeg({ quality: 86, mozjpeg: true }).toBuffer());
  console.log(`Wrote ${v.out}`);
}
