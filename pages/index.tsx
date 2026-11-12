import { NextSeo } from "next-seo";
import JsonLd from "@/components/JsonLd";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, absoluteUrl, personJsonLd } from "@/lib/seo";
import { MarkdownMetaData } from "@/components/ui/Business/Markdown/MarkDownList";
import Hero from "@/components/ui/Business/Home/Hero";
import Approach from "@/components/ui/Business/Home/Approach";
import Expertise from "@/components/ui/Business/Home/Expertise";
import Exploring from "@/components/ui/Business/Home/Exploring";
import ExperienceTimeline from "@/components/ui/Business/Home/ExperienceTimeline";
import FieldNotes from "@/components/ui/Business/Home/FieldNotes";
import SelectedWork from "@/components/ui/Business/Home/SelectedWork";
import Beyond from "@/components/ui/Business/Home/Beyond";
import ContactCta from "@/components/ui/Business/Home/ContactCta";
import { getProjects } from "@/lib/data/projects";
import { downloadPDF } from "@/lib/common/pdfFileDownload";
import { resumePath, resumeURL } from "@/lib/constants/resume";
import { getPosts } from "@/lib/data/posts";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

type PageProps = {
  recentPosts: MarkdownMetaData[];
  recentProjects: MarkdownMetaData[];
};

export default function Page({ recentPosts, recentProjects }: PageProps) {
  return (
    <>
      <NextSeo
        title={DEFAULT_TITLE}
        description={DEFAULT_DESCRIPTION}
        canonical={absoluteUrl("/")}
        openGraph={{
          type: "profile",
          url: absoluteUrl("/"),
          title: DEFAULT_TITLE,
          description: DEFAULT_DESCRIPTION,
        }}
      />
      <JsonLd id="person" data={personJsonLd} />
      <Hero />
      <Approach />
      <Expertise />
      <ExperienceTimeline />
      <SelectedWork projects={recentProjects} />
      <Exploring />
      <FieldNotes posts={recentPosts} />
      <Beyond />
      <ContactCta />
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const recentPosts = await getPosts(3);
  const recentProjects = await getProjects(4);

  try {
    await downloadPDF(resumeURL, resumePath);
  } catch (e) {
    console.log("Error while downloading resume", e);
  }

  return {
    props: {
      ...(await serverSideTranslations(locale as string, ["home", "common"])),
      recentPosts,
      recentProjects,
    },
  };
};