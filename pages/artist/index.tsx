import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  ArrowUpRight,
  Check,
  Clapperboard,
  Code,
  Instagram,
  Link as LinkIcon,
  Mail,
  Mic,
  Music,
  Share2,
  Ticket,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import portrait from "@/public/author_1.png";
import { ARTIST, type ArtistIcon, type ArtistLink } from "@/lib/data/artist";
import type { AppPage } from "../_app";

const SITE_URL = "https://www.techsanket.in";
const PAGE_URL = `${SITE_URL}/?artist`;

const ICONS: Record<ArtistIcon, LucideIcon> = {
  instagram: Instagram,
  youtube: Youtube,
  spotify: Music,
  ticket: Ticket,
  mic: Mic,
  video: Clapperboard,
  mail: Mail,
  code: Code,
  link: LinkIcon,
};

const stagger = (i: number) => ({ "--i": i }) as React.CSSProperties;

function ShareButton() {
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    const data = { title: `${ARTIST.name} (${ARTIST.handle})`, url: PAGE_URL };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(PAGE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // User dismissed the share sheet, or clipboard is blocked: nothing to do.
    }
  };

  return (
    <button
      type="button"
      onClick={onShare}
      className="artist-icon-btn"
      aria-label={copied ? "Link copied" : "Share this page"}
    >
      {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
    </button>
  );
}

function LinkCard({ link, index }: { link: ArtistLink; index: number }) {
  const Icon = ICONS[link.icon];
  const body = (
    <>
      <span
        className={`grid size-12 shrink-0 place-items-center rounded-xl border-2 border-[var(--a-ink)] ${
          link.featured ? "bg-white" : "bg-[var(--a-bg)]"
        }`}
      >
        <Icon className="size-5" strokeWidth={2.25} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="artist-display block text-lg font-bold leading-tight">
          {link.title}
        </span>
        {link.description && (
          <span className="mt-0.5 block truncate text-sm text-[var(--a-soft)]">
            {link.description}
          </span>
        )}
      </span>
      <ArrowUpRight className="size-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </>
  );

  const className = `artist-card group flex items-center gap-4 rounded-2xl p-3 pr-5 ${
    link.featured ? "artist-card--featured" : ""
  }`;

  return (
    <li className="artist-rise" style={stagger(index + 4)}>
      {link.internal ? (
        <Link href={link.url} className={className}>
          {body}
        </Link>
      ) : (
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {body}
        </a>
      )}
    </li>
  );
}

const ArtistPage: AppPage = () => {
  const links = [...ARTIST.links].sort(
    (a, b) => Number(!!b.featured) - Number(!!a.featured)
  );

  return (
    <>
      <NextSeo
        title={`${ARTIST.name} · ${ARTIST.handle}`}
        description={ARTIST.tagline}
        canonical={PAGE_URL}
        openGraph={{
          url: PAGE_URL,
          title: `${ARTIST.name} · ${ARTIST.handle}`,
          description: ARTIST.tagline,
          images: [{ url: `${SITE_URL}/sj-og-image.jpg`, alt: ARTIST.name }],
        }}
        twitter={{ cardType: "summary_large_image" }}
      />

      <div className="artist min-h-[100svh]">
        <main className="mx-auto flex min-h-[100svh] w-full max-w-md flex-col px-5 pb-10 pt-5">
          {/* Top bar */}
          <div className="artist-rise flex items-center justify-between">
            <span className="artist-display rounded-full border-2 border-[var(--a-ink)] bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">
              Artist
            </span>
            <ShareButton />
          </div>

          {/* Profile */}
          <header className="mt-8 flex flex-col items-center text-center">
            <div className="artist-rise relative" style={stagger(1)}>
              <div className="size-36 overflow-hidden rounded-full border-2 border-[var(--a-ink)] bg-[var(--a-violet)] shadow-[5px_5px_0_var(--a-ink)]">
                <Image
                  src={portrait}
                  alt={ARTIST.name}
                  className="size-full scale-110 object-cover object-top pt-3"
                  sizes="144px"
                  priority
                />
              </div>
              <span className="artist-display artist-wiggle absolute -right-3 top-1 rotate-12 rounded-full border-2 border-[var(--a-ink)] bg-[var(--a-lime)] px-2.5 py-1 text-sm font-extrabold">
                {ARTIST.badge}
              </span>
            </div>

            <h1
              className="artist-display artist-rise mt-6 text-[2.6rem] font-extrabold uppercase leading-[0.95] tracking-tight"
              style={stagger(2)}
            >
              <span className="artist-mark">{ARTIST.name}</span>
            </h1>
            <p
              className="artist-rise mt-3 font-semibold text-[var(--a-violet)]"
              style={stagger(2)}
            >
              {ARTIST.handle}
            </p>
            <p
              className="artist-rise mt-2 max-w-xs text-[15px] leading-relaxed text-[var(--a-soft)]"
              style={stagger(3)}
            >
              {ARTIST.tagline}
            </p>

            {/* Socials */}
            <div
              className="artist-rise mt-6 flex flex-col items-center gap-3"
              style={stagger(3)}
            >
              <ul className="flex flex-wrap justify-center gap-2.5">
                {ARTIST.socials.map((s) => {
                  const Icon = ICONS[s.icon];
                  return (
                    <li key={s.name}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="artist-icon-btn"
                        aria-label={s.name}
                      >
                        <Icon className="size-[18px]" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </header>

          {/* Links */}
          <ul className="mt-9 flex flex-col gap-4">
            {links.map((link, i) => (
              <LinkCard key={link.title} link={link} index={i} />
            ))}
          </ul>

          <footer className="mt-auto pt-12 text-center text-xs text-[var(--a-soft)]">
            © {new Date().getFullYear()} {ARTIST.name}
          </footer>
        </main>
      </div>
    </>
  );
};

ArtistPage.standalone = true;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ["common"])),
  },
});

export default ArtistPage;
