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
        title="Sanket Joshi | Projects"
        canonical="https://www.techsanket.in/projects"
      />
      <div className="container max-w-3xl prose dark:prose-invert mt-16">
        <Link
          href="/projects"
          className="no-underline flex items-center gap-3 mb-8"
        >
          <ArrowLeftIcon></ArrowLeftIcon>
          <span>{t("backToProjects")}</span>
        </Link>
        {image && (
          <div>
            <Image
              height={200}
              width={800}
              src={image}
              alt={title}
              className="object-cover"
            ></Image>
          </div>
        )}
        <header>
          <p>
            {author} | {formatDate(publishDate)}
          </p>
        </header>
        <MdxContent {...source} />
      </div>
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
