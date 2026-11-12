import React from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import MarkdownList, { MarkdownMetaData } from "../Markdown/MarkDownList";
import { SectionHeading } from "./SectionHeading";
import { seenAttrs } from "@/lib/analytics";
import { Paragraphs } from "./Paragraphs";

export default function FieldNotes({ posts }: { posts: MarkdownMetaData[] }) {
  const { t } = useTranslation("home");
  return (
    <section className="container mt-32 max-w-6xl" {...seenAttrs("Home: Writing")}>
      <SectionHeading
        index="06"
        label={t("notesEyebrow")}
        title={t("notesTitle")}
        action={
          <Link href="/posts" className="link-mono">
            {t("allWriting")} <ArrowUpRight className="size-3.5" />
          </Link>
        }
      />
      <div className="mt-6 max-w-2xl space-y-4 leading-relaxed text-foreground/75">
        <Paragraphs text={t("notesBody")} />
      </div>
      <div className="mt-10">
        <MarkdownList redirectBase="posts" metaList={posts} />
      </div>
      <Link href="/posts" className="link-mono mt-8 text-muted-foreground">
        {t("moreNotes")} <ArrowRight className="size-3.5" />
      </Link>
    </section>
  );
}
