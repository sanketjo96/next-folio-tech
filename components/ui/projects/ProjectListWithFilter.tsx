import { ProjectMetaDataWithId } from "@/lib/data/projects";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import ProjectList from "./ProjectList";
import { Button } from "@/components/ui/button";

type ProjectListWithFilterProps = {
  metaList: ProjectMetaDataWithId[];
};

const ProjectListWithFilter = (props: ProjectListWithFilterProps) => {
  const { metaList } = props;
  const [query, setQuery] = useState("");

  const filteredProjectsMeta = metaList.filter((projectMeta) => {
    return projectMeta.metaData.title.toLowerCase().includes(query);
  });

  return (
    <>
      <div className="flex gap-6">
        <Input
          className=""
          placeholder="Search Projects"
          onChange={(e) => setQuery(e.target.value)}
        ></Input>
        <Button disabled={!query} onClick={() => setQuery("")}>
          Reset
        </Button>
      </div>
      <ProjectList metaList={filteredProjectsMeta}></ProjectList>
    </>
  );
};

export default ProjectListWithFilter;
