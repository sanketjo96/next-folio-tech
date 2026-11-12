import { formatDate } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";

export type MarkdownMetaData = {
  id: string;
  title: string;
  author: string;
  image: string;
  publishDate: string;
  summary: string;
};

export type MarkdownListProps = {
  redirectBase: string;
  metaList: MarkdownMetaData[];
};

const MarkdownList = (props: MarkdownListProps) => {
  const { metaList, redirectBase } = props;
  return (
    <ul className="grid gap-3">
      {metaList.map((item, i) => (
        <li
          key={item.id}
          className="reveal"
          style={{ "--i": i } as React.CSSProperties}
        >
          <Link
            href={`/${redirectBase}/${item.id}`}
            className="surface surface-hover group flex items-start justify-between gap-6 p-5 sm:p-6"
          >
            <div className="min-w-0">
              {item.publishDate && (
                <p className="eyebrow mb-2">{formatDate(item.publishDate)}</p>
              )}
              <p className="font-display text-lg font-semibold leading-snug transition-colors group-hover:text-brand">
                {item.title}
              </p>
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {item.summary}
              </p>
            </div>
            <span className="grid size-9 shrink-0 place-items-center rounded-full border transition-all group-hover:border-brand/60 group-hover:bg-brand group-hover:text-brand-foreground">
              <ArrowTopRightIcon className="transition-transform group-hover:rotate-45" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MarkdownList;
