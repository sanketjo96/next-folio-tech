import React from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { ArrowUpRight } from "lucide-react";
import MarkdownList, { MarkdownMetaData } from "../Markdown/MarkDownList";
import { SectionHeading } from "./SectionHeading";

export default function SelectedWork({ projects }: { projects: MarkdownMetaData[] }) {
  const { t } = useTranslation("home");
  return (
    <section className="container mt-32 max-w-6xl" id="work">
      <SectionHeading
        index="04"
        label={t("workEyebrow")}
        title={t("workTitle")}
        action={
          <Link href="/projects" className="link-mono">
            {t("allProjects")} <ArrowUpRight className="size-3.5" />
          </Link>
        }
      />
      <div className="mt-10">
        <MarkdownList redirectBase="projects" metaList={projects} variant="cards" />
      </div>
    </section>
  );
}
