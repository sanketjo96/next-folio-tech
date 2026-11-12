import { formatDate } from "@/lib/utils";
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

export type MarkdownMetaData = {
  id: string;
  title: string;
  author: string;
  image: string;
  publishDate: string;
  summary: string;
  /** Estimated minutes to read, derived from the body. */
  readingMinutes?: number;
  /** Short tech tags, derived from a "## Technology" list in the body. */
  tags?: string[];
};

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
            "rounded border px-2 py-0.5 font-mono text-[10px] " +
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
          <span className="pt-1 font-mono text-[11px] text-muted-foreground">{pad(i)}</span>
          <div className="min-w-0">
            <Tags tags={item.tags} accentFirst />
            <h3 className="mt-2 text-3xl leading-tight transition-colors group-hover:text-brand sm:text-[2.1rem]">
              {item.title}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {item.summary}
            </p>
            <p className="mt-3 font-mono text-[11px] text-muted-foreground sm:hidden">
              {item.publishDate && formatDate(item.publishDate)}
              {item.readingMinutes ? ` · ${item.readingMinutes} min read` : ""}
            </p>
          </div>
          <div className="hidden flex-col items-end justify-between text-right font-mono text-[11px] text-muted-foreground sm:flex">
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
        <li key={item.id} className="reveal" style={stagger(i)}>
          <Link
            href={`/${redirectBase}/${item.id}`}
            className="group flex h-full flex-col overflow-hidden rounded-md border bg-card/60 transition-colors hover:border-brand/40"
          >
            <div className="relative grid h-44 place-items-center border-b bg-gradient-to-b from-accent/60 to-transparent">
              <div className="dot-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_70%)]" />
              <span className="absolute right-4 top-4 font-mono text-[10px] text-muted-foreground">
                {pad(i)} / WORK
              </span>
              <Icon
                className="relative size-12 text-brand transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-6deg]"
                strokeWidth={1.25}
              />
              {item.tags?.[0] && (
                <span className="absolute bottom-4 font-mono text-[10px] text-muted-foreground">
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
              <div className="mt-auto flex items-center justify-between pt-6 font-mono text-[11px] text-muted-foreground">
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
        </li>
      );
    })}
  </ul>
);

const MarkdownList = ({ variant = "rows", ...props }: MarkdownListProps) =>
  variant === "cards" ? <Cards {...props} /> : <Rows {...props} />;

export default MarkdownList;
