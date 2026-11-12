import type { StaticImageData } from "next/image";
import portrait from "@/public/author_1.png";
import stagePhoto from "@/public/artist/standup.jpg";

/**
 * Profile content for the tech home page that isn't translated copy.
 *
 * TODO(sanket): swap HERO_PORTRAIT for a better portrait when available
 * (drop it in /public and import it here).
 */
export const HERO_PORTRAIT: StaticImageData = portrait;
export const BEYOND_PHOTO: StaticImageData = stagePhoto;

export const CURRENTLY_INTO = [
  "Founding tech lead, Proxta",
  "Cloud-native platforms",
  "Growing engineering teams",
];

/** Everyday toolkit row; matches the stack named across the LinkedIn roles. */
export const TOOLKIT = [
  "React",
  "TypeScript",
  "Node.js",
  "Angular",
  "GraphQL",
  "AWS",
  "Cypress",
  "CI/CD",
];

/** Shown in the "short version" code line in the approach section. */
export const SHORT_VERSION = 'git commit -m "make it work, make it fast, then teach it"';
