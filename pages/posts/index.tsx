import React from "react";
import { GetStaticProps } from "next";
import { getPosts } from "@/lib/data/posts";
import MarkDownListWithFilter from "@/components/ui/Business/Markdown/MarkdownListWithFilter";
import { MarkdownMetaData } from "@/components/ui/Business/Markdown/MarkDownList";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { PageHeader } from "@/components/ui/Business/PageHeader";
import { NextSeo } from "next-seo";

type PostsPageProps = {
  metaList: MarkdownMetaData[];
};

function Posts({ metaList }: PostsPageProps) {
  const { t } = useTranslation("common");
  return (
    <>
      <NextSeo
        title="Sanket Joshi | Posts | Showcasing React, Node.js, AWS Skills"
        canonical="https://www.techsanket.in/posts"
      />
      <div className="container max-w-5xl">
        <PageHeader eyebrow="posts" title={t("post")} />
        <div data-tour="posts-list">
          <MarkDownListWithFilter redirectBase="posts" metaList={metaList} />
        </div>
      </div>
    </>
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
