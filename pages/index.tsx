import Introduction from "@/components/ui/Business/Introduction";
import { MarkdownMetaData } from "@/components/ui/Business/Markdown/MarkDownList";
import RecentPosts from "@/components/ui/Business/Post/RecentPosts";
import SkillMetric from "@/components/ui/Business/SkillMetric";
import { getPosts } from "@/lib/data/posts";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

type PageProps = {
  recentPosts: MarkdownMetaData[];
  recentProjects: MarkdownMetaData[];
};

export default function Page({ recentPosts }: PageProps) {
  return (
    <div className="container max-w-3xl">
      <section>
        <Introduction></Introduction>
        <RecentPosts list={recentPosts}></RecentPosts>
        <SkillMetric></SkillMetric>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const recentPosts = await getPosts(2);
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ["home", "common"])),
      recentPosts,
    },
  };
};