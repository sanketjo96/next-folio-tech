import React from "react";
import { GetStaticProps } from "next";
import { getProjects } from "@/lib/data/projects";
import { MarkdownMetaData } from "@/components/ui/Business/Markdown/MarkDownList";
import MarkDownListWithFilter from "@/components/ui/Business/Markdown/MarkdownListWithFilter";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

type ProjectsPageProps = {
  metaList: MarkdownMetaData[];
};
function Projects({ metaList }: ProjectsPageProps) {
  return (
    <section className="mt-16">
      <div className="container max-w-3xl">
        <MarkDownListWithFilter
          redirectBase="projects"
          metaList={metaList}
        ></MarkDownListWithFilter>
      </div>
    </section>
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
