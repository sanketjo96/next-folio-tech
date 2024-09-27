import Introduction from "@/components/ui/Business/Introduction";
import { MarkdownMetaData } from "@/components/ui/Business/Markdown/MarkDownList";
import RecentPosts from "@/components/ui/Business/Post/RecentPosts";
import { ResumeDownloader } from "@/components/ui/Business/ResumeDownloader";
import SkillMetric from "@/components/ui/Business/SkillMetric";
import { downloadPDF } from "@/lib/common/pdfFileDownload";
import { resumePath, resumeURL } from "@/lib/constants/resume";
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
        <ResumeDownloader></ResumeDownloader>
        <SkillMetric></SkillMetric>
        <RecentPosts list={recentPosts}></RecentPosts>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const recentPosts = await getPosts(2);

  try {
    await downloadPDF(resumeURL, resumePath);
  } catch (e) {
    console.log("Error while downloading resume", e);
  }

  return {
    props: {
      ...(await serverSideTranslations(locale as string, ["home", "common"])),
      recentPosts,
    },
  };
};