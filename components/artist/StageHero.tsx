import Image from "next/image";
import { Check, Facebook, Instagram, Play, Share2, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { ARTIST, type ArtistIcon } from "@/lib/data/artist";

const SOCIAL_ICONS: Partial<Record<ArtistIcon, LucideIcon>> = {
  instagram: Instagram,
  facebook: Facebook,
};

const rise = (i: number) => ({ "--i": i }) as React.CSSProperties;

function ShareButton({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Share sheet dismissed or clipboard blocked: nothing to do.
    }
  };

  return (
    <button
      type="button"
      onClick={onShare}
      className="grid size-10 place-items-center rounded-full border border-[var(--s-line)] bg-black/30 backdrop-blur transition-colors hover:border-[var(--s-amber)]"
      aria-label={copied ? "Link copied" : "Share this page"}
    >
      {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
    </button>
  );
}

export default function StageHero({ shareUrl, shareTitle }: { shareUrl: string; shareTitle: string }) {
  const [first, last] = ARTIST.name.split(" ");

  return (
    <header className="stage stage-grain relative overflow-hidden">
      <div className="stage-curtain stage-curtain--left" aria-hidden />
      <div className="stage-curtain stage-curtain--right" aria-hidden />
      <div
        className="stage-beam pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-full w-[min(70vw,560px)] bg-[conic-gradient(from_180deg_at_50%_0%,transparent_160deg,rgba(255,200,97,0.16)_172deg,rgba(255,220,150,0.22)_180deg,rgba(255,200,97,0.16)_188deg,transparent_200deg)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-6xl px-5 pt-5">
        {/* Top bar */}
        <div className="artist-rise flex items-center justify-between">
          <span className="rounded-full border border-[var(--s-line)] bg-black/30 px-3.5 py-1.5 text-xs font-semibold tracking-wide backdrop-blur">
            {ARTIST.handle}
          </span>
          <ShareButton url={shareUrl} title={shareTitle} />
        </div>

        <div className="grid items-end gap-2 lg:mt-6 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
          {/* Figure in the spotlight */}
          <div className="relative order-1 mx-auto mt-1 w-full max-w-[230px] sm:mt-4 sm:max-w-[420px] lg:order-2 lg:mt-10 lg:max-w-[520px]">
            <p
              className="poster outline-text pointer-events-none absolute inset-x-0 top-[6%] select-none text-center text-[clamp(4.5rem,24vw,12rem)]"
              aria-hidden
            >
              Laugh
            </p>
            <div className="absolute inset-x-[12%] bottom-[2%] h-10 rounded-[100%] bg-[var(--s-orange)]/35 blur-2xl" aria-hidden />
            <Image
              src={ARTIST.avatar}
              alt={`${ARTIST.name} with a djembe`}
              priority
              sizes="(min-width: 1024px) 520px, 420px"
              className="figure-rise relative mx-auto w-[86%] drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]"
            />
            <span
              className="artist-rise absolute -right-[22%] top-[18%] rotate-[10deg] rounded-full bg-[var(--s-amber)] px-3 py-1.5 text-xs font-extrabold sm:right-[2%] sm:top-[22%] text-[var(--s-bg)] shadow-lg sm:text-sm"
              style={rise(5)}
            >
              {ARTIST.badge}
            </span>
          </div>

          {/* Name and intro */}
          <div className="order-2 pb-9 text-center sm:pb-10 lg:order-1 lg:pb-20 lg:text-left">
            <p className="artist-rise hidden text-xs font-semibold uppercase tracking-[0.3em] text-[var(--s-amber)] sm:block" style={rise(1)}>
              Live on stage
            </p>
            <h1 className="poster artist-rise mt-1 text-[clamp(3.5rem,16vw,9.5rem)] sm:mt-3" style={rise(2)}>
              {first}
              <br />
              <span className="text-[var(--s-orange)]">{last}</span>
            </h1>
            <p className="artist-rise mt-3 text-sm text-[var(--s-muted)] sm:hidden" style={rise(3)}>
              {ARTIST.roles.join(" · ")}
            </p>
            <ul className="artist-rise mt-6 hidden flex-wrap justify-center gap-2 sm:flex lg:justify-start" style={rise(3)}>
              {ARTIST.roles.map((role) => (
                <li
                  key={role}
                  className="rounded-full border border-[var(--s-line)] px-3 py-1 text-sm text-[var(--s-muted)]"
                >
                  {role}
                </li>
              ))}
            </ul>
            <div className="artist-rise mt-5 flex items-center justify-center gap-3 sm:mt-8 lg:justify-start" style={rise(4)}>
              <a
                href="#standup"
                className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-[var(--s-orange)] pl-2 pr-5 font-bold text-[var(--s-bg)] transition-transform hover:-translate-y-0.5"
              >
                <span className="grid size-8 place-items-center rounded-full bg-[var(--s-bg)] text-[var(--s-orange)]">
                  <Play className="ml-0.5 size-3.5 fill-current" />
                </span>
                Watch the set
              </a>
              {ARTIST.socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.icon];
                return Icon ? (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="grid size-12 place-items-center rounded-full border border-[var(--s-line)] transition-colors hover:border-[var(--s-amber)] hover:text-[var(--s-amber)]"
                  >
                    <Icon className="size-5" />
                  </a>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
