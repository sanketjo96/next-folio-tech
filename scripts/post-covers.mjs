/**
 * Cover banners for synced LinkedIn posts (1600x400, the 4:1 header on the post page).
 * Built only from licensed real photos, never AI-generated imagery:
 *
 * 1. Claude reads the post and plans the cover: Wikimedia Commons search terms for the
 *    background, plus the Wikipedia title of a featured subject (a person, or a
 *    product/organisation shown by its logo) when one is central.
 * 2. The script fetches freely licensed Commons candidates; Claude looks at them and picks the best
 *    one and where to crop it.
 * 3. sharp crops it to 4:1 and grades it in the site's orange/magenta palette.
 * 4. For a featured subject, the lead image of its Wikipedia article (photo or logo)
 *    is framed on the right, only if it is a freely licensed Wikimedia Commons file.
 * 5. Title, date and hashtags are drawn on top.
 * 6. A 16:9 thumbnail (photo and framed subject, no text) is saved for post lists.
 *
 * Credits for every photo used are returned for the post page. Any failure degrades
 * gracefully: no photo, or the plain title card when there is no background either.
 */
import Anthropic from "@anthropic-ai/sdk";
import sharp from "sharp";

const W = 1600;
const H = 400;
const PHOTO = 300;
const THUMB_W = 640;
const THUMB_H = 360;
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

const PLAN_SYSTEM = `You art-direct wide 4:1 cover banners for a software engineer's blog posts, reposted from LinkedIn. Covers use real, freely licensed photos from Wikimedia Commons, toned in the site's warm orange and magenta on dark charcoal, with the title overlaid on the left.

Give 2 or 3 Wikimedia Commons search queries for the background. Aim for a concrete, editorial photo that captures this post's specific story or idea, not generic tech imagery (no "technology", "computer", "AI" on their own). Think in things a photographer could shoot: "press conference camera flashes", "empty office chair spotlight", "server room red alert lights". When the post is about an idea rather than an event, find a real-world visual metaphor for its point and search for that: connecting tools under human control can be "telephone switchboard operators"; staying accountable while automation does the work can be "airline pilots cockpit". Commons is a photo archive, not a stock site, so short, literal queries (2 to 4 words naming visible things) find more than moods or concepts.

If the post is mainly about one real, well-known public figure, or one specific product, protocol or organisation, give the exact English Wikipedia article title as featured_wikipedia_title: its lead image (their photo, or the product's logo) will be framed beside the background. Never feature a person the post does not name or discuss. When something is featured, the background should be the atmosphere around the story, without people's faces as the subject.`;

const PLAN_SCHEMA = {
  type: "object",
  properties: {
    featured_wikipedia_title: { type: ["string", "null"] },
    background_queries: { type: "array", items: { type: "string" } },
  },
  required: ["featured_wikipedia_title", "background_queries"],
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

// ------------------------------------------------- background (Wikimedia Commons)

/**
 * Freely licensed, landscape, large-enough photos on Commons matching `query`.
 * Each candidate carries a small preview URL, its credit and its file title.
 */
async function commonsSearch(query) {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6" +
    `&gsrlimit=${CANDIDATES_PER_QUERY * 3}&gsrsearch=${encodeURIComponent(`${query} filetype:bitmap`)}` +
    "&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=500";
  const json = await wikiJson(url);
  const pages = Object.values(json.query?.pages ?? {}).sort((a, b) => a.index - b.index);
  const out = [];
  for (const page of pages) {
    const ii = page.imageinfo?.[0];
    if (!ii || !/^image\/(jpeg|png)$/.test(ii.mime)) continue;
    if (ii.width < 1600 || ii.width / ii.height < 1.2) continue; // need a wide, sharp source
    const meta = ii.extmetadata ?? {};
    const license = stripHtml(meta.LicenseShortName?.value);
    if (!FREE_LICENSE.test(license)) continue;
    out.push({
      id: page.title,
      preview: ii.thumburl,
      description: stripHtml(meta.ImageDescription?.value).slice(0, 200) || page.title,
      credit: {
        text: `Background: ${stripHtml(meta.Artist?.value) || "Unknown author"}, ${license}, via Wikimedia Commons`,
        url: ii.descriptionurl,
      },
    });
    if (out.length === CANDIDATES_PER_QUERY) break;
  }
  return out;
}

async function commonsImage(fileTitle, width) {
  const json = await wikiJson(
    `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&iiurlwidth=${width}&titles=${encodeURIComponent(fileTitle)}`
  );
  const ii = Object.values(json.query?.pages ?? {})[0]?.imageinfo?.[0];
  if (!ii) throw new Error(`no image info for ${fileTitle}`);
  return getBuffer(ii.thumburl ?? ii.url, { "user-agent": WIKI_UA });
}

async function pickBackground(postText, queries, log) {
  const seen = new Set();
  const candidates = [];
  for (const q of queries.slice(0, 3)) {
    for (const c of await commonsSearch(q)) {
      if (seen.has(c.id)) continue;
      seen.add(c.id);
      candidates.push(c);
    }
  }
  if (!candidates.length) {
    log("  no freely licensed background candidates found");
    return null;
  }

  // Claude sees small JPEG previews, numbered. Unfetchable previews are dropped.
  const previews = await Promise.allSettled(
    candidates.map(async (c) =>
      (
        await sharp(await getBuffer(c.preview, { "user-agent": WIKI_UA }))
          .resize({ width: 500, withoutEnlargement: true })
          .jpeg({ quality: 70 })
          .toBuffer()
      ).toString("base64")
    )
  );
  const usable = candidates
    .map((c, i) => ({ ...c, data: previews[i].status === "fulfilled" ? previews[i].value : null }))
    .filter((c) => c.data);
  if (!usable.length) return null;

  const content = [{ type: "text", text: `<post>\n${postText}\n</post>\n\nCandidates:` }];
  usable.forEach((c, i) => {
    content.push({ type: "text", text: `Candidate ${i}: ${c.description}` });
    content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: c.data } });
  });
  const pick = await askClaude({ system: PICK_SYSTEM, content, schema: PICK_SCHEMA });
  log(`  pick: ${pick.choice} of ${usable.length} – ${pick.reason}`);
  const chosen = usable[pick.choice];
  if (!chosen) return null;

  const original = await commonsImage(chosen.id, 1920);
  return {
    buffer: await gradeBackground(original, pick.focus_x, pick.focus_y, W, H),
    thumb: await gradeBackground(original, pick.focus_x, pick.focus_y, THUMB_W, THUMB_H),
    credits: [chosen.credit],
  };
}

/** Crop to w x h around the focus point, then tone into the brand palette. */
async function gradeBackground(buffer, fx, fy, w, h) {
  const { width, height } = await sharp(buffer).metadata();
  const scale = Math.max(w / width, h / height);
  const sw = Math.round(width * scale);
  const sh = Math.round(height * scale);
  const left = clamp(Math.round(clamp(fx, 0, 1) * sw - w / 2), 0, sw - w);
  const top = clamp(Math.round(clamp(fy, 0, 1) * sh - h / 2), 0, sh - h);
  const tint = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="t" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#f6762a"/><stop offset="1" stop-color="#c2307a"/>
    </linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#t)" opacity="0.8"/></svg>`);
  return sharp(buffer)
    .resize(sw, sh)
    .extract({ left, top, width: w, height: h })
    .modulate({ saturation: 0.45, brightness: 1.05 })
    .composite([{ input: tint, blend: "overlay" }])
    .png()
    .toBuffer();
}

// ------------------------------------------- featured subject (Wikimedia)

async function wikiJson(url) {
  const res = await fetch(url, { headers: { "user-agent": WIKI_UA } });
  if (!res.ok) throw new Error(`Wikimedia ${res.status} on ${url}`);
  return res.json();
}

/**
 * Lead image of a Wikipedia article (a person's photo, or a product's logo), only if
 * it is a freely licensed Commons file. SVG files are treated as logos.
 */
async function featuredImage(wikipediaTitle) {
  const summary = await wikiJson(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikipediaTitle.replace(/ /g, "_"))}`
  );
  const src = summary.originalimage?.source;
  if (!src) return null;
  const { pathname } = new URL(src); // drops tracking query params
  // Files under /wikipedia/en/ are local uploads, usually non-free (fair use): skip them.
  if (!pathname.includes("/wikipedia/commons/")) return null;
  const fileName = decodeURIComponent(pathname.split("/").pop());
  // Thumbnail URLs end in "<width>px-<name>.png"; the file itself is the folder before it.
  const commonsName = pathname.includes("/thumb/") ? decodeURIComponent(pathname.split("/").at(-2)) : fileName;
  const isLogo = /\.svg$/i.test(commonsName);

  const info = await wikiJson(
    `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=900&titles=${encodeURIComponent(`File:${commonsName}`)}`
  );
  const ii = Object.values(info.query?.pages ?? {})[0]?.imageinfo?.[0];
  const meta = ii?.extmetadata ?? {};
  const license = stripHtml(meta.LicenseShortName?.value);
  if (!ii || !FREE_LICENSE.test(license)) return null;

  const author = stripHtml(meta.Artist?.value) || "Unknown author";
  const kind = isLogo ? "Logo" : "Photo";
  return {
    buffer: await getBuffer(ii.thumburl ?? ii.url, { "user-agent": WIKI_UA }),
    isLogo,
    credits: [{ text: `${kind} of ${summary.title}: ${author}, ${license}, via Wikimedia Commons`, url: ii.descriptionurl }],
  };
}

/** Rounded square: photos are cropped to fill it, logos sit whole on a light tile. */
async function framedPhoto(buffer, size, isLogo) {
  const radius = Math.round(size * 0.093);
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#fff"/></svg>`
  );
  const image = isLogo
    ? sharp({ create: { width: size, height: size, channels: 4, background: "#f5f5f4" } }).composite([
        {
          input: await sharp(buffer)
            .resize(Math.round(size * 0.68), Math.round(size * 0.68), { fit: "contain", background: "#0000" })
            .png()
            .toBuffer(),
          gravity: "center",
        },
      ])
    : sharp(buffer).resize(size, size, { fit: "cover", position: sharp.strategy.attention });
  return sharp(await image.png().toBuffer())
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

/** Brand-gradient ring behind a framed image. */
const ringSvg = (size, ring) =>
  `<rect width="${size + ring * 2}" height="${size + ring * 2}" rx="${Math.round(size * 0.107)}" fill="url(#brand)"/>`;

/** 16:9 thumbnail for post lists: the graded photo, plus the framed subject if any. No text. */
async function renderThumbnail(outPath, background, photo) {
  const layers = [];
  if (photo) {
    const size = 210;
    const ring = 4;
    const left = THUMB_W - 48 - size;
    const top = (THUMB_H - size) / 2;
    layers.push({
      input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${THUMB_W}" height="${THUMB_H}">
        <defs><linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#f6762a"/><stop offset="1" stop-color="#f0569b"/></linearGradient>
          <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.4" stop-color="#14161c" stop-opacity="0"/><stop offset="1" stop-color="#14161c" stop-opacity="0.45"/></linearGradient></defs>
        <rect width="${THUMB_W}" height="${THUMB_H}" fill="url(#shade)"/>
        <g transform="translate(${left - ring} ${top - ring})">${ringSvg(size, ring)}</g></svg>`),
      left: 0,
      top: 0,
    });
    layers.push({ input: await framedPhoto(photo.buffer, size, photo.isLogo), left, top });
  }
  const base = background
    ? sharp(background.thumb)
    : sharp({ create: { width: THUMB_W, height: THUMB_H, channels: 3, background: "#1a1c23" } });
  await base.composite(layers).jpeg({ quality: 82, mozjpeg: true }).toFile(outPath);
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
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.6" stop-color="#14161c" stop-opacity="0"/>
      <stop offset="1" stop-color="#14161c" stop-opacity="0.75"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.5" r="0.45">
      <stop offset="0" stop-color="#f6762a" stop-opacity="0.35"/><stop offset="1" stop-color="#f6762a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="0.18"/>
    </linearGradient>
  </defs>
  ${hasBackground
    ? `<rect width="${W}" height="${H}" fill="url(#scrim)"/><rect width="${W}" height="${H}" fill="url(#floor)"/>`
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
 * Renders the cover to `outPath` (PNG) and, when a photo was used, a 16:9 thumbnail
 * next to it (`<name>-thumb.jpg`). Returns { credits: [{ text, url }], thumbnailPath }
 * (no credits and a null thumbnailPath for the plain title card).
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
      const figure = plan.featured_wikipedia_title;
      log(`  plan: featured=${figure ?? "none"}; queries=${JSON.stringify(plan.background_queries)}`);
      const [bg, ph] = await Promise.allSettled([
        pickBackground(text, plan.background_queries, log),
        figure ? featuredImage(figure) : null,
      ]);
      if (bg.status === "fulfilled") background = bg.value;
      else log(`  background failed: ${bg.reason.message}`);
      if (ph.status === "fulfilled") photo = ph.value;
      else log(`  photo failed: ${ph.reason.message}`);
      if (figure && !photo) log("  no freely licensed image for the featured subject");
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
    layers.push({ input: await framedPhoto(photo.buffer, PHOTO, photo.isLogo), left: W - 96 - PHOTO, top: (H - PHOTO) / 2 });
  }
  const base = background
    ? sharp(background.buffer)
    : sharp({ create: { width: W, height: H, channels: 3, background: "#1a1c23" } });
  await base.composite(layers).png({ compressionLevel: 9 }).toFile(outPath);

  let thumbnailPath = null;
  if (background || photo) {
    thumbnailPath = outPath.replace(/\.png$/, "-thumb.jpg");
    await renderThumbnail(thumbnailPath, background, photo);
  }
  return { credits: [...(photo?.credits ?? []), ...(background?.credits ?? [])], thumbnailPath };
}
