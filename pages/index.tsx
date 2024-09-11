import Introduction from "@/components/ui/Business/Introduction";
import { MarkdownMetaData } from "@/components/ui/Business/Markdown/MarkDownList";
import RecentPosts from "@/components/ui/Business/Post/RecentPosts";
import RecentProjects from "@/components/ui/Business/Project/RecentProjects";
import SkillMetric from "@/components/ui/Business/SkillMetric";
import { getPosts } from "@/lib/data/posts";
import { getProjects } from "@/lib/data/projects";

type PageProps = {
  recentPosts: MarkdownMetaData[];
  recentProjects: MarkdownMetaData[];
};

export default function Page({ recentPosts, recentProjects }: PageProps) {
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

export const getStaticProps = async () => {
  const recentPosts = await getPosts(2);
  const recentProjects = await getProjects(2);

  return {
    props: {
      recentPosts,
    },
  };
};