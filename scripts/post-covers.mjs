/**
 * Cover banners for synced LinkedIn posts (1600x400, the 4:1 header on the post page).
 * Built only from licensed real photos, never AI-generated imagery:
 *
 * 1. Claude reads the post and plans the cover: Pexels search terms for the
 *    background, plus the Wikipedia title of a public figure when one is central.
 * 2. The script fetches Pexels candidates; Claude looks at them and picks the best
 *    one and where to crop it.
 * 3. sharp crops it to 4:1 and grades it in the site's orange/magenta palette.
 * 4. For a public figure, their lead photo from Wikipedia is framed on the right,
 *    only if it is a freely licensed Wikimedia Commons file.
 * 5. Title, date and hashtags are drawn on top.
 *
 * Credits for every photo used are returned for the post page. Any failure degrades
 * gracefully: no photo, or the plain title card when there is no background either.
 */
import Anthropic from "@anthropic-ai/sdk";
import sharp from "sharp";

const W = 1600;
const H = 400;
const PHOTO = 300;
const CLAUDE_MODEL = "claude-opus-5-5";
const CANDIDATES_PER_QUERY = 5;
const WIKI_UA = "techsanket-post-sync/1.0 (https://www.techsanket.in)";
const FREE_LICENSE = /^(cc0|cc by(-sa)?\b|public domain|pd\b|pd-)/i;
const FONT = "DejaVu Sans, Helvetica, Arial, sans-serif";

const xml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);
const stripHtml = (s = "") => s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

/** Greedy word wrap by an approximate character budget per line. */
function wrap(text, maxChars, maxLines) {
  const lines = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    if (line && `${line} ${word}`.length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/[\s,.:;–—-]+$/, "")}…`;
  }
  return lines;
}

async function getBuffer(url, headers = {}) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${res.status} fetching ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

// ------------------------------------------------------------------ Claude calls

let client;
const claude = () => (client ??= new Anthropic());

/** One structured-output call; returns the parsed JSON. */
async function askClaude({ system, content, schema }) {
  const response = await claude().beta.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "medium", format: { type: "json_schema", schema } },
    system,
    messages: [{ role: "user", content }],
  });
  if (response.stop_reason === "refusal") {
    throw new Error(`Claude declined (${response.stop_details?.category ?? "no category"})`);
  }
  const block = response.content.find((b) => b.type === "text");
  if (!block) throw new Error(`Claude returned no answer (stop_reason ${response.stop_reason})`);
  return JSON.parse(block.text);
}

const PLAN_SYSTEM = `You art-direct wide 4:1 cover banners for a software engineer's blog posts, reposted from LinkedIn. Covers use real stock photos from Pexels, toned in the site's warm orange and magenta on dark charcoal, with the title overlaid on the left.

Give 2 or 3 Pexels search queries for the background. Aim for a concrete, editorial photo that captures this post's specific story or idea, not generic tech imagery (no "technology", "computer", "AI" on their own). Think in things a photographer could shoot: "press conference camera flashes", "empty office chair spotlight", "server room red alert lights". Short queries (2 to 5 words) find more.

If the post is mainly about one real, well-known public figure, give their exact English Wikipedia article title; their own photo will be framed beside the background, so the background should be the atmosphere around the story, without people's faces as the subject.`;

const PLAN_SCHEMA = {
  type: "object",
  properties: {
    public_figure_wikipedia_title: { type: ["string", "null"] },
    background_queries: { type: "array", items: { type: "string" } },
  },
  required: ["public_figure_wikipedia_title", "background_queries"],
  additionalProperties: false,
};

const PICK_SYSTEM = `You choose the background photo for a wide 4:1 blog cover (1600x400). The left ~60% will be darkened under the title, the right side stays visible, and the photo will be toned in warm orange and magenta, so colour matters less than subject, composition and mood.

Pick the candidate that best fits the post's story. Prefer: a clear subject that reads at banner size, interesting detail that can sit on the right, no prominent readable text, logos or watermarks, nothing that misrepresents the story. Then say where to centre the 4:1 crop, as fractions of the image width and height (0 = left/top, 1 = right/bottom). If none of the candidates fit, return choice -1.`;

const PICK_SCHEMA = {
  type: "object",
  properties: {
    choice: { type: "integer", description: "Candidate number, or -1 if none fit." },
    focus_x: { type: "number" },
    focus_y: { type: "number" },
    reason: { type: "string" },
  },
  required: ["choice", "focus_x", "focus_y", "reason"],
  additionalProperties: false,
};

// ---------------------------------------------------------- background (Pexels)

async function pexelsSearch(query) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&size=medium&per_page=${CANDIDATES_PER_QUERY}`;
  const res = await fetch(url, { headers: { Authorization: process.env.PEXELS_API_KEY } });
  if (!res.ok) throw new Error(`Pexels ${res.status} for "${query}"`);
  return (await res.json()).photos ?? [];
}

async function pickBackground(postText, queries, log) {
  const seen = new Set();
  const candidates = [];
  for (const q of queries.slice(0, 3)) {
    for (const p of await pexelsSearch(q)) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      candidates.push(p);
    }
  }
  if (!candidates.length) return null;

  // Claude sees small JPEG previews, numbered.
  const previews = await Promise.all(
    candidates.map(async (p) =>
      (await sharp(await getBuffer(p.src.medium)).resize({ width: 640, withoutEnlargement: true }).jpeg({ quality: 70 }).toBuffer()).toString("base64")
    )
  );
  const content = [{ type: "text", text: `<post>\n${postText}\n</post>\n\nCandidates:` }];
  candidates.forEach((p, i) => {
    content.push({ type: "text", text: `Candidate ${i}: ${p.alt || "(no description)"}` });
    content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: previews[i] } });
  });
  const pick = await askClaude({ system: PICK_SYSTEM, content, schema: PICK_SCHEMA });
  log(`  pick: ${pick.choice} of ${candidates.length} – ${pick.reason}`);
  const photo = candidates[pick.choice];
  if (!photo) return null;

  const original = await getBuffer(`${photo.src.original}?auto=compress&w=2400`);
  return {
    buffer: await gradeBackground(original, pick.focus_x, pick.focus_y),
    credits: [
      { text: `Background: photo by ${photo.photographer} on Pexels`, url: photo.url },
      { text: "Photos provided by Pexels", url: "https://www.pexels.com" },
    ],
  };
}

/** Crop to 4:1 around the focus point, then tone into the brand palette. */
async function gradeBackground(buffer, fx, fy) {
  const { width, height } = await sharp(buffer).metadata();
  const scale = Math.max(W / width, H / height);
  const sw = Math.round(width * scale);
  const sh = Math.round(height * scale);
  const left = clamp(Math.round(clamp(fx, 0, 1) * sw - W / 2), 0, sw - W);
  const top = clamp(Math.round(clamp(fy, 0, 1) * sh - H / 2), 0, sh - H);
  const tint = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><linearGradient id="t" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#f6762a"/><stop offset="1" stop-color="#c2307a"/>
    </linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#t)" opacity="0.8"/></svg>`);
  return sharp(buffer)
    .resize(sw, sh)
    .extract({ left, top, width: W, height: H })
    .modulate({ saturation: 0.45, brightness: 1.05 })
    .composite([{ input: tint, blend: "overlay" }])
    .png()
    .toBuffer();
}

// --------------------------------------------------- public figure (Wikimedia)

async function wikiJson(url) {
  const res = await fetch(url, { headers: { "user-agent": WIKI_UA } });
  if (!res.ok) throw new Error(`Wikimedia ${res.status} on ${url}`);
  return res.json();
}

/** Lead photo of a Wikipedia article, only if it is a freely licensed Commons file. */
async function freePhoto(wikipediaTitle) {
  const summary = await wikiJson(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikipediaTitle.replace(/ /g, "_"))}`
  );
  const src = summary.originalimage?.source;
  if (!src) return null;
  const { pathname } = new URL(src); // drops tracking query params
  // Files under /wikipedia/en/ are local uploads, usually non-free (fair use): skip them.
  if (!pathname.includes("/wikipedia/commons/")) return null;
  const fileName = decodeURIComponent(pathname.split("/").pop());

  const info = await wikiJson(
    `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=900&titles=${encodeURIComponent(`File:${fileName}`)}`
  );
  const ii = Object.values(info.query?.pages ?? {})[0]?.imageinfo?.[0];
  const meta = ii?.extmetadata ?? {};
  const license = stripHtml(meta.LicenseShortName?.value);
  if (!ii || !FREE_LICENSE.test(license)) return null;

  const author = stripHtml(meta.Artist?.value) || "Unknown author";
  return {
    buffer: await getBuffer(ii.thumburl ?? ii.url, { "user-agent": WIKI_UA }),
    credits: [{ text: `Photo of ${summary.title}: ${author}, ${license}, via Wikimedia Commons`, url: ii.descriptionurl }],
  };
}

async function framedPhoto(buffer) {
  const mask = Buffer.from(
    `<svg width="${PHOTO}" height="${PHOTO}"><rect width="${PHOTO}" height="${PHOTO}" rx="28" fill="#fff"/></svg>`
  );
  return sharp(buffer)
    .resize(PHOTO, PHOTO, { fit: "cover", position: sharp.strategy.attention })
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

// ------------------------------------------------------------------ text overlay

function overlaySvg({ title, date, tags, hasBackground, hasPhoto }) {
  // With a photo the title must stay clear of it (~1200px), so wrap tighter and never go large.
  const lines = wrap(title, hasPhoto ? 26 : 34, 2);
  const size = lines.length > 1 || hasPhoto ? 64 : 76;
  const titleY = lines.length > 1 ? 200 : 236;
  const photoX = W - 96 - PHOTO;
  const dots = [];
  if (!hasBackground) {
    for (let x = 1080; x < W; x += 28) {
      for (let y = 24; y < H; y += 28) dots.push(`<circle cx="${x}" cy="${y}" r="1.6"/>`);
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#f6762a"/><stop offset="1" stop-color="#f0569b"/>
    </linearGradient>
    <linearGradient id="scrim" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#14161c" stop-opacity="0.94"/>
      <stop offset="0.5" stop-color="#14161c" stop-opacity="0.7"/>
      <stop offset="1" stop-color="#14161c" stop-opacity="0.05"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.5" r="0.45">
      <stop offset="0" stop-color="#f6762a" stop-opacity="0.35"/><stop offset="1" stop-color="#f6762a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="0.18"/>
    </linearGradient>
  </defs>
  ${hasBackground
    ? `<rect width="${W}" height="${H}" fill="url(#scrim)"/>`
    : `<rect width="${W}" height="${H}" fill="#1a1c23"/><rect width="${W}" height="${H}" fill="url(#glow)"/><g fill="url(#fade)">${dots.join("")}</g>`}
  ${hasPhoto ? `<rect x="${photoX - 5}" y="${(H - PHOTO) / 2 - 5}" width="${PHOTO + 10}" height="${PHOTO + 10}" rx="32" fill="url(#brand)"/>` : ""}
  <rect x="96" y="${titleY - size - 64}" width="56" height="6" rx="3" fill="url(#brand)"/>
  <text x="168" y="${titleY - size - 55}" font-family="${FONT}" font-size="22" font-weight="600" letter-spacing="4" fill="#d4d4d8">LINKEDIN NOTE · ${xml(date)}</text>
  ${lines
    .map(
      (l, i) =>
        `<text x="96" y="${titleY + i * (size + 14)}" font-family="${FONT}" font-size="${size}" font-weight="700" fill="#f5f5f5">${xml(l)}</text>`
    )
    .join("\n  ")}
  <text x="96" y="${H - 48}" font-family="${FONT}" font-size="24" font-weight="600" fill="url(#brand)">${xml(tags.join("  "))}</text>
  ${hasPhoto ? "" : `<text x="${W - 96}" y="${H - 48}" text-anchor="end" font-family="${FONT}" font-size="22" fill="#d4d4d8">techsanket.in</text>`}
</svg>`;
}

/**
 * Renders the cover to `outPath` (PNG). Returns { credits: [{ text, url }] } for every
 * licensed photo used (empty for the plain title card).
 */
export async function renderCover(outPath, { title, date, tags, text }, log = console.log) {
  let background = null;
  let photo = null;

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const plan = await askClaude({
        system: PLAN_SYSTEM,
        content: `<post>\n${text}\n</post>`,
        schema: PLAN_SCHEMA,
      });
      const figure = plan.public_figure_wikipedia_title;
      log(`  plan: figure=${figure ?? "none"}; queries=${JSON.stringify(plan.background_queries)}`);
      const [bg, ph] = await Promise.allSettled([
        process.env.PEXELS_API_KEY ? pickBackground(text, plan.background_queries, log) : null,
        figure ? freePhoto(figure) : null,
      ]);
      if (bg.status === "fulfilled") background = bg.value;
      else log(`  background failed: ${bg.reason.message}`);
      if (ph.status === "fulfilled") photo = ph.value;
      else log(`  photo failed: ${ph.reason.message}`);
      if (!process.env.PEXELS_API_KEY) log("  PEXELS_API_KEY not set, no background photo");
      if (figure && !photo) log("  no freely licensed photo of the figure");
    } catch (err) {
      log(`  cover planning failed, using title card: ${err.message}`);
    }
  } else {
    log("  ANTHROPIC_API_KEY not set, using title card");
  }

  const overlay = Buffer.from(
    overlaySvg({ title, date, tags, hasBackground: !!background, hasPhoto: !!photo })
  );
  // The overlay holds the scrim and the photo's gradient ring, so it goes under the photo.
  const layers = [{ input: overlay, left: 0, top: 0 }];
  if (photo) {
    layers.push({ input: await framedPhoto(photo.buffer), left: W - 96 - PHOTO, top: (H - PHOTO) / 2 });
  }
  const base = background
    ? sharp(background.buffer)
    : sharp({ create: { width: W, height: H, channels: 3, background: "#1a1c23" } });
  await base.composite(layers).png({ compressionLevel: 9 }).toFile(outPath);
  return { credits: [...(photo?.credits ?? []), ...(background?.credits ?? [])] };
}
