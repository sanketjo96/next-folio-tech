import React from "react";
import MarkdownList, { MarkdownMetaData } from "../Markdown/MarkDownList";
import Link from "next/link";
import { SectionHeading } from "../SkillMetric";

type Props = {
  list: MarkdownMetaData[];
};

function RecentProjects({ list }: Props) {
  return (
    <section className="mt-20">
      <SectionHeading
        eyebrow="Work"
        title="Recent Projects"
        action={
          <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground">
            See More
          </Link>
        }
      />
      <div className="mt-6">
        <MarkdownList redirectBase="projects" metaList={list} />
      </div>
    </section>
  );
}

export default RecentProjects;
