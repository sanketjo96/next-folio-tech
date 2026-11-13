#!/usr/bin/env node
/**
 * Pulls LinkedIn posts published through Typefully and writes any new ones to
 * content/posts/li-<draftId>.md, plus a generated cover banner at
 * public/images/posts/li-<draftId>.png. Existing files are never overwritten, so a
 * synced post can be hand-edited afterwards (better title, image, headings).
 *
 * Env:
 *   TYPEFULLY_API_KEY        required
 *   TYPEFULLY_SOCIAL_SET_ID  required (Typefully account id)
 *   POSTS_AUTHOR             optional, defaults to "Sanket Joshi"
 */
import fs from "node:fs/promises";
import path from "node:path";

const API = "https://api.typefully.com/v2";
const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const IMAGES_DIR = path.join(process.cwd(), "public", "images", "posts");
const PAGE_SIZE = 50;

const postText = (draft) => draft.platforms.linkedin.posts.map((p) => p.text).join("\n\n");
const publishDate = (draft) =>
  (draft.linkedin_post_published_at ?? draft.published_at).slice(0, 10);

const { TYPEFULLY_API_KEY, TYPEFULLY_SOCIAL_SET_ID, POSTS_AUTHOR = "Sanket Joshi" } = process.env;

async function api(pathname) {
  const res = await fetch(`${API}${pathname}`, {
    headers: { Authorization: `Bearer ${TYPEFULLY_API_KEY}` },
  });
  if (!res.ok) {
    throw new Error(`Typefully ${res.status} on ${pathname}: ${await res.text()}`);
  }
  return res.json();
}

async function listPublishedLinkedInDrafts() {
  const drafts = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const page = await api(
      `/social-sets/${TYPEFULLY_SOCIAL_SET_ID}/drafts?status=published&order_by=-published_at&limit=${PAGE_SIZE}&offset=${offset}`
    );
    drafts.push(...page.results.filter((d) => d.linkedin_published_url));
    if (!page.next) return drafts;
  }
}

/** "LinkedIn – MCP: 4 rules for tech leads – 2026-11-11" -> "MCP: 4 rules for tech leads" */
export function titleFrom(draftTitle, text) {
  const cleaned = (draftTitle ?? "")
    .replace(/^\s*linkedin\s*[–—-]\s*/i, "")
    .replace(/\s*[–—-]\s*\d{4}-\d{2}-\d{2}\s*$/, "")
    .trim();
  if (cleaned) return cleaned;
  const firstLine = text.split("\n").find((l) => l.trim()) ?? "LinkedIn post";
  return firstLine.length > 80 ? `${firstLine.slice(0, 77).trimEnd()}…` : firstLine.trim();
}

/** First paragraph of the post, capped for list cards and meta descriptions. */
export function summaryFrom(text) {
  const firstPara = text.trim().split(/\n\s*\n/)[0].replace(/\s*\n\s*/g, " ");
  return firstPara.length > 200 ? `${firstPara.slice(0, 197).trimEnd()}…` : firstPara;
}

/**
 * LinkedIn text is plain text with meaningful single line breaks. The site
 * renders posts as MDX, so escape characters MDX/Markdown would interpret
 * ({ } < > * _ ` \ and a leading #) and turn single newlines into hard breaks.
 */
export function bodyFrom(text) {
  return text
    .trim()
    .split(/\n\s*\n/)
    .map((para) =>
      para
        .split("\n")
        .map((line) =>
          line
            .replace(/[\\`*_{}<>[\]]/g, (c) => `\\${c}`)
            .replace(/^(\s*)(#{1,6}\s)/, "$1\\$2")
            .replace(/^(\s*)(\d+)\.(\s)/, "$1$2\\.$3")
            .replace(/^(\s*)([-+])(\s)/, "$1\\$2$3")
        )
        .join("  \n")
    )
    .join("\n\n");
}

const xml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);

/** Greedy word wrap by an approximate character budget per line. */
function wrap(text, maxChars, maxLines) {
  const lines = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    if (line && (line + " " + word).length > maxChars) {
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

export const hashtagsFrom = (text, limit = 3) =>
  [...new Set(text.match(/#[\p{L}\p{N}_]+/gu) ?? [])].slice(0, limit);

/**
 * Cover banner (1600x400, matching the 4:1 header on the post page) in the
 * site's palette: dark ground, orange→pink brand gradient, title + hashtags.
 */
export function coverSvg({ title, date, tags }) {
  const W = 1600;
  const H = 400;
  const lines = wrap(title, 34, 2);
  const size = lines.length > 1 ? 64 : 76;
  const titleY = lines.length > 1 ? 200 : 236;
  const dots = [];
  for (let x = 1080; x < W; x += 28) {
    for (let y = 24; y < H; y += 28) dots.push(`<circle cx="${x}" cy="${y}" r="1.6"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#f6762a"/><stop offset="1" stop-color="#f0569b"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.5" r="0.45">
      <stop offset="0" stop-color="#f6762a" stop-opacity="0.35"/><stop offset="1" stop-color="#f6762a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="0.18"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#1a1c23"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <g fill="url(#fade)">${dots.join("")}</g>
  <rect x="96" y="${titleY - size - 64}" width="56" height="6" rx="3" fill="url(#brand)"/>
  <text x="168" y="${titleY - size - 55}" font-family="DejaVu Sans, Helvetica, Arial, sans-serif" font-size="22" font-weight="600" letter-spacing="4" fill="#a1a1aa">LINKEDIN NOTE · ${xml(date)}</text>
  ${lines
    .map(
      (l, i) =>
        `<text x="96" y="${titleY + i * (size + 14)}" font-family="DejaVu Sans, Helvetica, Arial, sans-serif" font-size="${size}" font-weight="700" fill="#f5f5f5">${xml(l)}</text>`
    )
    .join("\n  ")}
  <text x="96" y="${H - 48}" font-family="DejaVu Sans, Helvetica, Arial, sans-serif" font-size="24" font-weight="600" fill="url(#brand)">${xml(tags.join("  "))}</text>
  <text x="${W - 96}" y="${H - 48}" text-anchor="end" font-family="DejaVu Sans, Helvetica, Arial, sans-serif" font-size="22" fill="#a1a1aa">techsanket.in</text>
</svg>`;
}

async function writeCover(fileBase, meta) {
  const { default: sharp } = await import("sharp");
  await fs.mkdir(IMAGES_DIR, { recursive: true });
  const out = path.join(IMAGES_DIR, `${fileBase}.png`);
  await sharp(Buffer.from(coverSvg(meta))).png({ compressionLevel: 9 }).toFile(out);
  return `/images/posts/${fileBase}.png`;
}

export function toMarkdown(draft, { author = POSTS_AUTHOR, image } = {}) {
  const text = postText(draft);
  const frontmatter = {
    title: titleFrom(draft.draft_title, text),
    summary: summaryFrom(text),
    ...(image ? { image } : {}),
    author,
    publishDate: publishDate(draft),
    source: "linkedin",
    linkedinUrl: draft.linkedin_published_url,
  };
  // JSON strings are valid YAML double-quoted scalars, so this is safe for any text.
  const yaml = Object.entries(frontmatter)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join("\n");
  return `---\n${yaml}\n---\n\n${bodyFrom(text)}\n`;
}

async function main() {
  if (!TYPEFULLY_API_KEY || !TYPEFULLY_SOCIAL_SET_ID) {
    throw new Error("TYPEFULLY_API_KEY and TYPEFULLY_SOCIAL_SET_ID must be set");
  }
  const existing = new Set(await fs.readdir(POSTS_DIR));
  const drafts = await listPublishedLinkedInDrafts();
  let added = 0;

  for (const summary of drafts) {
    const fileName = `li-${summary.id}.md`;
    if (existing.has(fileName)) continue;
    // The list endpoint only returns a truncated preview; fetch the full text.
    const draft = await api(
      `/social-sets/${TYPEFULLY_SOCIAL_SET_ID}/drafts/${summary.id}?exclude_comment_markers=true`
    );
    const text = postText(draft);
    const image = await writeCover(`li-${summary.id}`, {
      title: titleFrom(draft.draft_title, text),
      date: publishDate(draft),
      tags: hashtagsFrom(text),
    });
    await fs.writeFile(path.join(POSTS_DIR, fileName), toMarkdown(draft, { image }));
    console.log(`added ${fileName}: ${draft.draft_title ?? summary.id}`);
    added++;
  }
  console.log(`${added} new post(s), ${drafts.length} LinkedIn post(s) checked`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
