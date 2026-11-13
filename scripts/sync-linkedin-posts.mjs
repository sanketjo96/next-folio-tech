#!/usr/bin/env node
/**
 * Pulls LinkedIn posts published through Typefully and writes any new ones to
 * content/posts/li-<draftId>.md, plus a cover banner at public/images/posts/li-<draftId>.png
 * (see post-covers.mjs). Existing posts are never overwritten, so a synced post can be
 * hand-edited afterwards.
 *
 *   node scripts/sync-linkedin-posts.mjs                    add new posts
 *   node scripts/sync-linkedin-posts.mjs --refresh-covers   also redraw covers of existing posts
 *
 * Env:
 *   TYPEFULLY_API_KEY        required
 *   TYPEFULLY_SOCIAL_SET_ID  required (Typefully account id)
 *   ANTHROPIC_API_KEY        optional, enables photo covers (Claude picks the photos)
 *   POSTS_AUTHOR             optional, defaults to "Sanket Joshi"
 */
import fs from "node:fs/promises";
import path from "node:path";
import { renderCover } from "./post-covers.mjs";

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

export const hashtagsFrom = (text, limit = 3) =>
  [...new Set(text.match(/#[\p{L}\p{N}_]+/gu) ?? [])].slice(0, limit);

/** Renders the cover and returns the frontmatter fields that describe it. */
async function coverFields(draftId, draft) {
  const text = postText(draft);
  await fs.mkdir(IMAGES_DIR, { recursive: true });
  const fileBase = `li-${draftId}`;
  const { credits, thumbnailPath } = await renderCover(path.join(IMAGES_DIR, `${fileBase}.png`), {
    title: titleFrom(draft.draft_title, text),
    date: publishDate(draft),
    tags: hashtagsFrom(text),
    text,
  });
  return {
    image: `/images/posts/${fileBase}.png`,
    thumbnail: thumbnailPath ? `/images/posts/${path.basename(thumbnailPath)}` : null,
    imageCredits: credits.length ? credits : null,
  };
}

/** Sets (or, for null values, removes) frontmatter keys, leaving everything else as is. */
function setFrontmatter(markdown, fields) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) throw new Error("post has no frontmatter");
  const lines = match[1].split("\n").filter((l) => !(l.split(":")[0] in fields));
  for (const [k, v] of Object.entries(fields)) if (v != null) lines.push(`${k}: ${JSON.stringify(v)}`);
  return `---\n${lines.join("\n")}\n---\n${markdown.slice(match[0].length)}`;
}

export function toMarkdown(draft, { author = POSTS_AUTHOR, cover = {} } = {}) {
  const text = postText(draft);
  const frontmatter = {
    title: titleFrom(draft.draft_title, text),
    summary: summaryFrom(text),
    ...Object.fromEntries(Object.entries(cover).filter(([, v]) => v != null)),
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
  const refresh = process.argv.includes("--refresh-covers");
  const existing = new Set(await fs.readdir(POSTS_DIR));
  const drafts = await listPublishedLinkedInDrafts();
  let added = 0;
  let refreshed = 0;

  for (const summary of drafts) {
    const fileName = `li-${summary.id}.md`;
    const filePath = path.join(POSTS_DIR, fileName);
    const isNew = !existing.has(fileName);
    if (!isNew && !refresh) continue;
    // The list endpoint only returns a truncated preview; fetch the full text.
    const draft = await api(
      `/social-sets/${TYPEFULLY_SOCIAL_SET_ID}/drafts/${summary.id}?exclude_comment_markers=true`
    );
    console.log(`${isNew ? "adding" : "refreshing cover for"} ${fileName}: ${draft.draft_title ?? summary.id}`);
    const cover = await coverFields(summary.id, draft);
    if (isNew) {
      await fs.writeFile(filePath, toMarkdown(draft, { cover }));
      added++;
    } else {
      // Only the cover fields change; hand edits to the post are kept.
      await fs.writeFile(filePath, setFrontmatter(await fs.readFile(filePath, "utf-8"), cover));
      refreshed++;
    }
  }
  console.log(`${added} new post(s), ${refreshed} cover(s) refreshed, ${drafts.length} LinkedIn post(s) checked`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
