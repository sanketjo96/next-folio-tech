import ContactForm from "@/components/ui/Business/Contact/ContactForm";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { PageHeader } from "@/components/ui/Business/PageHeader";
import { NextSeo } from "next-seo";

export default function Page() {
  const { t } = useTranslation("contacts");
  return (
    <>
      <NextSeo
        title="Contact · Sanket Joshi"
        description="Get in touch with Sanket Joshi about engineering leadership roles, consulting, collaborations or stand-up bookings."
        canonical="https://www.techsanket.in/contacts"
        openGraph={{ url: "https://www.techsanket.in/contacts" }}
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
