import React from "react";
import { ProjectCard } from "../ProjectCard";

type Props = {};

export const ProjectCardContainer = (props: Props) => {
  return (
    <section className="mt-10">
      <h1 className="title no-underline font-bold">Professional Projects</h1>
      <ProjectCard></ProjectCard>
    </section>
  );
};
