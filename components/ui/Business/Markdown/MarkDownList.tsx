import { formatDate } from "@/lib/utils";
import Link from "next/link";
import React from "react";

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
    <ul>
      {metaList.map((item) => (
        <li key={item.id}>
          <Link
            href={`${redirectBase}/${item.id}`}
            className="flex items-center justify-between gap-2 mt-2 mb-4"
          >
            <div className="max-w-lg">
              <p className="text-lg font-semibold">{item.title}</p>
              <p className="text-sm font-light">{item.summary}</p>
            </div>
            {item.publishDate && (
              <p className="mt-1 text-sm font-light">
                {formatDate(item.publishDate)}
              </p>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MarkdownList;
