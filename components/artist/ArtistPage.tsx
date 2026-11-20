import React, { useState } from "react";
import { NextSeo } from "next-seo";
import type { ArtistItem, ArtistProfile, ArtistSection } from "@/lib/data/artist";
import StageHero from "@/components/artist/StageHero";
import VideoPlayer from "@/components/artist/VideoPlayer";
import { AudioSection, FeatureSection, LinksSection, VideoSection } from "@/components/artist/Sections";
import JsonLd from "@/components/JsonLd";
import { seenAttrs, trackAttrs } from "@/lib/analytics";
import { artistJsonLd } from "@/lib/seo";

const SITE_URL = "https://www.techsanket.in";


function Marquee({ profile }: { profile: ArtistProfile }) {
  const words = [...profile.marquee, ...profile.marquee];
  return (
    <div className="relative z-10 -mt-6 -rotate-[1.5deg] overflow-hidden border-y-2 border-[var(--s-bg)] bg-[var(--s-orange)] py-3 text-[var(--s-bg)] shadow-[0_20px_50px_-20px_rgba(255,107,44,0.6)]">
      <div className="marquee" aria-hidden>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {words.map((w, i) => (
              <span key={`${copy}-${i}`} className="poster flex items-center text-2xl sm:text-3xl">
                <span className="px-5">{w}</span>
                <span className="text-lg">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className="sr-only">{profile.marquee.join(", ")}</p>
    </div>
  );
}

function JumpBar({ profile }: { profile: ArtistProfile }) {
  return (
    <nav aria-label="Sections" className="sticky top-0 z-30 mt-6 border-y sm:mt-10 border-[var(--s-line)] bg-[var(--s-bg)]/85 backdrop-blur-md">
      <ul className="reel mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 py-2.5">
        {profile.sections.map((s) => (
          <li key={s.id} className="shrink-0">
            <a
              href={`#${s.id}`}
              {...trackAttrs(`Artist menu: ${s.short}`)}
              className="block rounded-full px-3.5 py-1.5 text-sm font-semibold text-[var(--s-muted)] transition-colors hover:bg-white/5 hover:text-[var(--s-ink)]"
            >
              {s.short}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function renderSection(section: ArtistSection, index: number, onPlay: (item: ArtistItem) => void) {
  switch (section.layout) {
    case "feature":
      return <FeatureSection key={section.id} section={section} index={index} />;
    case "videos":
      return <VideoSection key={section.id} section={section} index={index} onPlay={onPlay} />;
    case "audio":
      return <AudioSection key={section.id} section={section} index={index} />;
    case "links":
      return <LinksSection key={section.id} section={section} index={index} />;
  }
}

/** The artist page layout; `profile` decides the copy and sections. */
export default function ArtistPage({ profile }: { profile: ArtistProfile }) {
  const PAGE_URL = `${SITE_URL}${profile.page.path}`;
  const TITLE = profile.page.title;
  const DESCRIPTION = profile.page.description;
  const [playing, setPlaying] = useState<ArtistItem | null>(null);

  return (
    <>
      <NextSeo
        title={TITLE}
        description={DESCRIPTION}
        canonical={PAGE_URL}
        openGraph={{
          url: PAGE_URL,
          title: TITLE,
          description: DESCRIPTION,
          images: [
            {
              url: `${SITE_URL}${profile.shareImage.src}`,
              width: profile.shareImage.width,
              height: profile.shareImage.height,
              alt: profile.shareImage.alt,
              type: "image/jpeg",
            },
          ],
        }}
        twitter={{ cardType: "summary_large_image" }}
      />
      <JsonLd id="artist" data={artistJsonLd(profile)} />

      <div className="artist min-h-[100svh]">
        <StageHero profile={profile} shareUrl={PAGE_URL} shareTitle={TITLE} />
        <Marquee profile={profile} />
        <JumpBar profile={profile} />

        <main className="mx-auto flex max-w-6xl flex-col gap-16 px-5 pb-16 pt-8 sm:gap-24 sm:pt-14">
          {profile.sections.map((section, i) => renderSection(section, i + 1, setPlaying))}
        </main>

        <footer className="border-t border-[var(--s-line)]" {...seenAttrs("Artist: Reached the end")}>
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-5 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="poster text-3xl">
              {profile.page.footerLead} <span className="text-[var(--s-orange)]">Sanket</span>
            </p>
            <p className="text-sm text-[var(--s-faint)]">
              © {new Date().getFullYear()} {profile.name}
              {profile.page.showHandle && ` · ${profile.handle}`}
            </p>
          </div>
        </footer>
      </div>

      <VideoPlayer item={playing} onClose={() => setPlaying(null)} />
    </>
  );
}
