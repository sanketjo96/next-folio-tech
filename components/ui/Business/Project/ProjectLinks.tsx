import { ArrowUpRight } from "lucide-react";
import { trackAttrs } from "@/lib/analytics";

type Props = {
  links: { label: string; url: string }[];
  /** Project title, for analytics. */
  title: string;
  /** "card": strip attached under a project card. "page": buttons on the project page. */
  variant: "card" | "page";
};

/** External links for a project (live site, demo, source code). */
export default function ProjectLinks({ links, title, variant }: Props) {
  if (variant === "card") {
    return (
      <ul className="flex flex-wrap gap-x-5 gap-y-2 rounded-b-md border border-t-0 bg-card/60 px-6 py-3.5">
        {links.map((l) => (
          <li key={l.url}>
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              {...trackAttrs(`Tech: Project link`, { project: title, link: l.label, place: "card" })}
              className="inline-flex items-center gap-1 font-medium text-xs text-brand underline-offset-4 hover:underline"
            >
              {l.label}
              <ArrowUpRight className="size-3.5" />
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="not-prose mt-6 flex flex-wrap gap-2.5">
      {links.map((l, i) => (
        <li key={l.url}>
          <a
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            {...trackAttrs(`Tech: Project link`, { project: title, link: l.label, place: "page" })}
            className={
              "inline-flex h-10 items-center gap-1.5 rounded-full px-5 text-sm font-medium no-underline transition-colors " +
              (i === 0
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "border bg-card/70 text-foreground hover:border-brand/50")
            }
          >
            {l.label}
            <ArrowUpRight className="size-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}
