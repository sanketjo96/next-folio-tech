import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Code, Mail, Play, Ticket } from "lucide-react";
import type { ArtistItem, ArtistSection } from "@/lib/data/artist";
import { youtubeInfo } from "@/lib/data/artist";
import { seenAttrs, trackAttrs } from "@/lib/analytics";

/** Devanagari titles get the Marathi font. */
const isMarathi = (text: string) => /[ऀ-ॿ]/.test(text);

function SectionHeader({ section, index }: { section: ArtistSection; index: number }) {
  return (
    <div className="mb-5 sm:mb-6">
      <div>
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--s-amber)]">
          <span className="text-[var(--s-faint)]">{String(index).padStart(2, "0")}</span>
          {section.kicker}
        </p>
        <h2
          className={
            "poster mt-2 text-[clamp(2.4rem,9vw,4rem)] " +
            (isMarathi(section.title) ? "marathi !leading-[1.15] font-extrabold" : "")
          }
        >
          {section.title}
        </h2>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Feature */

export function FeatureSection({ section, index }: { section: ArtistSection; index: number }) {
  const item = section.items[0];
  return (
    <section id={section.id} className="scroll-mt-20" {...seenAttrs(`Artist: ${section.short}`)}>
      <SectionHeader section={section} index={index} />
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        {...trackAttrs(`Watch: ${item.title}`, { section: section.short, place: "ZEE5" })}
        className="group relative block overflow-hidden rounded-3xl bg-[var(--s-card)] ring-1 ring-[var(--s-line)]"
      >
        <div className="relative aspect-[4/3] sm:aspect-[16/9]">
          {item.thumbnail && (
            <Image
              src={item.thumbnail}
              alt={item.title}
              fill
              sizes="(min-width: 1152px) 1100px, 100vw"
              className="object-cover object-[50%_30%] transition-transform duration-700 group-hover:scale-[1.04]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--s-bg)] via-[var(--s-bg)]/30 to-transparent" />
          <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 text-xs font-bold uppercase tracking-widest backdrop-blur">
            <span className="size-2 animate-pulse rounded-full bg-red-500" />
            {section.kicker}
          </span>
          <span className="play-ring absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[var(--s-orange)] text-[var(--s-bg)] transition-transform group-hover:scale-110 sm:size-24">
            <Play className="ml-1 size-8 fill-current" />
          </span>
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-10">
            <p className="text-sm font-semibold text-[var(--s-amber)]">{item.subtitle}</p>
            <p className="poster mt-2 max-w-2xl text-[clamp(2.6rem,9vw,5.5rem)]">{item.title}</p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--s-ink)] px-5 py-2.5 text-sm font-bold text-[var(--s-bg)] transition-colors group-hover:bg-[var(--s-amber)]">
              Watch on ZEE5 <ArrowUpRight className="size-4" />
            </span>
          </div>
        </div>
      </a>
    </section>
  );
}

/* ----------------------------------------------------------------- Videos */

/**
 * Phones: a full-width row (thumbnail left, title right), stacked like a
 * link-in-bio list. Wider screens: a thumbnail card in a grid.
 */
function VideoCard({
  item,
  section,
  onPlay,
}: {
  item: ArtistItem;
  section: ArtistSection;
  onPlay: (item: ArtistItem) => void;
}) {
  const playable = !!youtubeInfo(item.url);
  const tracking = trackAttrs(`Watch: ${item.title}`, { section: section.short });
  const cls =
    "group flex w-full items-center gap-3.5 rounded-2xl bg-[var(--s-card)] p-2.5 pr-4 text-left ring-1 ring-[var(--s-line)] transition-colors hover:ring-[var(--s-amber)]/50 active:scale-[0.99] sm:block sm:bg-transparent sm:p-0 sm:ring-0";
  const body = (
    <>
      <span className="relative block aspect-video w-32 shrink-0 overflow-hidden rounded-xl bg-[var(--s-bg-2)] sm:w-full sm:rounded-2xl sm:ring-1 sm:ring-[var(--s-line)]">
        {item.thumbnail && (
          <Image
            src={item.thumbnail}
            alt=""
            fill
            sizes="(min-width: 640px) 340px, 128px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:opacity-80 sm:transition-opacity sm:group-hover:opacity-50" />
        <span className="absolute bottom-1.5 left-1.5 grid size-7 place-items-center rounded-full bg-[var(--s-orange)] text-[var(--s-bg)] shadow-lg transition-transform group-hover:scale-110 sm:bottom-3 sm:left-3 sm:size-11">
          <Play className="ml-0.5 size-3 fill-current sm:size-4" />
        </span>
      </span>
      <span className="min-w-0 flex-1 sm:mt-3 sm:block">
        <span
          className={
            "line-clamp-2 block text-[15px] font-bold leading-snug sm:text-[17px] " +
            (isMarathi(item.title) ? "marathi" : "")
          }
        >
          {item.title}
        </span>
        {item.subtitle && (
          <span className="mt-0.5 block truncate text-[13px] text-[var(--s-muted)] sm:mt-1 sm:text-sm">
            {item.subtitle}
          </span>
        )}
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-[var(--s-faint)] sm:hidden" />
    </>
  );

  return playable ? (
    <button type="button" onClick={() => onPlay(item)} className={cls} {...tracking}>
      {body}
    </button>
  ) : (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className={cls} {...tracking}>
      {body}
    </a>
  );
}

export function VideoSection({
  section,
  index,
  onPlay,
}: {
  section: ArtistSection;
  index: number;
  onPlay: (item: ArtistItem) => void;
}) {
  return (
    <section id={section.id} className="scroll-mt-20" {...seenAttrs(`Artist: ${section.short}`)}>
      <SectionHeader section={section} index={index} />
      <ul className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-3">
        {section.items.map((item) => (
          <li key={item.url}>
            <VideoCard item={item} section={section} onPlay={onPlay} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ Audio */

export function AudioSection({ section, index }: { section: ArtistSection; index: number }) {
  return (
    <section id={section.id} className="scroll-mt-20" {...seenAttrs(`Artist: ${section.short}`)}>
      <SectionHeader section={section} index={index} />
      <ul className="grid gap-4">
        {section.items.map((item) => (
          <li key={item.url}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              {...trackAttrs(`Listen: ${item.title}`, { section: section.short })}
              className="group flex items-center gap-5 overflow-hidden rounded-3xl bg-gradient-to-r from-[var(--s-card)] to-[var(--s-bg-2)] p-4 ring-1 ring-[var(--s-line)] transition-colors hover:ring-[var(--s-amber)]/50 sm:p-5"
            >
              {item.thumbnail && (
                <span className="relative size-28 shrink-0 overflow-hidden rounded-2xl shadow-[0_12px_30px_-8px_rgba(0,0,0,0.8)] sm:size-36">
                  <Image src={item.thumbnail} alt="" fill sizes="144px" className="object-cover" />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="eq flex h-6 items-end gap-1" aria-hidden>
                  <span className="h-full" />
                  <span className="h-full" />
                  <span className="h-full" />
                  <span className="h-full" />
                  <span className="h-full" />
                </span>
                <span className="poster mt-3 block text-[clamp(1.9rem,6vw,3rem)]">{item.title}</span>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm text-[var(--s-muted)] transition-colors group-hover:text-[var(--s-amber)]">
                  {item.subtitle} <ArrowUpRight className="size-4" />
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ Links */

export function LinksSection({ section, index }: { section: ArtistSection; index: number }) {
  const booking = section.items.find((i) => i.icon === "mail");
  const others = section.items.filter((i) => i !== booking);

  return (
    <section id={section.id} className="scroll-mt-20" {...seenAttrs(`Artist: ${section.short}`)}>
      <SectionHeader section={section} index={index} />
      {booking && (
        <Link
          href={booking.url}
          {...trackAttrs("Artist: Book the show", { section: section.short })}
          className="ticket group relative flex flex-col gap-6 overflow-hidden rounded-3xl bg-[var(--s-amber)] px-8 py-8 text-[var(--s-bg)] sm:flex-row sm:items-center sm:justify-between sm:px-12 sm:py-10"
        >
          <span className="pointer-events-none absolute inset-y-6 left-[68%] hidden border-l-2 border-dashed border-[var(--s-bg)]/25 sm:block" />
          <span>
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em]">
              <Ticket className="size-4" /> Admit one
            </span>
            <span className="poster mt-3 block text-[clamp(2.8rem,10vw,5rem)]">Book the show</span>
            <span className="mt-2 block max-w-sm text-[15px] font-medium opacity-75">
              Stand-up sets, hosting, brand collabs. {booking.subtitle}.
            </span>
          </span>
          <span className="inline-flex h-14 items-center gap-2 self-start rounded-full bg-[var(--s-bg)] px-6 font-bold text-[var(--s-amber)] transition-transform group-hover:-translate-y-0.5 sm:self-center">
            <Mail className="size-4" /> {booking.title}
          </span>
        </Link>
      )}
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {others.map((item) => {
          const content = (
            <>
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/5 text-[var(--s-amber)]">
                {item.icon === "code" ? (
                  <Code className="size-5" />
                ) : item.icon === "ticket" ? (
                  <Ticket className="size-5" />
                ) : (
                  <ArrowUpRight className="size-5" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold">{item.title}</span>
                {item.subtitle && <span className="block truncate text-sm text-[var(--s-muted)]">{item.subtitle}</span>}
              </span>
              <ArrowUpRight className="size-4 text-[var(--s-faint)] transition-colors group-hover:text-[var(--s-ink)]" />
            </>
          );
          const cls =
            "group flex items-center gap-4 rounded-2xl bg-[var(--s-card)] p-4 ring-1 ring-[var(--s-line)] transition-colors hover:ring-[var(--s-amber)]/50";
          return (
            <li key={item.url}>
              {item.internal ? (
                // Full page load: "/" must leave the standalone artist shell.
                // eslint-disable-next-line @next/next/no-html-link-for-pages
                <a href={item.url} className={cls} {...trackAttrs(`Open: ${item.title}`, { section: section.short })}>
                  {content}
                </a>
              ) : (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cls}
                  {...trackAttrs(`Open: ${item.title}`, { section: section.short })}
                >
                  {content}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
