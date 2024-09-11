import React from "react";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { GetStaticPaths, GetStaticProps } from "next";
import MdxContent from "@/components/ui/MdxContent";
import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { getPostFileContent, getPostFileNames } from "@/lib/data/posts";
import { MarkdownMetaData } from "@/components/ui/Markdown/MarkDownList";

type PostPageProps = {
  source: MDXRemoteSerializeResult;
  metaData: MarkdownMetaData;
};

function PostPage({ source, metaData }: PostPageProps) {
  const { title, image, author, publishDate } = metaData;
  return (
    <div className="container max-w-3xl prose dark:prose-invert mt-16">
      <Link href="/posts" className="no-underline flex items-center gap-3 mb-8">
        <ArrowLeftIcon></ArrowLeftIcon>
        <span>Back To Posts</span>
      </Link>
      {image && (
        <div>
          <Image
            height={200}
            width={800}
            src={image}
            alt={title}
            className="object-cover"
          ></Image>
        </div>
      )}
      <header>
        <p>
          {author} | {formatDate(publishDate)}
        </p>
      </header>
      <MdxContent {...source} />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const files = await getPostFileNames();
  const paths = files.map((fileName) => ({
    params: {
      postId: fileName.replace(".md", ""),
    },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { postId } = params as { postId: string };
  const { metaData, content } = await getPostFileContent(postId);

  return {
    props: {
      source: content,
      metaData: metaData,
    },
  };
};

export default PostPage;
