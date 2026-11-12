/**
 * Content for the artist side of the site (served at `/?artist`).
 *
 * Everything shown on the artist link-in-bio page comes from this file, so
 * adding a show, a video or a new platform is a one-line change here.
 */

export type ArtistIcon =
  | "instagram"
  | "youtube"
  | "spotify"
  | "ticket"
  | "mic"
  | "video"
  | "mail"
  | "code"
  | "link";

export type ArtistSocial = {
  name: string;
  url: string;
  icon: ArtistIcon;
};

export type ArtistLink = {
  title: string;
  description?: string;
  url: string;
  icon: ArtistIcon;
  /** Highlighted card, shown first. Use for the one thing you want clicked. */
  featured?: boolean;
  /** Opens in the same tab (for links inside this site). */
  internal?: boolean;
};

export type ArtistProfile = {
  name: string;
  handle: string;
  tagline: string;
  /** Short sticker shown on the avatar. */
  badge: string;
  socials: ArtistSocial[];
  links: ArtistLink[];
};

const INSTAGRAM_URL = "https://www.instagram.com/laugh_with_sanket";

export const ARTIST: ArtistProfile = {
  name: "Sanket Joshi",
  handle: "@laugh_with_sanket",
  // TODO(sanket): replace with your own one-liner.
  tagline: "Laugh with Sanket. Everything I'm up to, in one place.",
  badge: "Hi!",
  socials: [{ name: "Instagram", url: INSTAGRAM_URL, icon: "instagram" }],
  links: [
    {
      title: "Watch on Instagram",
      description: "Latest reels and posts",
      url: INSTAGRAM_URL,
      icon: "instagram",
      featured: true,
    },
    // TODO(sanket): add your artist links here, for example:
    // { title: "Upcoming shows", description: "Book tickets", url: "https://…", icon: "ticket" },
    // { title: "YouTube", description: "Full sets", url: "https://youtube.com/@…", icon: "youtube" },
    {
      title: "Collabs & bookings",
      description: "Send me a message",
      url: "/contacts",
      icon: "mail",
      internal: true,
    },
    {
      title: "The tech side",
      description: "My work as a software engineer",
      url: "/",
      icon: "code",
      internal: true,
    },
  ],
};
