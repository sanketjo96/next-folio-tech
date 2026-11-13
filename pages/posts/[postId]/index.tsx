import React from "react";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { GetStaticPaths, GetStaticPathsContext, GetStaticProps } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { getPostFileContent, getPostFileNames } from "@/lib/data/posts";
import { MarkdownMetaData } from "@/components/ui/Business/Markdown/MarkDownList";
import MdxContent from "@/components/ui/Business/Markdown/MdxContent";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, articleJsonLd } from "@/lib/seo";

type PostPageProps = {
  source: MDXRemoteSerializeResult;
  metaData: MarkdownMetaData;
};

function PostPage({ source, metaData }: PostPageProps) {
  const { id, title, image, imageCredit, imageCreditUrl, author, publishDate, summary, linkedinUrl } =
    metaData;
  const url = absoluteUrl(`/posts/${id}`);
  const ogImage = image?.startsWith("/") ? absoluteUrl(image) : image;
  return (
    <>
      <NextSeo
        title={`${title} · Sanket Joshi`}
        description={summary}
        canonical={url}
        openGraph={{
          type: "article",
          url,
          title,
          description: summary,
          article: { publishedTime: publishDate, authors: [absoluteUrl("/")] },
          ...(ogImage ? { images: [{ url: ogImage, alt: title }] } : {}),
        }}
      />
      <JsonLd
        id="article"
        data={articleJsonLd({ type: "BlogPosting", url, title, description: summary, datePublished: publishDate })}
      />
      <article className="container prose prose-neutral max-w-3xl pt-12 dark:prose-invert prose-headings:font-display prose-headings:tracking-tight prose-a:text-brand prose-img:rounded-2xl md:pt-16">
        <Link
          href="/posts"
          className="not-prose group mb-10 inline-flex items-center gap-2 rounded-full border bg-card/70 px-4 py-2 text-sm text-muted-foreground no-underline backdrop-blur transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="transition-transform group-hover:-translate-x-0.5" />
          <span>Back To Posts</span>
        </Link>
        {image && (
          <div>
            <Image
              height={200}
              width={800}
              src={image}
              alt={title}
              className="aspect-[4/1] w-full object-cover"
            ></Image>
            {imageCredit && (
              <p className="not-prose mt-2 text-right text-[11px] text-muted-foreground">
                {imageCreditUrl ? (
                  <a href={imageCreditUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {imageCredit}
                  </a>
                ) : (
                  imageCredit
                )}
              </p>
            )}
          </div>
        )}
        <header className="not-prose mt-6 font-medium text-xs uppercase tracking-[0.15em] text-muted-foreground">
          {author} · {formatDate(publishDate)}
        </header>
        <MdxContent {...source} />
        {linkedinUrl && (
          <p className="not-prose mt-10 border-t pt-6 text-sm text-muted-foreground">
            Originally posted on LinkedIn.{" "}
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand hover:underline"
            >
              Join the discussion there ↗
            </a>
          </p>
        )}
      </article>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async ({
  locales = [],
}: GetStaticPathsContext) => {
  const files = await getPostFileNames();

  const paths = files.flatMap((fileName) =>
    locales?.map((locale) => ({
      params: {
        postId: fileName.replace(".md", ""),
      },
      locale: locale ?? "en",
    }))
  );

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const { postId } = params as { postId: string };
  const { metaData, content } = await getPostFileContent(postId);

  return {
    props: {
      source: content,
      metaData: { ...metaData, id: postId },
      ...(await serverSideTranslations(locale as string, ["posts", "common"])),
    },
    revalidate: 10,
  };
};

export default PostPage;
