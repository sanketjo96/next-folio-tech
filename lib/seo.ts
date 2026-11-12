/**
 * Shared facts for search engines and AI agents: canonical URLs and
 * schema.org structured data. Keep in sync with lib/data/experience.ts.
 */
import { EXPERIENCE, EDUCATION } from "@/lib/data/experience";
import { ARTIST } from "@/lib/data/artist";
import { TOOLKIT } from "@/lib/data/profile";

export const SITE_URL = "https://www.techsanket.in";
export const SITE_NAME = "Sanket Joshi";
export const DEFAULT_TITLE = "Sanket Joshi | Senior Software Engineer | React, Node.js & AI";
export const DEFAULT_DESCRIPTION =
  "Sanket Joshi is a software engineer with 12+ years building modern web applications with React, TypeScript, Next.js and Node.js, and exploring Generative AI.";

/** Absolute URL for a site path, always on the English (default) locale. */
export const absoluteUrl = (path = "/") => `${SITE_URL}${path === "/" ? "/" : path}`;

export const PROFILE_LINKS = {
  linkedin: "https://www.linkedin.com/in/sanket-joshi-7baa23185",
  github: "https://github.com/sanketjo96",
  instagram: "https://www.instagram.com/laugh_with_sanket",
  facebook: "https://www.facebook.com/sanket.joshi.121",
  bookmyshow: "https://in.bookmyshow.com/person/sanket-joshi/2045344",
};

const current = EXPERIENCE.find((e) => e.current);

/** schema.org Person, used on the home page and referenced elsewhere by @id. */
export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: SITE_NAME,
  url: absoluteUrl("/"),
  image: absoluteUrl("/sanket-portrait.jpg"),
  jobTitle: current?.roles[0]?.title ?? "Technical Lead",
  ...(current && {
    worksFor: { "@type": "Organization", name: current.company },
  }),
  description: DEFAULT_DESCRIPTION,
  address: { "@type": "PostalAddress", addressLocality: "Pune", addressCountry: "IN" },
  alumniOf: EDUCATION.map((e) => ({ "@type": "EducationalOrganization", name: e.name })),
  knowsAbout: [
    ...TOOLKIT,
    "Frontend architecture",
    "Generative AI",
    "Engineering leadership",
    "Mentoring",
    "Stand-up comedy",
  ],
  sameAs: Object.values(PROFILE_LINKS),
};

/** schema.org ProfilePage for the artist page. */
export const artistJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: absoluteUrl("/artist"),
  name: `${ARTIST.name} (${ARTIST.handle})`,
  mainEntity: {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: ARTIST.name,
    alternateName: ARTIST.handle,
    jobTitle: "Stand-up comedian",
    description: `${ARTIST.roles.join(", ")}. Marathi stand-up on ZEE5, appearances on Zee Marathi's Chala Hawa Yeu Dya, short films, podcasts and an audiobook.`,
    image: `${SITE_URL}${ARTIST.shareImage.src}`,
    sameAs: [...ARTIST.socials.map((s) => s.url), ...ARTIST.profiles],
  },
};

/** schema.org BlogPosting / CreativeWork for a markdown post or project. */
export function articleJsonLd(opts: {
  type: "BlogPosting" | "CreativeWork";
  url: string;
  title: string;
  description: string;
  datePublished?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": opts.type,
    headline: opts.title,
    name: opts.title,
    description: opts.description,
    url: opts.url,
    mainEntityOfPage: opts.url,
    ...(opts.datePublished && { datePublished: opts.datePublished }),
    author: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: SITE_NAME, url: absoluteUrl("/") },
    inLanguage: "en",
  };
}
