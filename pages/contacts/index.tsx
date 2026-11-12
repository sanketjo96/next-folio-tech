import ContactForm from "@/components/ui/Business/Contact/ContactForm";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { PageHeader } from "@/components/ui/Business/PageHeader";
import { NextSeo } from "next-seo";
import { Paragraphs } from "@/components/ui/Business/Home/Paragraphs";

export default function Page() {
  const { t } = useTranslation("contacts");
  return (
    <>
      <NextSeo
        title="Contact · Sanket Joshi"
        description="Have an interesting idea? Get in touch with Sanket Joshi about technology, engineering challenges, collaborations or stand-up bookings."
        canonical="https://www.techsanket.in/contacts"
        openGraph={{ url: "https://www.techsanket.in/contacts" }}
      />
      <div className="container max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16">
          <PageHeader eyebrow="Contact" title={t("header")}>
            <div className="space-y-4">
              <Paragraphs text={t("body")} />
            </div>
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
