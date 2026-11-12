import React, { useState } from "react";
import { MagnifyingGlassIcon, Cross2Icon } from "@radix-ui/react-icons";
import MarkdownList, { MarkdownListProps } from "./MarkDownList";
import { useTranslation } from "next-i18next";

const MarkDownListWithFilter = (props: MarkdownListProps) => {
  const { t } = useTranslation("common");
  const { metaList, redirectBase, variant } = props;
  const [query, setQuery] = useState("");

  const needle = query.trim().toLowerCase();
  const filtered = metaList.filter((meta) =>
    meta.title.toLowerCase().includes(needle)
  );

  return (
    <>
      <div className="relative mb-8">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          aria-label={`Search ${redirectBase}`}
          placeholder={`Search ${redirectBase}…`}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 w-full rounded-md border bg-card/70 font-mono pl-11 pr-24 text-sm backdrop-blur placeholder:text-muted-foreground focus:border-brand/60 focus:outline-none"
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2">
          <span className="font-mono text-[11px] text-muted-foreground">
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
      <MarkdownList redirectBase={redirectBase} metaList={filtered} variant={variant} />
    </>
  );
};

export default MarkDownListWithFilter;
