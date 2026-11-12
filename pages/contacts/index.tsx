import ContactForm from "@/components/ui/Business/Contact/ContactForm";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { PageHeader } from "@/components/ui/Business/PageHeader";
import { NextSeo, LocalBusinessJsonLd } from "next-seo";

export default function Page() {
  const { t } = useTranslation("contacts");
  return (
    <>
      <NextSeo
        title="Sanket Joshi | Contacts | Showcasing React, Node.js, AWS Skills"
        canonical="https://www.techsanket.in/login"
      />
      <LocalBusinessJsonLd
        type="Organization"
        id="https://techsanket.in/contact"
        name="TechSanket"
        description="TechSanket is a web development freelance company specializing in providing tech solutions."
        url="https://techsanket.in/"
        telephone="+1-123-456-7890"
        address={{
          streetAddress: "1234 Tech Street",
          addressLocality: "Tech City",
          addressRegion: "TS",
          postalCode: "12345",
          addressCountry: "US",
        }}
        sameAs={[
          "https://www.facebook.com/techsanket",
          "https://www.linkedin.com/company/techsanket",
        ]}
      />
      <div className="container max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16">
          <PageHeader eyebrow="Let's talk" title={t("header")}>
            <p>{t("body")}</p>
          </PageHeader>
          <div className="surface p-6 sm:p-8 md:mt-20">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "contacts",
        "common",
      ])),
    },
  };
};
