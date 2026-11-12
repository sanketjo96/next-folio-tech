import React, { useState } from "react";
import { GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ARTIST, type ArtistItem, type ArtistSection } from "@/lib/data/artist";
import StageHero from "@/components/artist/StageHero";
import VideoPlayer from "@/components/artist/VideoPlayer";
import {
  AudioSection,
  FeatureSection,
  LinksSection,
  VideoSection,
} from "@/components/artist/Sections";
import JsonLd from "@/components/JsonLd";
import { artistJsonLd } from "@/lib/seo";
import type { AppPage } from "../_app";

const SITE_URL = "https://www.techsanket.in";
const PAGE_URL = `${SITE_URL}/artist`;
const TITLE = `${ARTIST.name} · ${ARTIST.handle}`;
const DESCRIPTION = `${ARTIST.roles.join(" · ")}. Marathi stand-up, TV, short films, podcasts and more.`;

function Marquee() {
  const words = [...ARTIST.marquee, ...ARTIST.marquee];
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
      <p className="sr-only">{ARTIST.marquee.join(", ")}</p>
    </div>
  );
}

function JumpBar() {
  return (
    <nav aria-label="Sections" className="sticky top-0 z-30 mt-6 border-y sm:mt-10 border-[var(--s-line)] bg-[var(--s-bg)]/85 backdrop-blur-md">
      <ul className="reel mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 py-2.5">
        {ARTIST.sections.map((s) => (
          <li key={s.id} className="shrink-0">
            <a
              href={`#${s.id}`}
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

const ArtistPage: AppPage = () => {
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
              url: `${SITE_URL}${ARTIST.shareImage.src}`,
              width: ARTIST.shareImage.width,
              height: ARTIST.shareImage.height,
              alt: `${ARTIST.name} on stage`,
            },
          ],
        }}
        twitter={{ cardType: "summary_large_image" }}
      />
      <JsonLd id="artist" data={artistJsonLd} />

      <div className="artist min-h-[100svh]">
        <StageHero shareUrl={PAGE_URL} shareTitle={TITLE} />
        <Marquee />
        <JumpBar />

        <main className="mx-auto flex max-w-6xl flex-col gap-16 px-5 pb-16 pt-8 sm:gap-24 sm:pt-14">
          {ARTIST.sections.map((section, i) => renderSection(section, i + 1, setPlaying))}
        </main>

        <footer className="border-t border-[var(--s-line)]">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-5 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="poster text-3xl">
              Laugh with <span className="text-[var(--s-orange)]">Sanket</span>
            </p>
            <p className="text-sm text-[var(--s-faint)]">
              © {new Date().getFullYear()} {ARTIST.name} · {ARTIST.handle}
            </p>
          </div>
        </footer>
      </div>

      <VideoPlayer item={playing} onClose={() => setPlaying(null)} />
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
