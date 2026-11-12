import type { StaticImageData } from "next/image";
import portrait from "@/public/sanket-portrait.jpg";
import stagePhoto from "@/public/artist/standup.jpg";

/**
 * Profile content for the tech home page that isn't translated copy.
 */
export const HERO_PORTRAIT: StaticImageData = portrait;
export const BEYOND_PHOTO: StaticImageData = stagePhoto;

export const CURRENTLY_INTO = [
  "Founding tech lead, Proxta",
  "Generative AI & LLM apps",
  "System architecture",
];

/**
 * Technical expertise grouped by area. `key` maps to a translated category
 * label in home.json. Only list tools backed by the experience and projects
 * on this site.
 */
export const EXPERTISE = [
  {
    key: "expertiseFrontend",
    items: ["React.js", "TypeScript", "JavaScript", "Next.js", "Redux Toolkit"],
  },
  {
    key: "expertiseBackend",
    items: ["Node.js", "GraphQL", "REST APIs"],
  },
  {
    key: "expertiseCloud",
    items: ["AWS", "MongoDB"],
  },
  {
    key: "expertisePractices",
    items: ["System Design", "Performance Optimization", "Testing", "Code Quality", "CI/CD"],
  },
] as const;

/** Flat list of every tool above, for structured data and /llms.txt. */
export const TOOLKIT: string[] = EXPERTISE.flatMap((group) => [...group.items]);

/** Shown in the "short version" code line in the approach section. */
export const SHORT_VERSION = 'git commit -m "make it work, make it fast, then teach it"';
