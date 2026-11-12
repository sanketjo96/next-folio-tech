import React from "react";
import MarkdownList, { MarkdownMetaData } from "../Markdown/MarkDownList";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { SectionHeading } from "../SkillMetric";

type Props = {
  list: MarkdownMetaData[];
};

function RecentPosts({ list }: Props) {
  const { t } = useTranslation("home");
  return (
    <section className="mt-20">
      <SectionHeading
        eyebrow="02"
        title={t("recentPosts")}
        action={
          <Link
            href="/posts"
            className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            {t("seeMore")}
            <ArrowRightIcon className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        }
      />
      <div className="mt-6">
        <MarkdownList redirectBase="posts" metaList={list} />
      </div>
    </section>
  );
}

export default RecentPosts;
