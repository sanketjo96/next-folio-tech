import ContactForm from "@/components/ui/Business/Contact/ContactForm";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo, LocalBusinessJsonLd } from "next-seo";

export default function Page() {
  const { t } = useTranslation("contacts");
  return (
    <>
      <NextSeo
        title="Sanket Joshi | Contacts"
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
      <section className="pb-24 mt-8">
        <div className="container max-w-3xl">
          <h1 className="title text-xl mb-8">{t("header")}</h1>
          <p className="text-muted-foreground text-md">{t("body")}</p>
          <ContactForm></ContactForm>
        </div>
      </section>
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
