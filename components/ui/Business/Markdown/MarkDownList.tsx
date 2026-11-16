import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  ArrowUpRight,
  Boxes,
  FileStack,
  Layers,
  LayoutDashboard,
  Network,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import ProjectLinks from "../Project/ProjectLinks";

export type MarkdownMetaData = {
  id: string;
  title: string;
  author: string;
  image?: string;
  /** 16:9 photo thumbnail for lists (no text baked in), e.g. "/images/posts/li-1-thumb.jpg". */
  thumbnail?: string;
  /** Attribution for licensed photos in the cover image (Wikimedia Commons). */
  imageCredits?: { text: string; url?: string }[];
  publishDate: string;
  summary: string;
  /** Set on posts synced from LinkedIn (via Typefully). */
  source?: "linkedin";
  linkedinUrl?: string;
  /** Estimated minutes to read, derived from the body. */
  readingMinutes?: number;
  /** Short tech tags, derived from a "## Technology" list in the body. */
  tags?: string[];
  /** External links for a project (live site, demo, source), shown on its card and page. */
  links?: { label: string; url: string }[];
  /** Projects only. "commercial": client or employer work. "incubation": my own products. */
  category?: ProjectCategory;
};

export type ProjectCategory = "commercial" | "incubation";

export const PROJECT_CATEGORIES: { key: ProjectCategory; title: string; description: string }[] = [
  {
    key: "commercial",
    title: "Commercial",
    description: "Products and platforms built for clients and employers.",
  },
  {
    key: "incubation",
    title: "Incubation",
    description: "My own products, taken from idea to a live release.",
  },
];

export type MarkdownListProps = {
  redirectBase: string;
  metaList: MarkdownMetaData[];
  /** "rows": editorial list (writing). "cards": grid with a preview panel (work). */
  variant?: "rows" | "cards";
};

const pad = (n: number) => String(n + 1).padStart(2, "0");
const stagger = (i: number) => ({ "--i": i }) as React.CSSProperties;

// Decorative glyphs for project previews, picked by position.
const PREVIEW_ICONS: LucideIcon[] = [Workflow, LayoutDashboard, Layers, Network, Boxes, FileStack];

const Tags = ({ tags, accentFirst }: { tags?: string[]; accentFirst?: boolean }) =>
  tags && tags.length > 0 ? (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((tag, i) => (
        <li
          key={tag}
          className={
            "rounded border px-2 py-0.5 font-medium text-[10px] " +
            (accentFirst && i === 0
              ? "border-brand/40 bg-brand/10 text-brand"
              : "text-muted-foreground")
          }
        >
          {tag}
        </li>
      ))}
    </ul>
  ) : null;

const Rows = ({ metaList, redirectBase }: MarkdownListProps) => (
  <ul className="border-t">
    {metaList.map((item, i) => (
      <li key={item.id} className="reveal border-b" style={stagger(i)}>
        <Link
          href={`/${redirectBase}/${item.id}`}
          className="group grid grid-cols-[2rem_1fr] gap-x-4 py-7 sm:grid-cols-[3rem_1fr_auto] sm:gap-x-6"
        >
          <span className="pt-1 font-medium text-[11px] text-muted-foreground">{pad(i)}</span>
          <div className="min-w-0 sm:flex sm:items-start sm:gap-6">
            {item.thumbnail && (
              <Image
                src={item.thumbnail}
                alt=""
                width={640}
                height={360}
                sizes="(min-width: 640px) 13rem, 100vw"
                className="mb-4 aspect-video w-full rounded-md border object-cover transition-opacity group-hover:opacity-90 sm:mb-0 sm:w-52 sm:shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <Tags tags={item.tags} accentFirst />
              <h3 className="mt-2 text-3xl leading-tight transition-colors group-hover:text-brand sm:text-[2.1rem]">
                {item.title}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {item.summary}
              </p>
              <p className="mt-3 font-medium text-[11px] text-muted-foreground sm:hidden">
                {item.publishDate && formatDate(item.publishDate)}
                {item.readingMinutes ? ` · ${item.readingMinutes} min read` : ""}
              </p>
            </div>
          </div>
          <div className="hidden flex-col items-end justify-between text-right font-medium text-[11px] text-muted-foreground sm:flex">
            <div className="space-y-1.5">
              {item.publishDate && <p>{formatDate(item.publishDate)}</p>}
              {item.readingMinutes ? <p>{item.readingMinutes} min read</p> : null}
            </div>
            <ArrowUpRight className="size-4 text-foreground/70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
          </div>
        </Link>
      </li>
    ))}
  </ul>
);

const Cards = ({ metaList, redirectBase }: MarkdownListProps) => (
  <ul className="grid gap-5 md:grid-cols-2">
    {metaList.map((item, i) => {
      const Icon = PREVIEW_ICONS[i % PREVIEW_ICONS.length];
      return (
        <li key={item.id} className="reveal flex flex-col" style={stagger(i)}>
          <Link
            href={`/${redirectBase}/${item.id}`}
            className={
              "group flex flex-1 flex-col overflow-hidden border bg-card/60 transition-colors hover:border-brand/40 " +
              (item.links?.length ? "rounded-t-md" : "rounded-md")
            }
          >
            <div
              className={
                "relative grid place-items-center overflow-hidden border-b bg-gradient-to-b from-accent/60 to-transparent " +
                (item.thumbnail ? "aspect-[40/21] bg-[#09090d]" : "h-44")
              }
            >
              {item.thumbnail ? (
                <Image
                  src={item.thumbnail}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 560px, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              ) : (
                <>
                  <div className="dot-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_70%)]" />
                  <Icon
                    className="relative size-12 text-brand transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-6deg]"
                    strokeWidth={1.25}
                  />
                </>
              )}
              <span
                className={
                  "absolute right-4 top-4 font-medium text-[10px] " +
                  (item.thumbnail ? "rounded bg-background/80 px-1.5 py-0.5 text-foreground backdrop-blur" : "text-muted-foreground")
                }
              >
                {pad(i)} / WORK
              </span>
              {item.category === "incubation" && (
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded bg-background/80 px-1.5 py-0.5 font-medium text-[10px] uppercase tracking-wider text-foreground backdrop-blur">
                  <span className="size-1.5 rounded-full bg-brand" aria-hidden />
                  Incubation
                </span>
              )}
              {!item.thumbnail && item.tags?.[0] && (
                <span className="absolute bottom-4 font-medium text-[10px] text-muted-foreground">
                  {item.tags.join(" · ")}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-[1.75rem] leading-tight">{item.title}</h3>
                <ArrowUpRight className="mt-1 size-4 shrink-0 text-foreground/70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {item.summary}
              </p>
              <div className="mt-auto flex items-center justify-between pt-6 font-medium text-[11px] text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-brand" aria-hidden />
                  {item.tags?.[0] ?? "Project"}
                </span>
                <span className="transition-colors group-hover:text-foreground">
                  Project notes ↗
                </span>
              </div>
            </div>
          </Link>
          {/* Outside the card link: anchors can't nest. */}
          {item.links?.length ? <ProjectLinks links={item.links} title={item.title} variant="card" /> : null}
        </li>
      );
    })}
  </ul>
);

const MarkdownList = ({ variant = "rows", ...props }: MarkdownListProps) =>
  variant === "cards" ? <Cards {...props} /> : <Rows {...props} />;

export default MarkdownList;
