import React from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import MarkdownList, { MarkdownMetaData } from "../Markdown/MarkDownList";
import { SectionHeading } from "./SectionHeading";
import { seenAttrs } from "@/lib/analytics";

export default function FieldNotes({ posts }: { posts: MarkdownMetaData[] }) {
  const { t } = useTranslation("home");
  return (
    <section className="container mt-32 max-w-6xl" {...seenAttrs("Home: Writing")}>
      <SectionHeading
        index="03"
        label={t("notesEyebrow")}
        title={t("notesTitle")}
        action={
          <Link href="/posts" className="link-mono">
            {t("allWriting")} <ArrowUpRight className="size-3.5" />
          </Link>
        }
      />
      <div className="mt-8">
        <MarkdownList redirectBase="posts" metaList={posts} />
      </div>
      <Link href="/posts" className="link-mono mt-8 text-muted-foreground">
        {t("moreNotes")} <ArrowRight className="size-3.5" />
      </Link>
    </section>
  );
}
