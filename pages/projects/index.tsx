import React from "react";
import { GetStaticProps } from "next";
import { getProjects } from "@/lib/data/projects";
import { MarkdownMetaData } from "@/components/ui/Business/Markdown/MarkDownList";
import MarkDownListWithFilter from "@/components/ui/Business/Markdown/MarkdownListWithFilter";

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

export const getStaticProps: GetStaticProps = async () => {
  const projects = await getProjects();

  return {
    props: {
      metaList: projects,
    },
  };
};

export default Projects;
