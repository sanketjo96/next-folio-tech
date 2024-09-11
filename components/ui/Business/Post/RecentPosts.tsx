import React, { useState } from "react";
import MarkdownList, { MarkdownMetaData } from "../Markdown/MarkDownList";
import Link from "next/link";

type Props = {
  list: MarkdownMetaData[];
};

function RecentPosts({ list }: Props) {
  return (
    <section className="mt-10">
      <div>
        <h1 className="text-xl font-bold">Recent Posts</h1>
        <MarkdownList redirectBase={"posts"} metaList={list}></MarkdownList>
        <Link href="/posts" className="hover: text-foreground">
          <span className="text-sm text-blue-400">See More</span>
        </Link>
      </div>
    </section>
  );
}

export default RecentPosts;
