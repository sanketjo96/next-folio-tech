import React from "react";
import { GetStaticProps } from "next";
import { getProjects } from "@/lib/data/projects";
import { MarkdownMetaData } from "@/components/ui/Business/Markdown/MarkDownList";
import MarkDownListWithFilter from "@/components/ui/Business/Markdown/MarkdownListWithFilter";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { PageHeader } from "@/components/ui/Business/PageHeader";
import { NextSeo } from "next-seo";

type ProjectsPageProps = {
  metaList: MarkdownMetaData[];
};
function Projects({ metaList }: ProjectsPageProps) {
  const { t } = useTranslation("common");
  return (
    <>
      <NextSeo
        title="Selected work · Sanket Joshi"
        description="Projects Sanket Joshi has led or built: React and Angular platforms, healthcare, retail, travel and cloud device management."
        canonical="https://www.techsanket.in/projects"
        openGraph={{ url: "https://www.techsanket.in/projects" }}
      />
      <div className="container max-w-6xl">
        <PageHeader eyebrow="04 / Selected work" title={t("projects")} />
        <div data-tour="projects-list">
          <MarkDownListWithFilter redirectBase="projects" metaList={metaList} variant="cards" />
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const projects = await getProjects();

  return {
    props: {
      metaList: projects,
      ...(await serverSideTranslations(locale as string, [
        "projects",
        "common",
      ])),
    },
  };
};

export default Projects;
