import React from "react";
import MarkdownList, { MarkdownMetaData } from "../Markdown/MarkDownList";
import Link from "next/link";
import { useTranslation } from "next-i18next";

type Props = {
  list: MarkdownMetaData[];
};

function RecentPosts({ list }: Props) {
  const { t } = useTranslation("home");
  return (
    <section className="mt-10">
      <div>
        <h1 className="text-xl font-bold">{t("recentPosts")}</h1>
        <MarkdownList redirectBase={"posts"} metaList={list}></MarkdownList>
        <Link href="/posts" className="hover: text-foreground">
          <span className="text-sm text-blue-400">{t("seeMore")}</span>
        </Link>
      </div>
    </section>
  );
}

export default RecentPosts;
