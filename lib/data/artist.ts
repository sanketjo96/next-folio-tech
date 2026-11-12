/**
 * Content for the artist side of the site (served at `/?artist`).
 *
 * Mirrors the Linktree at linktr.ee/laugh_with_sanket (November 2026).
 * To add something, append an item to the right section below.
 */
import type { StaticImageData } from "next/image";
import avatar from "@/public/artist/avatar.png";
import standup from "@/public/artist/standup.jpg";
import kothimbirVadi from "@/public/artist/kothimbir-vadi.jpg";

export type ArtistIcon =
  | "instagram"
  | "facebook"
  | "youtube"
  | "play"
  | "headphones"
  | "mail"
  | "code"
  | "link";

export type ArtistSocial = {
  name: string;
  url: string;
  icon: ArtistIcon;
};

export type ArtistItem = {
  title: string;
  subtitle?: string;
  url: string;
  /** Local image or a remote thumbnail URL (YouTube thumbnails are allowed in next.config). */
  thumbnail?: StaticImageData | string;
  /** Icon shown when there is no thumbnail. */
  icon?: ArtistIcon;
  /** Opens in the same tab (for links inside this site). */
  internal?: boolean;
};

export type ArtistSection = {
  id: string;
  title: string;
  /** Small line above the title, e.g. "On Zee Marathi". */
  kicker?: string;
  /** Short label for the jump bar at the top of the page. */
  short: string;
  /**
   * "feature": one cinematic card. "videos": stacked rows on phones, a grid on
   * wider screens; YouTube links play in the page. "audio": listening card.
   * "links": ticket-style call to action.
   */
  layout: "feature" | "videos" | "audio" | "links";
  items: ArtistItem[];
};

export type ArtistProfile = {
  name: string;
  handle: string;
  tagline: string;
  /** Short sticker shown near the hero figure. */
  badge: string;
  /** What he does, shown as separate chips in the hero. */
  roles: string[];
  /** Words that scroll across the marquee strip. */
  marquee: string[];
  /** Transparent cut-out portrait used in the stage hero. */
  avatar: StaticImageData;
  /** Used as the link-preview image when the page is shared. */
  shareImage: StaticImageData;
  socials: ArtistSocial[];
  sections: ArtistSection[];
};

/** YouTube's own thumbnail for a video id. */
const yt = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/** Video id and start time (seconds) for a YouTube link, or null for other links. */
export function youtubeInfo(url: string): { id: string; start: number } | null {
  try {
    const u = new URL(url);
    let id: string | null = null;
    if (u.hostname === "youtu.be") id = u.pathname.slice(1);
    else if (u.hostname.endsWith("youtube.com")) id = u.searchParams.get("v");
    if (!id) return null;
    const start = parseInt(u.searchParams.get("t") ?? u.searchParams.get("start") ?? "0", 10);
    return { id, start: Number.isFinite(start) ? start : 0 };
  } catch {
    return null;
  }
}

export const ARTIST: ArtistProfile = {
  name: "Sanket Joshi",
  handle: "@laugh_with_sanket",
  tagline: "Stand-up comedian 🎤 · Tech enthusiast 💻 · Storyteller ✍️",
  badge: "Laughs await!",
  roles: ["Stand-up comedian", "Storyteller", "Tech enthusiast"],
  marquee: ["Marathi stand-up", "ZEE5", "Chala Hawa Yeu Dya", "Short films", "Podcasts", "Audiobook"],
  avatar,
  shareImage: standup,
  socials: [
    { name: "Instagram", url: "https://instagram.com/laugh_with_sanket", icon: "instagram" },
    { name: "Facebook", url: "https://www.facebook.com/sanket.joshi.121", icon: "facebook" },
  ],
  sections: [
    {
      id: "standup",
      title: "Stand-up",
      kicker: "Now streaming",
      short: "Stand-up",
      layout: "feature",
      items: [
        {
          title: "Just Joshi Things with Sanket",
          subtitle: "Marathi stand-up · Watch on ZEE5",
          url: "https://www.zee5.com/zee5originals/details/hasvahasvi/0-6-4z51076479/just-joshi-things-with-sanket/0-1-6z51076730",
          thumbnail: standup,
        },
      ],
    },
    {
      id: "mhj",
      title: "MHJ",
      kicker: "Episodes",
      short: "MHJ",
      layout: "videos",
      items: [
        { title: "With Sameer Chaugule", url: "https://youtu.be/eVhV3SaS3ew?t=120", thumbnail: yt("eVhV3SaS3ew") },
        { title: "With Isha Day", url: "https://youtu.be/oGhoPgLUTAg?t=37", thumbnail: yt("oGhoPgLUTAg") },
        { title: "With Namrata Sambherao", url: "https://youtu.be/fXPlEUTgB6o?t=35", thumbnail: yt("fXPlEUTgB6o") },
      ],
    },
    {
      id: "chyd",
      title: "चला हवा येऊ द्या",
      kicker: "On Zee Marathi",
      short: "Chala Hawa Yeu Dya",
      layout: "videos",
      items: [
        {
          title: "'सेलिब्रिटी चड्डीवाला'",
          subtitle: "Chala Hawa Yeu Dya · Zee Marathi",
          url: "https://www.youtube.com/watch?v=Czi1NdON-w0",
          thumbnail: yt("Czi1NdON-w0"),
        },
        {
          title: "कॉमेडीचं गँगवॉर",
          subtitle: "Chala Hawa Yeu Dya · Zee Marathi",
          url: "https://youtu.be/98jrxOCdINw",
          thumbnail: yt("98jrxOCdINw"),
        },
        {
          title: "नाटकातून दिग्दर्शाचीच हकालपट्टी",
          subtitle: "Chala Hawa Yeu Dya · Zee Marathi",
          url: "https://youtu.be/hRfGeaM_kTc",
          thumbnail: yt("hRfGeaM_kTc"),
        },
      ],
    },
    {
      id: "films",
      title: "Short films & videos",
      kicker: "On screen",
      short: "Films",
      layout: "videos",
      items: [
        { title: "At Crosswalks", subtitle: "Short film", url: "https://www.youtube.com/watch?v=6BViLAov99I", thumbnail: yt("6BViLAov99I") },
        { title: "Beyond Prejudice", subtitle: "Team Kalaad", url: "https://www.youtube.com/watch?v=8uI0L9hkHU0", thumbnail: yt("8uI0L9hkHU0") },
        {
          title: "He Chandra Surya Taare",
          subtitle: "Vinda Karandikar · Marathi song",
          url: "https://www.youtube.com/watch?v=cy9H2smOflM",
          thumbnail: yt("cy9H2smOflM"),
        },
      ],
    },
    {
      id: "podcasts",
      title: "Podcasts & vlogs",
      kicker: "Conversations",
      short: "Podcasts",
      layout: "videos",
      items: [
        {
          title: "Benaras special Malaiyo, first time in Pune!",
          subtitle: "Vlog",
          url: "https://www.youtube.com/watch?v=WJ63zP-Ko-M",
          thumbnail: yt("WJ63zP-Ko-M"),
        },
        {
          title: "Comedyचा 'पंच'नामा with Akshay Joshi",
          subtitle: "Digital Gappa · Ep 23",
          url: "https://www.youtube.com/watch?v=FurIEW_awNs",
          thumbnail: yt("FurIEW_awNs"),
        },
      ],
    },
    {
      id: "audio",
      title: "Audio",
      kicker: "Listen",
      short: "Audio",
      layout: "audio",
      items: [
        {
          title: "Kothimbir Vadi: A short story",
          subtitle: "Audiobook · Google Play",
          url: "https://play.google.com/store/audiobooks/details/Kothimbir_Vadi_A_short_story?id=AQAAAEBcMm1yIM",
          thumbnail: kothimbirVadi,
        },
      ],
    },
    {
      id: "work",
      title: "Work & bookings",
      kicker: "Book the show",
      short: "Bookings",
      layout: "links",
      items: [
        {
          title: "Main portfolio",
          subtitle: "Work bio on Canva",
          url: "https://www.canva.com/design/DAG-ZDaDghw/cQfdpyGsgpQFPm_hmdy1Vw/view?utlId=h1dbb379e1c",
          icon: "link",
        },
        { title: "Collabs & bookings", subtitle: "Send me a message", url: "/contacts", icon: "mail", internal: true },
        { title: "The tech side", subtitle: "My work as a software engineer", url: "/", icon: "code", internal: true },
      ],
    },
  ],
};
