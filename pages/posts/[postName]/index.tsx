import fs from "fs";
import { serialize } from "next-mdx-remote/serialize";
import path from "path";
import matter from "gray-matter";
import React from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { GetStaticPaths, GetStaticProps } from "next";

const markdownFilePath = path.join("content", "posts");

type PostPageProps = {
  source: MDXRemoteSerializeResult;
};

function PostPage({ source }: PostPageProps) {
  return (
    <div className="container max-w-3xl mt-8">
      <MDXRemote {...source} />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const files = await fs.promises.readdir(markdownFilePath);
  const paths = files.map((fileName) => ({
    params: {
      postName: fileName.replace(".md", ""),
    },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { postName } = params as { postName: string };
  const markdownFilePath = path.join("static", "posts", `${postName}.md`);
  const markdownWithMeta = await fs.promises.readFile(
    markdownFilePath,
    "utf-8"
  );

  const { content } = matter(markdownWithMeta);
  const mdxSource = await serialize(content);

  return {
    props: {
      source: mdxSource,
    },
  };
};

export default PostPage;
