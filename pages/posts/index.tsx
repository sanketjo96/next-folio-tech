import React from "react";
import { GetStaticProps } from "next";
import { getPosts } from "@/lib/data/posts";
import MarkDownListWithFilter from "@/components/ui/Business/Markdown/MarkdownListWithFilter";
import { MarkdownMetaData } from "@/components/ui/Business/Markdown/MarkDownList";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

type PostsPageProps = {
  metaList: MarkdownMetaData[];
};

function Posts({ metaList }: PostsPageProps) {
  return (
    <section className="mt-8">
      <div className="container max-w-3xl">
        <MarkDownListWithFilter
          redirectBase="posts"
          metaList={metaList}
        ></MarkDownListWithFilter>
      </div>
    </section>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const posts = await getPosts();

  return {
    props: {
      metaList: posts,
      ...(await serverSideTranslations(locale as string, ["posts", "common"])),
    },
    revalidate: 10,
  };
};

export default Posts;
