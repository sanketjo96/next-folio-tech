import React from "react";
import { GetStaticProps } from "next";
import { getPosts } from "@/lib/data/posts";
import MarkDownListWithFilter from "@/components/ui/Business/Markdown/MarkdownListWithFilter";
import { MarkdownMetaData } from "@/components/ui/Business/Markdown/MarkDownList";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { PageHeader } from "@/components/ui/Business/PageHeader";
import { NextSeo } from "next-seo";
import { Paragraphs } from "@/components/ui/Business/Home/Paragraphs";

type PostsPageProps = {
  metaList: MarkdownMetaData[];
};

function Posts({ metaList }: PostsPageProps) {
  const { t } = useTranslation("home");
  return (
    <>
      <NextSeo
        title="Technical blog · Sanket Joshi"
        description="Practical notes by Sanket Joshi on React, JavaScript, frontend architecture, security and lessons from real-world engineering."
        canonical="https://www.techsanket.in/posts"
        openGraph={{ url: "https://www.techsanket.in/posts" }}
      />
      <div className="container max-w-6xl">
        <PageHeader eyebrow={`06 / ${t("notesEyebrow")}`} title={t("notesTitle")}>
          <div className="space-y-4">
            <Paragraphs text={t("notesBody")} />
          </div>
        </PageHeader>
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
      ...(await serverSideTranslations(locale as string, ["posts", "common", "home"])),
    },
    revalidate: 10,
  };
};

export default Posts;
