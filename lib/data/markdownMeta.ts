const WORDS_PER_MINUTE = 220;

// Headline technologies shown first on cards; anything else keeps file order.
const TAG_PRIORITY = [
  "reactjs", "react", "next.js", "nextjs", "typescript", "node.js", "nodejs",
  "graphql", "aws", "mongodb", "redux toolkit", "redux", "javascript",
];

const rank = (tag: string) => {
  const i = TAG_PRIORITY.indexOf(tag.toLowerCase());
  return i === -1 ? TAG_PRIORITY.length : i;
};

export const readingMinutes = (body: string): number =>
  Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / WORDS_PER_MINUTE));

/**
 * Pulls the bullet list under a "## Technology" heading, if the file has one.
 * Returns at most `limit` entries, best-known technologies first.
 */
export const techTags = (body: string, limit = 3): string[] => {
  const match = body.match(/##\s*Technology\s*\n([\s\S]*?)(?:\n##|\s*$)/);
  if (!match) return [];
  return match[1]
    .split("\n")
    .map((line) => line.replace(/^\s*[-*]\s*/, "").trim())
    .filter(Boolean)
    .map((tag, i) => ({ tag, i }))
    .sort((a, b) => rank(a.tag) - rank(b.tag) || a.i - b.i)
    .map(({ tag }) => tag.replace(/^ReactJS$/i, "React"))
    .slice(0, limit);
};
