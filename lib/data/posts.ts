import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { serialize } from 'next-mdx-remote/serialize';
import { MarkdownMetaData } from "@/components/ui/Business/Markdown/MarkDownList";

const markdownDirPath = path.join("content", "posts");

export const getPostFileNames = async (limit?: number): Promise<string[]> => {
  const files = await fs.promises.readdir(markdownDirPath);
  return limit ? files.slice(0, limit) : files
}

export const getPostFilMetaData = async (fileName: string) => {
  const markdownFilePath = path.join(markdownDirPath, `${fileName}`);
  const markdownWithMeta = await fs.promises.readFile(
    markdownFilePath,
    "utf-8"
  );

  const { data } = matter(markdownWithMeta);
  return data as Omit<MarkdownMetaData, 'id'>;
}

export const getPostFileContent = async (postId: string) => {
  const markdownFilePath = path.join(markdownDirPath, `${postId}.md`);
  const markdownWithMeta = await fs.promises.readFile(
    markdownFilePath,
    "utf-8"
  );

  const { content, data } = matter(markdownWithMeta);
  return {
    content: await serialize(content),
    metaData: data as Omit<MarkdownMetaData, 'id'>
  };
}

export const getPosts = async (limit?: number): Promise<MarkdownMetaData[]> => {
  const files = await getPostFileNames();
  const posts = await Promise.all(files.map(
    async (file: string) => {
      const metaData = await getPostFilMetaData(file)
      return {
        id: file.replace(".md", ""),
        ...metaData,
      }
    }
  ));

  const sortedPosts = posts.sort((a, b) => {
    return new Date(a?.publishDate ?? '') < new Date(b?.publishDate ?? '') ? 1 : -1
  });

  return limit ? sortedPosts.slice(0, limit) : sortedPosts
}