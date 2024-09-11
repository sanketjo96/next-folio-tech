import React, { useState } from "react";
import MarkdownList, { MarkdownMetaData } from "../Markdown/MarkDownList";
import Link from "next/link";

type Props = {
  list: MarkdownMetaData[];
};

function RecentProjects({ list }: Props) {
  return (
    <section className="mt-10">
      <div>
        <h2 className="title font-bold">Recent Projects</h2>
        <MarkdownList redirectBase={"projects"} metaList={list}></MarkdownList>
        <Link href="/projects" className="hover: text-foreground">
          <span className="text-sm text-blue-400">See More</span>
        </Link>
      </div>
    </section>
  );
}

export default RecentProjects;
