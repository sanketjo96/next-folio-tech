/**
 * Cover banners for synced LinkedIn posts (1600x400, the 4:1 header on the post page).
 *
 * 1. Claude reads the post and plans the image: a background scene prompt, plus the
 *    Wikipedia title of a public figure when one person is central to the post.
 * 2. Gemini draws the background scene. It is never asked to draw a real person.
 * 3. For a public figure, a freely licensed Wikimedia Commons photo is framed on the
 *    right, with the credit returned so the page can show it.
 * 4. Title, date and hashtags are drawn on top.
 *
 * Any failure (no keys, refusal, API error, no free photo) degrades gracefully: no photo,
 * or the plain title card when there is no background either.
 */
import Anthropic from "@anthropic-ai/sdk";
import sharp from "sharp";

const W = 1600;
const H = 400;
const PHOTO = 300;
const CLAUDE_MODEL = "claude-opus-5-5";
const GEMINI_MODEL = "gemini-nano-banana-2.1";
const WIKI_UA = "techsanket-post-sync/1.0 (https://www.techsanket.in)";
const FREE_LICENSE = /^(cc0|cc by(-sa)?\b|public domain|pd\b|pd-)/i;
const FONT = "DejaVu Sans, Helvetica, Arial, sans-serif";

const xml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);
const stripHtml = (s = "") => s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

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

// ---------------------------------------------------------------- 1. plan (Claude)

const PLAN_SCHEMA = {
  type: "object",
  properties: {
    public_figure_wikipedia_title: {
      type: ["string", "null"],
      description:
        "Exact English Wikipedia article title of the one real, well-known public figure the post is mainly about (e.g. \"Jensen Huang\"). null if the post is not centred on a single public figure.",
    },
    scene_prompt: {
      type: "string",
      description: "Prompt for the background illustration.",
    },
  },
  required: ["public_figure_wikipedia_title", "scene_prompt"],
  additionalProperties: false,
};

const PLAN_SYSTEM = `You art-direct wide 4:1 cover banners for a software engineer's blog posts, which are reposted from LinkedIn.

Write a scene_prompt for an image model that captures the post's specific story or idea, not generic tech imagery. Make it vivid and editorial: a concrete visual metaphor, a mood, a lighting and colour direction (warm oranges and magentas on a dark charcoal ground fit the site), and a style such as cinematic 3D render, editorial illustration or moody photography. If a public figure is central, the scene is the backdrop for their photo, so describe the atmosphere around the story (for example a swirl of breaking-news screens, camera flashes, headlines as abstract light) without any person in it.

The image model must never draw real people, faces, readable text, letters, numbers or company logos, so do not ask for them. Keep the left half darker and calmer than the right, because the title is overlaid there.`;

async function planCover(text) {
  const client = new Anthropic();
  const response = await client.beta.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "medium", format: { type: "json_schema", schema: PLAN_SCHEMA } },
    system: PLAN_SYSTEM,
    messages: [{ role: "user", content: `<post>\n${text}\n</post>` }],
  });
  if (response.stop_reason === "refusal") {
    throw new Error(`Claude declined to plan the cover (${response.stop_details?.category ?? "no category"})`);
  }
  const block = response.content.find((b) => b.type === "text");
  if (!block) throw new Error(`Claude returned no plan (stop_reason ${response.stop_reason})`);
  return JSON.parse(block.text);
}

// ---------------------------------------------------------- 2. background (Gemini)

async function drawBackground(scenePrompt) {
  const prompt = `${scenePrompt}\n\nWide 4:1 banner. No people, no faces, no text, no letters, no numbers, no logos. Left half darker and uncluttered.`;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "x-goog-api-key": process.env.GEMINI_API_KEY, "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["IMAGE"],
          imageConfig: { aspectRatio: "4:1", imageSize: "2K" },
        },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = await res.json();
  const part = json.candidates?.[0]?.content?.parts?.findLast((p) => p.inlineData && !p.thought);
  if (!part) throw new Error(`Gemini returned no image (${json.candidates?.[0]?.finishReason ?? "no candidates"})`);
  return sharp(Buffer.from(part.inlineData.data, "base64"))
    .resize(W, H, { fit: "cover", position: "right" })
    .toBuffer();
}

// --------------------------------------------------------- 3. photo (Wikimedia)

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
  // Files under /wikipedia/en/ are local uploads, usually non-free (fair use): skip them.
  if (!src) return null;
  const { pathname } = new URL(src); // drops tracking query params
  if (!pathname.includes("/wikipedia/commons/")) return null;
  const fileName = decodeURIComponent(pathname.split("/").pop());

  const info = await wikiJson(
    `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=900&titles=${encodeURIComponent(`File:${fileName}`)}`
  );
  const page = Object.values(info.query?.pages ?? {})[0];
  const ii = page?.imageinfo?.[0];
  const meta = ii?.extmetadata ?? {};
  const license = stripHtml(meta.LicenseShortName?.value);
  if (!ii || !FREE_LICENSE.test(license)) return null;

  const img = await fetch(ii.thumburl ?? ii.url, { headers: { "user-agent": WIKI_UA } });
  if (!img.ok) throw new Error(`Wikimedia image ${img.status}`);
  const author = stripHtml(meta.Artist?.value) || "Unknown author";
  return {
    buffer: Buffer.from(await img.arrayBuffer()),
    credit: `Photo of ${summary.title}: ${author}, ${license}, via Wikimedia Commons`,
    creditUrl: ii.descriptionurl,
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

// ------------------------------------------------------------- 4. text overlay

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
      <stop offset="0" stop-color="#14161c" stop-opacity="0.92"/>
      <stop offset="0.5" stop-color="#14161c" stop-opacity="0.7"/>
      <stop offset="1" stop-color="#14161c" stop-opacity="0.1"/>
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
 * Renders the cover to `outPath` (PNG). Returns { credit, creditUrl } when a
 * licensed photo is used, else {}.
 */
export async function renderCover(outPath, { title, date, tags, text }, log = console.log) {
  let background = null;
  let photo = null;

  if (process.env.ANTHROPIC_API_KEY && process.env.GEMINI_API_KEY) {
    try {
      const plan = await planCover(text);
      log(`  plan: figure=${plan.public_figure_wikipedia_title ?? "none"}; scene=${plan.scene_prompt.slice(0, 100)}…`);
      const [bg, ph] = await Promise.allSettled([
        drawBackground(plan.scene_prompt),
        plan.public_figure_wikipedia_title ? freePhoto(plan.public_figure_wikipedia_title) : null,
      ]);
      if (bg.status === "fulfilled") background = bg.value;
      else log(`  background failed: ${bg.reason.message}`);
      if (ph.status === "fulfilled") photo = ph.value;
      else log(`  photo failed: ${ph.reason.message}`);
      if (plan.public_figure_wikipedia_title && !photo) log("  no freely licensed photo; using scene only");
    } catch (err) {
      log(`  AI cover failed, using title card: ${err.message}`);
    }
  } else {
    log("  ANTHROPIC_API_KEY / GEMINI_API_KEY not set, using title card");
  }

  const layers = [];
  if (photo) {
    layers.push({ input: await framedPhoto(photo.buffer), left: W - 96 - PHOTO, top: (H - PHOTO) / 2 });
  }
  const overlay = Buffer.from(overlaySvg({ title, date, tags, hasBackground: !!background, hasPhoto: !!photo }));
  // The overlay holds the scrim and the photo's gradient ring, so it goes under the photo.
  layers.unshift({ input: overlay, left: 0, top: 0 });

  const base = background
    ? sharp(background)
    : sharp({ create: { width: W, height: H, channels: 3, background: "#1a1c23" } });
  await base.composite(layers).png({ compressionLevel: 9 }).toFile(outPath);
  return photo ? { credit: photo.credit, creditUrl: photo.creditUrl } : {};
}
