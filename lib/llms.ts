/**
 * Builds /llms.txt (https://llmstxt.org): a plain-markdown summary of the site
 * for AI agents, generated from the same data the pages use.
 */
import { EXPERIENCE, EDUCATION, CERTIFICATIONS } from "@/lib/data/experience";
import { ARTIST } from "@/lib/data/artist";
import { TOOLKIT } from "@/lib/data/profile";
import { getPosts } from "@/lib/data/posts";
import { getProjects } from "@/lib/data/projects";
import { DEFAULT_DESCRIPTION, PROFILE_LINKS, absoluteUrl } from "@/lib/seo";
import home from "@/public/locales/en/home.json";

const oneLine = (s = "") => s.replace(/\s+/g, " ").trim();

export async function buildLlmsTxt(): Promise<string> {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);
  const out: string[] = [];

  out.push("# Sanket Joshi", "", `> ${DEFAULT_DESCRIPTION}`, "");
  out.push(oneLine(home.intro), "", oneLine(home.contactBody), "");
  out.push(
    "This site has two sides: the tech portfolio (default) and an artist link page for stand-up comedy at /artist (also /?artist).",
    "",
  );

  out.push("## Profiles", "");
  out.push(`- [Website](${absoluteUrl("/")}): tech portfolio`);
  out.push(`- [LinkedIn](${PROFILE_LINKS.linkedin}): full work history`);
  out.push(`- [GitHub](${PROFILE_LINKS.github})`);
  out.push(`- [Instagram ${ARTIST.handle}](${PROFILE_LINKS.instagram}): comedy`);
  out.push(`- [BookMyShow](${PROFILE_LINKS.bookmyshow}): registered artist profile`);
  out.push(`- [Contact form](${absoluteUrl("/contacts")}): roles, consulting, collaborations, bookings`, "");

  out.push("## Experience", "");
  for (const e of EXPERIENCE) {
    const roles = e.roles.map((r) => `${r.title} (${r.period})`).join("; ");
    const where = [e.context, e.location].filter(Boolean).join(", ");
    out.push(`- **${e.company}**${where ? ` (${where})` : ""}: ${roles}. ${e.highlights.join(" ")}`);
  }
  out.push("");
  out.push(`Skills: ${TOOLKIT.join(", ")}.`, "");
  out.push(`Education: ${EDUCATION.map((e) => `${e.detail}, ${e.name} (${e.period})`).join("; ")}.`, "");
  out.push(`Certifications: ${CERTIFICATIONS.join("; ")}.`, "");

  out.push("## Writing", "");
  for (const p of posts) {
    out.push(`- [${p.title}](${absoluteUrl(`/posts/${p.id}`)}): ${oneLine(p.summary)}`);
  }
  out.push("");

  out.push("## Projects", "");
  for (const p of projects) {
    out.push(`- [${p.title}](${absoluteUrl(`/projects/${p.id}`)}): ${oneLine(p.summary)}`);
  }
  out.push("");

  out.push("## Artist side: stand-up comedy", "");
  out.push(`${ARTIST.name} performs Marathi stand-up as ${ARTIST.handle}. Page: ${absoluteUrl("/artist")}`, "");
  for (const section of ARTIST.sections) {
    const links = section.items
      .filter((i) => !i.internal)
      .map((i) => `[${i.title}${i.subtitle ? ` (${i.subtitle})` : ""}](${i.url})`);
    if (links.length) out.push(`- ${section.short}: ${links.join(", ")}`);
  }
  out.push("");

  out.push("## Optional", "");
  out.push(`- [Sitemap](${absoluteUrl("/sitemap.xml")})`);

  return out.join("\n") + "\n";
}
