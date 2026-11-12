import { NextSeo, SocialProfileJsonLd } from "next-seo";
import { MarkdownMetaData } from "@/components/ui/Business/Markdown/MarkDownList";
import Hero from "@/components/ui/Business/Home/Hero";
import Approach from "@/components/ui/Business/Home/Approach";
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
        title="Sanket Joshi · Founding Technical Lead & Frontend Tech Lead"
        description="Frontend tech lead with 10+ years building teams and shipping React, TypeScript and Node.js products."
        canonical="https://www.techsanket.in/"
      />
      <SocialProfileJsonLd
        type="Person"
        name="Sanket Joshi"
        url="https://techsanket.in"
        sameAs={[
          "https://www.facebook.com/techsanket",
          "https://www.linkedin.com/in/sanket-joshi-7baa23185",
          "https://twitter.com/techsanket",
        ]}
      />
      <Hero />
      <Approach />
      <ExperienceTimeline />
      <FieldNotes posts={recentPosts} />
      <SelectedWork projects={recentProjects} />
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