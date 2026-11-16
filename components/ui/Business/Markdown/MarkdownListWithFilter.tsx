import React, { useState } from "react";
import { MagnifyingGlassIcon, Cross2Icon } from "@radix-ui/react-icons";
import MarkdownList, { MarkdownListProps, PROJECT_CATEGORIES } from "./MarkDownList";
import { useTranslation } from "next-i18next";

type Props = MarkdownListProps & {
  /** Split the list into the project categories (Commercial, Incubation). */
  groupByCategory?: boolean;
};

const MarkDownListWithFilter = ({ groupByCategory, ...props }: Props) => {
  const { t } = useTranslation("common");
  const { metaList, redirectBase, variant } = props;
  const [query, setQuery] = useState("");

  const needle = query.trim().toLowerCase();
  const filtered = metaList.filter((meta) =>
    meta.title.toLowerCase().includes(needle)
  );

  const groups = groupByCategory
    ? PROJECT_CATEGORIES.map((c) => ({
        ...c,
        items: filtered.filter((m) => (m.category ?? "commercial") === c.key),
      })).filter((g) => g.items.length > 0)
    : null;

  return (
    <>
      <div className="relative mb-8">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          aria-label={`Search ${redirectBase}`}
          placeholder={`Search ${redirectBase}…`}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 w-full rounded-md border bg-card/70 font-medium pl-11 pr-24 text-sm backdrop-blur placeholder:text-muted-foreground focus:border-brand/60 focus:outline-none"
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2">
          <span className="font-medium text-[11px] text-muted-foreground">
            {filtered.length}/{metaList.length}
          </span>
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="grid size-8 place-items-center rounded-full hover:bg-accent"
            >
              <Cross2Icon />
              <span className="sr-only">{t("reset")}</span>
            </button>
          )}
        </div>
      </div>

      {groups ? (
        <>
          {/* Jump links between the groups */}
          <nav aria-label="Project categories" className="mb-12 flex flex-wrap gap-2">
            {groups.map((g) => (
              <a
                key={g.key}
                href={`#${g.key}`}
                className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground"
              >
                {g.title}
                <span className="font-medium text-[11px] text-muted-foreground">{g.items.length}</span>
              </a>
            ))}
          </nav>
          <div className="space-y-20">
            {groups.map((g, i) => (
              <section key={g.key} id={g.key} className="scroll-mt-28">
                <div className="mb-8 flex flex-col gap-2 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="font-medium text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")} / {g.items.length} {g.items.length === 1 ? "project" : "projects"}
                    </p>
                    <h2 className="mt-2 text-4xl tracking-tight sm:text-5xl">
                      {g.title}
                      <span className="text-brand">.</span>
                    </h2>
                  </div>
                  <p className="max-w-sm text-sm text-muted-foreground sm:text-right">{g.description}</p>
                </div>
                <MarkdownList redirectBase={redirectBase} metaList={g.items} variant={variant} />
              </section>
            ))}
          </div>
        </>
      ) : (
        <MarkdownList redirectBase={redirectBase} metaList={filtered} variant={variant} />
      )}
    </>
  );
};

export default MarkDownListWithFilter;
