import React from "react";
import { GetStaticProps } from "next";
import { getProjects } from "@/lib/data/projects";
import { MarkdownMetaData } from "@/components/ui/Business/Markdown/MarkDownList";
import MarkDownListWithFilter from "@/components/ui/Business/Markdown/MarkdownListWithFilter";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { PageHeader } from "@/components/ui/Business/PageHeader";
import { NextSeo, BreadcrumbJsonLd } from "next-seo";

type ProjectsPageProps = {
  metaList: MarkdownMetaData[];
};
function Projects({ metaList }: ProjectsPageProps) {
  const { t } = useTranslation("common");
  return (
    <>
      <NextSeo
        title="Sanket Joshi | Projects | Showcasing React, Node.js, AWS Skills"
        canonical="https://www.techsanket.in/projects"
      />
      <BreadcrumbJsonLd
        type="ItemList"
        name="Projects List"
        itemListElements={[
          {
            position: 1,
            name: "Staff Augmentation and Digital Transformation",
            item: "https://techsanket.in/projects/project-6",
          },
          {
            position: 2,
            name: "Cloud-Based Remote Modem Management",
            item: "https://techsanket.in/projects/project-5",
          },
        ]}
      />
      <div className="container max-w-5xl">
        <PageHeader eyebrow="projects" title={t("projects")} />
        <div data-tour="projects-list">
          <MarkDownListWithFilter redirectBase="projects" metaList={metaList} />
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
