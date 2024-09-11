import React from "react";
import { GetStaticProps } from "next";
import { getPosts } from "@/lib/data/posts";
import MarkDownListWithFilter from "@/components/ui/Business/Markdown/MarkdownListWithFilter";
import { MarkdownMetaData } from "@/components/ui/Business/Markdown/MarkDownList";

type PostsPageProps = {
  metaList: MarkdownMetaData[];
};

function Posts({ metaList }: PostsPageProps) {
  return (
    <section className="mt-16">
      <div className="container max-w-3xl">
        <MarkDownListWithFilter
          redirectBase="posts"
          metaList={metaList}
        ></MarkDownListWithFilter>
      </div>
    </section>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getPosts();

  return {
    props: {
      metaList: posts,
    },
  };
};

export default Posts;
