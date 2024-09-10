import React from "react";
import { GetStaticProps } from "next";
import { getProjects, ProjectMetaData } from "@/lib/data/projects";
import ProjectListWithFilter from "@/components/ui/projects/ProjectListWithFilter";

type PostPageProps = {
  metaList: {
    projectId: string;
    metaData: ProjectMetaData;
  }[];
};

function Projects({ metaList }: PostPageProps) {
  return (
    <section className="mt-16">
      <div className="container max-w-3xl">
        <ProjectListWithFilter metaList={metaList}></ProjectListWithFilter>
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
