import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  ArrowUpRight,
  Check,
  Code,
  Facebook,
  Headphones,
  Instagram,
  Link as LinkIcon,
  Mail,
  Play,
  Share2,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import {
  ARTIST,
  type ArtistIcon,
  type ArtistItem,
  type ArtistSection,
} from "@/lib/data/artist";
import type { AppPage } from "../_app";

const SITE_URL = "https://www.techsanket.in";
const PAGE_URL = `${SITE_URL}/?artist`;
const TITLE = `${ARTIST.name} · ${ARTIST.handle}`;

const ICONS: Record<ArtistIcon, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  play: Play,
  headphones: Headphones,
  mail: Mail,
  code: Code,
  link: LinkIcon,
};

const stagger = (i: number) => ({ "--i": i }) as React.CSSProperties;

function ShareButton() {
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: TITLE, url: PAGE_URL });
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

/** Anchor that opens external links in a new tab and keeps internal ones in-app. */
function ItemLink({
  item,
  className,
  children,
}: {
  item: ArtistItem;
  className: string;
  children: React.ReactNode;
}) {
  return item.internal ? (
    <Link href={item.url} className={className}>
      {children}
    </Link>
  ) : (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

function FeatureCard({ item }: { item: ArtistItem }) {
  return (
    <ItemLink item={item} className="artist-card artist-card--featured group block overflow-hidden rounded-2xl">
      {item.thumbnail && (
        <div className="relative aspect-video border-b-2 border-[var(--a-ink)]">
          <Image
            src={item.thumbnail}
            alt=""
            fill
            sizes="(min-width: 512px) 480px, 100vw"
            className="object-cover"
            priority
          />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-16 place-items-center rounded-full border-2 border-[var(--a-ink)] bg-[var(--a-lime)] shadow-[3px_3px_0_var(--a-ink)] transition-transform group-hover:scale-110">
              <Play className="ml-1 size-7 fill-current" />
            </span>
          </span>
        </div>
      )}
      <div className="flex items-center gap-3 p-4">
        <div className="min-w-0 flex-1">
          <p className="artist-display text-xl font-extrabold leading-tight">{item.title}</p>
          {item.subtitle && (
            <p className="mt-0.5 text-sm text-[var(--a-ink)]/70">{item.subtitle}</p>
          )}
        </div>
        <ArrowUpRight className="size-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </ItemLink>
  );
}

function RowCard({ item }: { item: ArtistItem }) {
  const Icon = ICONS[item.icon ?? "link"];
  return (
    <ItemLink item={item} className="artist-card group flex items-center gap-3.5 rounded-2xl p-2.5 pr-4">
      {item.thumbnail ? (
        <span className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-xl border-2 border-[var(--a-ink)] bg-[var(--a-bg)]">
          <Image src={item.thumbnail} alt="" fill sizes="112px" className="object-cover" />
          <span className="absolute bottom-1 right-1 grid size-5 place-items-center rounded-full bg-[var(--a-ink)] text-white">
            <Play className="ml-px size-2.5 fill-current" />
          </span>
        </span>
      ) : (
        <span className="grid size-12 shrink-0 place-items-center rounded-xl border-2 border-[var(--a-ink)] bg-[var(--a-bg)]">
          <Icon className="size-5" strokeWidth={2.25} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="artist-display line-clamp-2 block text-[15px] font-bold leading-snug">
          {item.title}
        </span>
        {item.subtitle && (
          <span className="mt-0.5 block truncate text-xs text-[var(--a-soft)]">{item.subtitle}</span>
        )}
      </span>
      <ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </ItemLink>
  );
}

function Section({ section, index }: { section: ArtistSection; index: number }) {
  return (
    <section id={section.id} className="artist-rise scroll-mt-20" style={stagger(index + 4)}>
      <div className="mb-3 flex items-baseline justify-between px-1">
        <h2 className="artist-display text-lg font-extrabold uppercase tracking-wide">
          {section.title}
        </h2>
        <span className="text-xs font-semibold text-[var(--a-soft)]">
          {String(section.items.length).padStart(2, "0")}
        </span>
      </div>
      {section.layout === "feature" ? (
        <div className="flex flex-col gap-4">
          {section.items.map((item) => (
            <FeatureCard key={item.url} item={item} />
          ))}
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {section.items.map((item) => (
            <li key={item.url}>
              <RowCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const ArtistPage: AppPage = () => {
  return (
    <>
      <NextSeo
        title={TITLE}
        description={ARTIST.tagline}
        canonical={PAGE_URL}
        openGraph={{
          url: PAGE_URL,
          title: TITLE,
          description: ARTIST.tagline,
          images: [
            {
              url: `${SITE_URL}${ARTIST.shareImage.src}`,
              width: ARTIST.shareImage.width,
              height: ARTIST.shareImage.height,
              alt: `${ARTIST.name} on stage`,
            },
          ],
        }}
        twitter={{ cardType: "summary_large_image" }}
      />

      <div className="artist min-h-[100svh]">
        <main className="mx-auto flex min-h-[100svh] w-full max-w-lg flex-col px-5 pb-10 pt-5">
          {/* Top bar */}
          <div className="artist-rise flex items-center justify-between">
            <span className="artist-display rounded-full border-2 border-[var(--a-ink)] bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">
              Artist
            </span>
            <ShareButton />
          </div>

          {/* Profile */}
          <header className="mt-6 flex flex-col items-center text-center">
            <div className="artist-rise relative" style={stagger(1)}>
              <div className="size-40 overflow-hidden rounded-full border-2 border-[var(--a-ink)] bg-[var(--a-violet)] shadow-[5px_5px_0_var(--a-ink)]">
                <Image
                  src={ARTIST.avatar}
                  alt={ARTIST.name}
                  className="size-full scale-[1.15] object-cover object-top pt-2"
                  sizes="160px"
                  priority
                />
              </div>
              <span className="artist-display artist-wiggle absolute -right-8 top-2 rotate-12 whitespace-nowrap rounded-full border-2 border-[var(--a-ink)] bg-[var(--a-lime)] px-2.5 py-1 text-xs font-extrabold">
                {ARTIST.badge}
              </span>
            </div>

            <h1
              className="artist-display artist-rise mt-6 text-[2.6rem] font-extrabold uppercase leading-[0.95] tracking-tight"
              style={stagger(2)}
            >
              <span className="artist-mark">{ARTIST.name}</span>
            </h1>
            <p className="artist-rise mt-3 font-semibold text-[var(--a-violet)]" style={stagger(2)}>
              {ARTIST.handle}
            </p>
            <p
              className="artist-rise mt-2 max-w-xs text-[15px] leading-relaxed text-[var(--a-soft)]"
              style={stagger(3)}
            >
              {ARTIST.tagline}
            </p>

            <ul className="artist-rise mt-5 flex flex-wrap justify-center gap-2.5" style={stagger(3)}>
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
          </header>

          {/* Jump bar */}
          <nav
            aria-label="Sections"
            className="artist-rise sticky top-0 z-10 -mx-5 mt-8 bg-[var(--a-bg)]/90 px-5 py-3 backdrop-blur"
            style={stagger(4)}
          >
            <ul className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {ARTIST.sections.map((s) => (
                <li key={s.id} className="shrink-0">
                  <a
                    href={`#${s.id}`}
                    className="block rounded-full border-2 border-[var(--a-ink)] bg-white px-3 py-1 text-xs font-bold transition-colors hover:bg-[var(--a-lime)]"
                  >
                    {s.short}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sections */}
          <div className="mt-4 flex flex-col gap-9">
            {ARTIST.sections.map((section, i) => (
              <Section key={section.id} section={section} index={i} />
            ))}
          </div>

          <footer className="mt-auto pt-14 text-center text-xs text-[var(--a-soft)]">
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
