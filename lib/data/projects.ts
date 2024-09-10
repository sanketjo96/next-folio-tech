import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { serialize } from 'next-mdx-remote/serialize';

const markdownDirPath = path.join("content", "projects");

export type ProjectMetaData = {
  title: string;
  author: string;
  image: string;
  publishDate: string;
  summary: string;
}

export type ProjectMetaDataWithId = {
  projectId: string;
  metaData: ProjectMetaData
}

export const getProjectFileNames = async (limit?: number): Promise<string[]> => {
  const files = await fs.promises.readdir(markdownDirPath);
  return limit ? files.slice(0, limit) : files
}

export const getProjectFilMetaData = async (fileName: string) => {
  const markdownFilePath = path.join(markdownDirPath, `${fileName}`);
  const markdownWithMeta = await fs.promises.readFile(
    markdownFilePath,
    "utf-8"
  );

  const { data } = matter(markdownWithMeta);
  return data as ProjectMetaData;
}

export const getProjectFileContent = async (projectId: string) => {
  const markdownFilePath = path.join(markdownDirPath, `${projectId}.md`);
  const markdownWithMeta = await fs.promises.readFile(
    markdownFilePath,
    "utf-8"
  );

  const { content, data } = matter(markdownWithMeta);
  return {
    content: await serialize(content),
    metaData: data as ProjectMetaData
  };
}

export const getProjects = async (limit?: number): Promise<ProjectMetaDataWithId[]> => {
  const files = await getProjectFileNames();
  const projects = await Promise.all(files.map(
    async (file: string) => {
      const metaData = await getProjectFilMetaData(file)
      return {
        projectId: file.replace(".md", ""),
        metaData,
      }
    }
  ));

  const sortedProjects = projects.sort((a, b) => {
    return new Date(a?.metaData?.publishDate ?? '') < new Date(b?.metaData?.publishDate ?? '') ? 1 : -1
  })
  return limit ? sortedProjects.slice(0, limit) : sortedProjects
}