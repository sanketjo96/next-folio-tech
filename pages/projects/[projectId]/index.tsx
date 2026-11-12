import React from "react";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { GetStaticPaths, GetStaticProps } from "next";
import {
  getProjectFileContent,
  getProjectFileNames,
} from "@/lib/data/projects";
import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { MarkdownMetaData } from "@/components/ui/Business/Markdown/MarkDownList";
import MdxContent from "@/components/ui/Business/Markdown/MdxContent";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";

type PostPageProps = {
  source: MDXRemoteSerializeResult;
  metaData: MarkdownMetaData;
};

function ProjectPage({ source, metaData }: PostPageProps) {
  const { t } = useTranslation("projects");
  const { title, image, author, publishDate } = metaData;
  return (
    <>
      <NextSeo
        title="Sanket Joshi | Projects | Showcasing React, Node.js, AWS Skills"
        canonical="https://www.techsanket.in/projects"
      />
      <article className="container prose prose-neutral max-w-3xl pt-12 dark:prose-invert prose-headings:font-display prose-headings:tracking-tight prose-a:text-brand prose-img:rounded-2xl md:pt-16">
        <Link
          href="/projects"
          className="not-prose group mb-10 inline-flex items-center gap-2 rounded-full border bg-card/70 px-4 py-2 text-sm text-muted-foreground no-underline backdrop-blur transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="transition-transform group-hover:-translate-x-0.5" />
          <span>{t("backToProjects")}</span>
        </Link>
        {image && (
          <div>
            <Image
              height={200}
              width={800}
              src={image}
              alt={title}
              className="aspect-[4/1] w-full object-cover"
            ></Image>
          </div>
        )}
        <header className="not-prose mt-6 font-medium text-xs uppercase tracking-[0.15em] text-muted-foreground">
          {author} · {formatDate(publishDate)}
        </header>
        <MdxContent {...source} />
      </article>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => {
  const files = await getProjectFileNames();
  const paths = files.flatMap((fileName) =>
    locales?.map((locale) => ({
      params: {
        projectId: fileName.replace(".md", ""),
      },
      locale: locale ?? "en",
    }))
  );
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const { projectId } = params as { projectId: string };
  const { metaData, content } = await getProjectFileContent(projectId);

  return {
    props: {
      source: content,
      metaData: metaData,
      ...(await serverSideTranslations(locale as string, [
        "projects",
        "common",
      ])),
    },
  };
};

export default ProjectPage;
