import { ProjectMetaDataWithId } from "@/lib/data/projects";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import React from "react";

type ProjectListProps = {
  metaList: ProjectMetaDataWithId[];
};

const ProjectList = (props: ProjectListProps) => {
  const { metaList } = props;
  return (
    <ul>
      {metaList.map((item) => (
        <li key={item.projectId}>
          <Link
            href={`projects/${item.projectId}`}
            className="flex items-center justify-between gap-2 mt-2 mb-4"
          >
            <div className="max-w-lg">
              <p className="text-lg font-semibold">{item.metaData.title}</p>
              <p className="text-sm font-light">{item.metaData.summary}</p>
            </div>
            {item.metaData.publishDate && (
              <p className="mt-1 text-sm font-light">
                {formatDate(item.metaData.publishDate)}
              </p>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ProjectList;
